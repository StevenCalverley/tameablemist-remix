import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NowPlaying from "~/components/NowPlaying";
import Tracks from "~/components/Tracks";
import type { Playing } from "~/models/spotify.server";
import { getTopTracks, getNowPlaying } from "~/models/spotify.server";

type TTopTracks = Awaited<ReturnType<typeof getTopTracks>>;

export const loader: LoaderFunction = async () => {
  const tracksPromise = getTopTracks();
  const nowPlayingPromise = getNowPlaying();

  const [tracks, playing] = await Promise.all([
    tracksPromise,
    nowPlayingPromise,
  ]);

  return { tracks, playing };
};

export default function Index() {
  const { tracks, playing } = useLoaderData<{
    tracks: TTopTracks;
    playing: Playing;
  }>();
  return (
    <main className="container mx-auto max-w-3xl py-8">
      <Tracks tracks={tracks} />
      <footer className="mt-8 py-4 border-t">
        <NowPlaying playing={playing} />
      </footer>
    </main>
  );
}
