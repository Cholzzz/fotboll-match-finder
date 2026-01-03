import { VideoFeed } from "@/components/VideoFeed";
import { Helmet } from "react-helmet-async";

export default function Feed() {
  return (
    <>
      <Helmet>
        <title>Discover Players | Fotbollin</title>
        <meta
          name="description"
          content="Discover talented football players through highlight videos. Swipe to explore skills and connect with rising stars."
        />
      </Helmet>
      <VideoFeed />
    </>
  );
}