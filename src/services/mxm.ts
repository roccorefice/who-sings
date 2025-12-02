import type { Artist } from "../models/Artist";
import type {
  ChartTracksResponse,
  ChartArtistsResponse,
} from "../models/Chart";
import type {
  Track,
  Snippet,
  TrackSnippetResponse,
  TrackResponse,
} from "../models/Track";
import { buildProxyUrl, fetchWithRetry } from "../utils/helper";

const API = "https://api.musixmatch.com/ws/1.1";
const API_KEY = import.meta.env.VITE_MXM_API_KEY;


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

export async function getTrackSnippet(
  trackId: number
): Promise<Snippet | null> {
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

export async function getLyrics(trackId: number) {
  const endpoint = `${API}/track.lyrics.get?track_id=${trackId}&apikey=${API_KEY}`;
  const url = buildProxyUrl(endpoint);

  const response = await fetch(url);
  return response.json();
}
