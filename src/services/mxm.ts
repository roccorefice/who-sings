import type { Artist } from "../models/Artist";
import type { ChartArtistsResponse, ChartTracksResponse } from "../models/Chart";
import type { Snippet, Track, TrackResponse, TrackSnippetResponse } from "../models/Track";

const API = "https://api.musixmatch.com/ws/1.1";
const API_KEY = import.meta.env.VITE_MXM_API_KEY;

// Proxy CORS per bypassare il problema CORS del browser
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

// Helper per costruire URL con proxy
function buildProxyUrl(endpoint: string): string {
  return `${CORS_PROXY}${encodeURIComponent(endpoint)}`;
}

// Helper per retry con backoff
async function fetchWithRetry(
  url: string,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      
      // Se è un errore 500, riprova
      if (response.status >= 500 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
}

// ============ API FUNCTIONS ============

/**
 * Ottiene la lista delle canzoni più popolari
 * @param country Codice paese (es. 'it', 'us')
 * @param page Numero pagina
 * @param pageSize Numero risultati per pagina
 */
export async function getChartTracks(
  country: string = "us",
  page: number = 1,
  pageSize: number = 20
): Promise<Track[]> {
  const endpoint = `${API}/chart.tracks.get?apikey=${API_KEY}&country=${country}&chart_name=top&f_has_lyrics=1&page=${page}&page_size=${pageSize}`;
  const url = buildProxyUrl(endpoint);
  
  const response = await fetchWithRetry(url);
  const data: ChartTracksResponse = await response.json();

  if (data.message.header.status_code !== 200) {
    throw new Error("Failed to fetch chart tracks");
  }

  return data.message.body.track_list.map((item) => item.track);
}

/**
 * Ottiene uno snippet di testo per una traccia
 * @param trackId ID della traccia
 */
export async function getTrackSnippet(trackId: number): Promise<Snippet | null> {
  const endpoint = `${API}/track.snippet.get?track_id=${trackId}&apikey=${API_KEY}`;
  const url = buildProxyUrl(endpoint);
  
  try {
    const response = await fetchWithRetry(url);
    const data: TrackSnippetResponse = await response.json();

    if (data.message.header.status_code !== 200) {
      return null;
    }

    return data.message.body.snippet;
  } catch (error) {
    console.error(`Failed to get snippet for track ${trackId}:`, error);
    return null;
  }
}

/**
 * Ottiene le informazioni complete di una traccia
 * @param trackId ID della traccia
 */
export async function getTrack(trackId: number): Promise<Track> {
  const endpoint = `${API}/track.get?track_id=${trackId}&apikey=${API_KEY}`;
  const url = buildProxyUrl(endpoint);
  
  const response = await fetch(url);
  const data: TrackResponse = await response.json();

  if (data.message.header.status_code !== 200) {
    throw new Error("Failed to fetch track");
  }

  return data.message.body.track;
}

/**
 * Ottiene la lista degli artisti più popolari
 * @param country Codice paese (es. 'it', 'us')
 * @param page Numero pagina
 * @param pageSize Numero risultati per pagina
 */
export async function getChartArtists(
  country: string = "us",
  page: number = 1,
  pageSize: number = 20
): Promise<Artist[]> {
  const endpoint = `${API}/chart.artists.get?apikey=${API_KEY}&country=${country}&page=${page}&page_size=${pageSize}`;
  const url = buildProxyUrl(endpoint);
  
  const response = await fetch(url);
  const data: ChartArtistsResponse = await response.json();

  if (data.message.header.status_code !== 200) {
    throw new Error("Failed to fetch chart artists");
  }

  return data.message.body.artist_list.map((item) => item.artist);
}

/**
 * Ottiene i testi di una traccia
 * @param trackId ID della traccia
 */
export async function getLyrics(trackId: number) {
  const endpoint = `${API}/track.lyrics.get?track_id=${trackId}&apikey=${API_KEY}`;
  const url = buildProxyUrl(endpoint);
  
  const response = await fetch(url);
  return response.json();
}

// ============ GAME HELPER FUNCTIONS ============

export interface QuizQuestion {
  trackId: number;
  trackName: string;
  snippet: string;
  correctArtist: string;
  options: string[];
}

/**
 * Genera una domanda per il quiz
 * @param track La traccia da cui generare la domanda
 * @param wrongArtists Lista di artisti sbagliati per le opzioni
 */
async function generateQuestion(
  track: Track,
  wrongArtists: Artist[]
): Promise<QuizQuestion | null> {
  // Ottieni lo snippet
  const snippet = await getTrackSnippet(track.track_id);

  // Se non c'è snippet o la canzone è strumentale, skippa
  if (!snippet || snippet.instrumental === 1 || !snippet.snippet_body) {
    return null;
  }

  // Filtra artisti diversi dall'artista corretto
  const availableWrongArtists = wrongArtists.filter(
    (a) => a.artist_name !== track.artist_name
  );

  // Se non abbiamo abbastanza opzioni sbagliate, skippa
  if (availableWrongArtists.length < 2) {
    return null;
  }

  // Randomizza e prendi 2 artisti sbagliati casuali
  const shuffledWrongArtists = availableWrongArtists
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .map((a) => a.artist_name);

  // Crea array con tutte le opzioni e mischia
  const options = [track.artist_name, ...shuffledWrongArtists].sort(
    () => Math.random() - 0.5
  );

  return {
    trackId: track.track_id,
    trackName: track.track_name,
    snippet: snippet.snippet_body,
    correctArtist: track.artist_name,
    options,
  };
}

/**
 * Genera tutte le domande per una partita
 * @param numQuestions Numero di domande da generare
 * @param country Codice paese per le classifiche
 */
export async function generateQuizQuestions(
  numQuestions: number = 5,
  country: string = "us"
): Promise<QuizQuestion[]> {
  try {
    // Ottieni le tracce popolari e gli artisti (con più risultati per avere alternative)
    const [tracks, artists] = await Promise.all([
      getChartTracks(country, 1, 50),
      getChartArtists(country, 1, 50),
    ]);

    // Filtra solo le canzoni con testi (già filtrato da f_has_lyrics=1)
    const tracksWithLyrics = tracks.filter((t) => t.instrumental === 0);

    const questions: QuizQuestion[] = [];
    let attempts = 0;
    const maxAttempts = tracksWithLyrics.length;

    // Genera domande finché non ne abbiamo abbastanza
    while (questions.length < numQuestions && attempts < maxAttempts) {
      const randomTrack =
        tracksWithLyrics[Math.floor(Math.random() * tracksWithLyrics.length)];
      
      // Evita tracce già usate
      if (questions.some((q) => q.trackId === randomTrack.track_id)) {
        attempts++;
        continue;
      }

      const question = await generateQuestion(randomTrack, artists);
      
      if (question) {
        questions.push(question);
      }
      
      attempts++;
    }

    return questions;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw error;
  }
}