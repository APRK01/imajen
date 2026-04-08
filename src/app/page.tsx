import { MasonryGrid } from "@/components/MasonryGrid";
import { TopicChips } from "@/components/TopicChips";

export default function Home() {
  return (
    <div className="flex-1 px-6 md:px-12 pb-20 max-w-[1600px] mx-auto">
      <div className="pt-8">
        <TopicChips />
        <MasonryGrid />
      </div>
    </div>
  );
}
