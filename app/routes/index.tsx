import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Tracks from "~/components/Tracks";
import { getTopTracks } from "~/models/spotify.server";

export const loader: LoaderFunction = async () => {
  const tracks = await getTopTracks();

  return tracks;
};

export default function Index() {
  const tracks = useLoaderData();
  return (
    <div className="container mx-auto">
      <Tracks tracks={tracks} />
    </div>
  );
}
