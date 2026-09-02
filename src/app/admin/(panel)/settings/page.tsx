import { getContent } from "@/lib/content";
import { getMediaUsage } from "../../actions";
import SettingsEditor from "./SettingsEditor";
import StoragePanel from "./StoragePanel";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [content, usage] = await Promise.all([getContent(), getMediaUsage()]);
  const mailReady = Boolean(process.env.RESEND_API_KEY);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Settings</h1>
          <p>Contact details, email notifications, campaign pixels and storage</p>
        </div>
      </div>
      {!mailReady ? (
        <div className="mail-warn">
          Email delivery is not configured (missing RESEND_API_KEY). Leads will still be stored in the
          panel, but no notification will be sent.
        </div>
      ) : null}
      <SettingsEditor initial={content} />
      <StoragePanel usage={usage} />
    </>
  );
}
