import { getDb } from "./db";

// Web Stories -- short video content (farming tips, machinery, livestock
// care, success stories). Placeholder set below links to a YouTube search
// for each topic rather than a specific video, and uses generic themed
// stock photography for the thumbnail -- deliberately NOT hotlinking any
// specific curated video selection from a prior project. Real content
// (ideally the Solipeta pilot farmers' own videos) should replace this via
// the web_stories table once there's something real to show.

export type WebStory = {
  title: string;
  category: string;
  thumbnailUrl: string;
  href: string; // YouTube search until real curated videos exist
};

export const MOCK_WEB_STORIES: WebStory[] = [
  { title: "Smart farming in action", category: "Innovation", thumbnailUrl: "https://loremflickr.com/400/700/smartfarming,agritech", href: "https://www.youtube.com/results?search_query=smart+farming+india" },
  { title: "Drip irrigation setup, step by step", category: "Technique", thumbnailUrl: "https://loremflickr.com/400/700/dripirrigation", href: "https://www.youtube.com/results?search_query=drip+irrigation+setup+telangana" },
  { title: "From field to harvest", category: "Harvest", thumbnailUrl: "https://loremflickr.com/400/700/paddyharvest", href: "https://www.youtube.com/results?search_query=paddy+harvest+telangana" },
  { title: "Livestock and dairy care basics", category: "Livestock", thumbnailUrl: "https://loremflickr.com/400/700/dairycow,india", href: "https://www.youtube.com/results?search_query=dairy+cattle+care+india" },
  { title: "Natural pest control that works", category: "Crop care", thumbnailUrl: "https://loremflickr.com/400/700/organicfarming", href: "https://www.youtube.com/results?search_query=natural+pest+control+farming+india" },
  { title: "Power tiller maintenance tips", category: "Machinery", thumbnailUrl: "https://loremflickr.com/400/700/tractor,farmmachinery", href: "https://www.youtube.com/results?search_query=power+tiller+maintenance" },
];

export async function getWebStories(): Promise<WebStory[]> {
  try {
    const db = getDb();
    const { rows } = await db.query(
      `SELECT title, category, youtube_id AS "youtubeId" FROM web_stories ORDER BY display_order`
    );
    if (rows.length > 0) {
      return rows.map((r: { title: string; category: string; youtubeId: string }) => ({
        title: r.title,
        category: r.category,
        thumbnailUrl: `https://i.ytimg.com/vi/${r.youtubeId}/hqdefault.jpg`,
        href: `https://www.youtube.com/watch?v=${r.youtubeId}`,
      }));
    }
  } catch {
    // Cloud SQL not provisioned yet, or table empty -- fall through to placeholder set.
  }
  return MOCK_WEB_STORIES;
}
