import ManageUsersClient from "./manage-users-client";

export default function ManageUsersPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container-portal py-12">
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-primary">
              ADMIN / USER_MGMT
            </span>
          </div>
          <h1 className="font-headline text-3xl font-bold uppercase tracking-[-0.06em]">
            User Management
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
            Browse, search, edit, and remove user accounts
          </p>
        </div>

        <ManageUsersClient />
      </div>
    </main>
  );
}
