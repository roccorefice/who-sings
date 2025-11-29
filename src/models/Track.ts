export interface TrackSnippetResponse {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: {
      snippet: Snippet;
    };
  };
}

export interface TrackResponse {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: {
      track: Track;
    };
  };
}

export interface Track {
  track_id: number;
  track_name: string;
  artist_id: number;
  artist_name: string;
  album_name: string;
  has_lyrics: number;
  instrumental: number;
  track_rating: number;
  explicit: number;
}

export interface Snippet {
  snippet_id: number;
  snippet_body: string;
  snippet_language: string;
  instrumental: number;
  restricted: number;
}