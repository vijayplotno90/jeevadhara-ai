import { getWebStories } from "@/lib/webStories";

export default async function WebStoriesPage() {
  const stories = await getWebStories();

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-farm-green to-emerald-700 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-serif text-3xl font-bold text-white">📱 Web Stories</h1>
          <p className="mt-1 max-w-2xl text-green-100">
            Short farming videos — tips, livestock care, machinery, and success stories. Tap any
            reel to watch.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-5 text-sm text-gray-500">
          {stories.length} reels · placeholder topics until real pilot-farmer videos replace them
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stories.map((s) => (
            <a
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl border border-gray-100 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="aspect-[9/16] w-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.thumbnailUrl} alt={s.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-3">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-farm-green">{s.category}</span>
                <p className="mt-0.5 text-xs font-bold leading-snug text-gray-900">{s.title}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
