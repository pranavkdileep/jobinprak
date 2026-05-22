import { getUserProfile } from "@/actions/user/profile";
import {
  resendVerificationEmail,
  updateNotificationSettings,
  updateWhatsAppNumber,
  updateTelegramNumber,
  toggleWhatsAppNotification,
  toggleTelegramNotification,
} from "@/actions/user/settings";
import { DashboardShell } from "@/components/dashboard-shell";
import type { User } from "@/types/user";
import { redirect } from "next/navigation";

type SettingsSearchParams = Promise<{
  success?: string | string[];
  error?: string | string[];
}>;

type SettingsUser = Omit<User, "password" | "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: SettingsSearchParams;
}) {
  const params = await searchParams;
  const result = await getUserProfile();
  const user = "user" in result ? (result.user as SettingsUser) : null;
  const success = first(params.success);
  const error = first(params.error);

  async function resendEmailAction() {
    "use server";
    const response = await resendVerificationEmail();
    if ("error" in response) {
      redirect(`/dash/settings?error=${encodeURIComponent(response.error ?? "Failed to resend email")}`);
    }
    redirect(`/dash/settings?success=${encodeURIComponent(response.message ?? "Verification email sent")}`);
  }

  async function updateNotificationAction(formData: FormData) {
    "use server";
    const data = {
      newJob: formData.get("newJob") === "on",
      newsletter: formData.get("newsletter") === "on",
      promotions: formData.get("promotions") === "on",
    };
    const response = await updateNotificationSettings(data);
    if ("error" in response) {
      redirect(`/dash/settings?error=${encodeURIComponent(response.error ?? "Failed to update settings")}`);
    }
    redirect(`/dash/settings?success=${encodeURIComponent(response.message ?? "Notification settings updated")}`);
  }

  async function updateWhatsAppAction(formData: FormData) {
    "use server";
    const response = await updateWhatsAppNumber(String(formData.get("whatsappNumber") ?? "").trim());
    if ("error" in response) {
      redirect(`/dash/settings?error=${encodeURIComponent(response.error ?? "Failed to update number")}`);
    }
    redirect(`/dash/settings?success=${encodeURIComponent(response.message ?? "WhatsApp number updated")}`);
  }

  async function updateTelegramAction(formData: FormData) {
    "use server";
    const response = await updateTelegramNumber(String(formData.get("telegramNumber") ?? "").trim());
    if ("error" in response) {
      redirect(`/dash/settings?error=${encodeURIComponent(response.error ?? "Failed to update number")}`);
    }
    redirect(`/dash/settings?success=${encodeURIComponent(response.message ?? "Telegram number updated")}`);
  }

  async function toggleWhatsAppAction(formData: FormData) {
    "use server";
    const enabled = formData.get("enabled") === "true";
    const response = await toggleWhatsAppNotification(enabled);
    if ("error" in response) {
      redirect(`/dash/settings?error=${encodeURIComponent(response.error ?? "Failed to toggle")}`);
    }
    redirect(`/dash/settings?success=${encodeURIComponent(response.message ?? "WhatsApp notification toggled")}`);
  }

  async function toggleTelegramAction(formData: FormData) {
    "use server";
    const enabled = formData.get("enabled") === "true";
    const response = await toggleTelegramNotification(enabled);
    if ("error" in response) {
      redirect(`/dash/settings?error=${encodeURIComponent(response.error ?? "Failed to toggle")}`);
    }
    redirect(`/dash/settings?success=${encodeURIComponent(response.message ?? "Telegram notification toggled")}`);
  }

  return (
    <DashboardShell active="settings">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 border-b-2 border-on-surface pb-6 md:mb-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                {"//"} System_Preferences
              </p>
              <h1 className="font-headline text-[clamp(2.8rem,8vw,4.5rem)] font-bold leading-none tracking-[-0.08em] text-on-surface">
                Command Center
              </h1>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded border border-outline-variant bg-surface-container-low px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-on-surface shadow-ambient">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              Config_Mode: Active
            </div>
          </div>
        </header>

        {success && <StatusMessage tone="success" message={success} />}
        {error && <StatusMessage tone="error" message={error} />}

        <div className="space-y-8">
          {!user?.isVerified && (
            <SettingsModule index="00" title="Identity Verification" urgency="critical">
              <div className="flex flex-col gap-4 rounded-xl border border-error/30 bg-error/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-headline text-lg font-semibold uppercase tracking-[-0.04em] text-error">
                    Verification Required
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
                    Email protocol not authenticated. Resend verification signal.
                  </p>
                </div>
                <form action={resendEmailAction}>
                  <button className="settings-primary-button">
                    <MailIcon className="size-4 transition-transform group-hover:rotate-12" />
                    Resend Verification
                  </button>
                </form>
              </div>
            </SettingsModule>
          )}

          {user?.isVerified && (
            <SettingsModule index="00" title="Identity Verification" urgency="ok">
              <div className="flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <CheckIcon className="size-5 text-primary" />
                </span>
                <div>
                  <p className="font-headline text-lg font-semibold uppercase tracking-[-0.04em] text-primary">
                    Identity Authenticated
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
                    Email verified. All systems operational.
                  </p>
                </div>
              </div>
            </SettingsModule>
          )}

          <form action={updateNotificationAction}>
            <SettingsModule index="01" title="Notification Matrix">
              <div className="space-y-4">
                <ToggleRow
                  label="New Job Alerts"
                  description="Receive signals when new protocols match your profile"
                  name="newJob"
                  defaultChecked={user?.notificationSettings?.newJob ?? true}
                />
                <ToggleRow
                  label="Newsletter Digest"
                  description="Periodic intelligence briefings delivered to your inbox"
                  name="newsletter"
                  defaultChecked={user?.notificationSettings?.newsletter ?? true}
                />
                <ToggleRow
                  label="Promotions & Offers"
                  description="Marketing transmissions and premium access codes"
                  name="promotions"
                  defaultChecked={user?.notificationSettings?.promotions ?? false}
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button type="submit" className="settings-primary-button">
                  <SyncIcon className="size-4 transition-transform group-hover:rotate-180" />
                  Synchronize Preferences
                </button>
              </div>
            </SettingsModule>
          </form>

          <form action={updateWhatsAppAction}>
            <SettingsModule index="02" title="WhatsApp Uplink">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="group block">
                    <span className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant transition-colors group-focus-within:text-primary">
                      WhatsApp Number
                    </span>
                    <input
                      className="settings-input"
                      name="whatsappNumber"
                      type="tel"
                      defaultValue={user?.whatsappNumber ?? ""}
                      placeholder="+91 98765 43210"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-on-surface-variant">
                  Connect your WhatsApp node for direct messaging
                </p>
                <button type="submit" className="settings-primary-button">
                  <SyncIcon className="size-4 transition-transform group-hover:rotate-180" />
                  Register Number
                </button>
              </div>
            </SettingsModule>
          </form>

          <form action={toggleWhatsAppAction}>
            <input type="hidden" name="enabled" value={user?.whatsappNotification ? "false" : "true"} />
            <SettingsModule index="03" title="WhatsApp Notification Toggle">
              <div className="flex items-center justify-between rounded-xl border border-outline-variant/70 bg-surface-container-low/60 p-5">
                <div className="flex items-center gap-4">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${user?.whatsappNotification ? "bg-primary/15" : "bg-on-surface-variant/10"}`}>
                    <BellIcon className={`size-5 transition-colors ${user?.whatsappNotification ? "text-primary" : "text-on-surface-variant"}`} />
                  </span>
                  <div>
                    <p className="font-headline text-lg font-semibold uppercase tracking-[-0.04em] text-on-surface">
                      WhatsApp Alerts
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
                      {user?.whatsappNotification ? "Active — receiving signals" : "Inactive — signals muted"}
                    </p>
                  </div>
                </div>
                <button type="submit" className={`settings-toggle-button ${user?.whatsappNotification ? "active" : ""}`}>
                  <span className={`settings-toggle-track ${user?.whatsappNotification ? "active" : ""}`}>
                    <span className={`settings-toggle-thumb ${user?.whatsappNotification ? "active" : ""}`} />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.12em]">
                    {user?.whatsappNotification ? "Disable" : "Enable"}
                  </span>
                </button>
              </div>
            </SettingsModule>
          </form>

          <form action={updateTelegramAction}>
            <SettingsModule index="04" title="Telegram Uplink">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="group block">
                    <span className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant transition-colors group-focus-within:text-primary">
                      Telegram Chat ID
                    </span>
                    <input
                      className="settings-input"
                      name="telegramNumber"
                      type="text"
                      defaultValue={user?.telegramNumber ?? ""}
                      placeholder="123456789"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-on-surface-variant">
                  Link your Telegram handle for encrypted notifications
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://t.me/jobinparkbot?start=settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant transition hover:border-primary hover:text-primary"
                  >
                    <TelegramIcon className="size-4 transition-transform group-hover:scale-110" />
                    Get Chat ID
                  </a>
                  <button type="submit" className="settings-primary-button">
                    <SyncIcon className="size-4 transition-transform group-hover:rotate-180" />
                    Register Handle
                  </button>
                </div>
              </div>
            </SettingsModule>
          </form>

          <form action={toggleTelegramAction}>
            <input type="hidden" name="enabled" value={user?.telegramNotification ? "false" : "true"} />
            <SettingsModule index="05" title="Telegram Notification Toggle">
              <div className="flex items-center justify-between rounded-xl border border-outline-variant/70 bg-surface-container-low/60 p-5">
                <div className="flex items-center gap-4">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${user?.telegramNotification ? "bg-primary/15" : "bg-on-surface-variant/10"}`}>
                    <SendIcon className={`size-5 transition-colors ${user?.telegramNotification ? "text-primary" : "text-on-surface-variant"}`} />
                  </span>
                  <div>
                    <p className="font-headline text-lg font-semibold uppercase tracking-[-0.04em] text-on-surface">
                      Telegram Alerts
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
                      {user?.telegramNotification ? "Active — receiving signals" : "Inactive — signals muted"}
                    </p>
                  </div>
                </div>
                <button type="submit" className={`settings-toggle-button ${user?.telegramNotification ? "active" : ""}`}>
                  <span className={`settings-toggle-track ${user?.telegramNotification ? "active" : ""}`}>
                    <span className={`settings-toggle-thumb ${user?.telegramNotification ? "active" : ""}`} />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.12em]">
                    {user?.telegramNotification ? "Disable" : "Enable"}
                  </span>
                </button>
              </div>
            </SettingsModule>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}

function SettingsModule({
  children,
  index,
  title,
  urgency = "normal",
}: {
  children: React.ReactNode;
  index: string;
  title: string;
  urgency?: "normal" | "critical" | "ok";
}) {
  const urgencyBorder = urgency === "critical"
    ? "border-error/40 hover:border-error/60"
    : urgency === "ok"
      ? "border-primary/40 hover:border-primary/60"
      : "border-outline-variant hover:border-primary/60";

  return (
    <section className={`scan-card group relative overflow-hidden rounded-2xl border ${urgencyBorder} bg-white/84 p-6 shadow-ambient backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-electric`}>
      <div className="dash-crosshair absolute left-0 top-0" />
      <div className="dash-crosshair absolute bottom-0 right-0" />
      <div className="mb-6 flex items-center gap-4 border-b border-outline-variant pb-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-on-surface-variant">{"//"} {index}</span>
        <h2 className="font-headline text-2xl font-semibold tracking-[-0.05em] text-on-surface">{title}</h2>
        <div className="h-px flex-1 bg-outline-variant" />
      </div>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  description,
  name,
  defaultChecked,
}: {
  label: string;
  description: string;
  name: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-outline-variant/70 bg-surface-container-low/40 p-4 transition duration-300 hover:border-primary/50 hover:bg-surface-container-low/70">
      <div>
        <span className="block font-headline text-base font-semibold uppercase tracking-[-0.04em] text-on-surface transition-colors group-hover:text-primary">
          {label}
        </span>
        <span className="mt-0.5 block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-on-surface-variant">
          {description}
        </span>
      </div>
      <span className="relative inline-flex shrink-0 items-center">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="toggle-checkbox" />
        <span className="settings-toggle-track">
          <span className="settings-toggle-thumb" />
        </span>
      </span>
    </label>
  );
}

function StatusMessage({ tone, message }: { tone: "success" | "error"; message: string }) {
  return (
    <div className={`mb-6 rounded-xl border px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] shadow-ambient ${tone === "success" ? "border-primary/30 bg-primary/10 text-primary" : "border-error/30 bg-error/10 text-error"}`}>
      {tone === "success" ? "SYNC_OK" : "SYNC_ERROR"}: {message}
    </div>
  );
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function MailIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 5h18v14H3zM3 5l9 7 9-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TelegramIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 3L2 10l7 3 9-6-6 8 3 3 6-15z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SyncIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11a8 8 0 0 0-14.8-4M4 4v5h5M4 13a8 8 0 0 0 14.8 4M20 20v-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
