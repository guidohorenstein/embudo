import { getContent, getContentVersion } from "@/lib/content";
import ContentEditor from "./ContentEditor";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const [content, version] = await Promise.all([getContent(), getContentVersion()]);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Website</h1>
          <p>Changes go live on the site as soon as you save</p>
        </div>
        <a className="btn-a btn-ghost btn-sm" href="/" target="_blank" rel="noopener">
          Preview →
        </a>
      </div>
      <ContentEditor initial={content} initialVersion={version} />
    </>
  );
}
