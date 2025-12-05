import type { Artist } from "../models/Artist";
import type { QuizQuestion } from "../models/Quiz";
import type { Track } from "../models/Track";
import { getChartArtists, getChartTracks, getTrackSnippet } from "../services/mxm";


// corsproxy.io
const CORS_PROXY = "https://corsproxy.io/?";

// URL con proxy
export function buildProxyUrl(endpoint: string): string {
  return `${CORS_PROXY}${encodeURIComponent(endpoint)}`;
}

export async function fetchWithRetry(
  url: string,
  maxRetries: number = 2,
  delay: number = 1500
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);

      if (response.ok) return response;

      if (response.status >= 500 && i < maxRetries - 1) {
        console.warn(
          `Server error (${response.status}), retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.warn(`Network error, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}


async function generateQuestion(
    track: Track,
    wrongArtists: Artist[]
): Promise<QuizQuestion | null> {
    const snippet = await getTrackSnippet(track.track_id);

    if (!snippet || snippet.instrumental === 1 || !snippet.snippet_body) {
        return null;
    }

    const availableWrongArtists = wrongArtists.filter(
        (a) => a.artist_name !== track.artist_name
    );

    if (availableWrongArtists.length < 2) {
        return null;
    }

    const shuffledWrongArtists = availableWrongArtists
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map((a) => a.artist_name);

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


export async function generateQuizQuestions(
    numQuestions: number = 5,
    country: string = "us"
): Promise<QuizQuestion[]> {
    try {
        const [tracks, artists] = await Promise.all([
            getChartTracks(country, 1, 50),
            getChartArtists(country, 1, 50),
        ]);

        const tracksWithLyrics = tracks.filter((t) => t.instrumental === 0);

        const questions: QuizQuestion[] = [];
        let attempts = 0;
        const maxAttempts = tracksWithLyrics.length;

        while (questions.length < numQuestions && attempts < maxAttempts) {
            const randomTrack =
                tracksWithLyrics[Math.floor(Math.random() * tracksWithLyrics.length)];

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