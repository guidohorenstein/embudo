import { getContent, getContentVersion } from "@/lib/content";
import { getMediaUsage } from "../../actions";
import SettingsEditor from "./SettingsEditor";
import StoragePanel from "./StoragePanel";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [content, usage, version] = await Promise.all([getContent(), getMediaUsage(), getContentVersion()]);
  const mailReady = Boolean(process.env.RESEND_API_KEY);
  // El remitente de prueba de Resend solo entrega a la casilla de la propia
  // cuenta: la confirmacion al cliente falla siempre y es facil no notarlo.
  const testSender = (process.env.MAIL_FROM ?? "").includes("resend.dev");

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
      {mailReady && testSender ? (
        <div className="mail-warn">
          <strong>Using Resend&rsquo;s test sender.</strong> Notifications to the studio work, but the
          auto-reply to clients is rejected for every address except the Resend account owner&rsquo;s.
          Verify a domain at resend.com/domains and point <code>MAIL_FROM</code> at it to start
          delivering to real clients.
        </div>
      ) : null}
      <SettingsEditor initial={content} initialVersion={version} />
      <StoragePanel usage={usage} />
    </>
  );
}
