import type { Artist } from "./Artist";
import type { Track } from "./Track";

export interface ChartTracksResponse {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: {
      track_list: Array<{ track: Track }>;
    };
  };
}

export interface ChartArtistsResponse {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: {
      artist_list: Array<{ artist: Artist }>;
    };
  };
}