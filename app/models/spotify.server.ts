import querystring from "querystring";

export type Image = {
  url: string;
};
export type ArtistResponse = {
  name: string;
};

export type AlbumResponse = {
  name: string;
  images: Image[];
};

export type TrackResponse = {
  artists: ArtistResponse[];
  name: string;
  external_urls: {
    spotify: string;
  };
};

export type SongResponse = {
  artists: ArtistResponse[];
  album: AlbumResponse;
  name: string;
  external_urls: {
    spotify: string;
  };
};

export type TrackApiResponse = {
  items: TrackResponse[];
};

export type PlayingApiResponse = {
  is_playing: boolean;
  item: SongResponse;
};

export type Track = {
  artist: string;
  songUrl: string;
  title: string;
};

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const token = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
  return response.json();
};

export const getTopTracks = async (): Promise<Track[]> => {
  const { access_token } = await getAccessToken();

  const response = await fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data: TrackApiResponse = await response.json();

  const tracks = data.items.slice(0, 10).map((track) => ({
    artist: track.artists.map((_artist) => _artist.name).join(", "),
    songUrl: track.external_urls.spotify,
    title: track.name,
  }));

  return tracks;
};

export const getNowPlaying = async (): Promise<any> => {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
