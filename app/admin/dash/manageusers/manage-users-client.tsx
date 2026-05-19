"use client";

import { deleteUser, editUser, getUser, listUsers } from "@/actions/admin/mng-users";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@/types/user";

interface UserRow {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobDomain: string;
  createdAt: string;
}

export default function ManageUsersClient() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editUserData, setEditUserData] = useState<Partial<User> | null>(null);
  const [saving, setSaving] = useState(false);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await listUsers({ page, limit, search: search || undefined });
    if ("users" in res) {
      setUsers(res.users as UserRow[]);
      setTotalPages(res.totalPages ?? 1);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    const res = await deleteUser(id);
    if ("success" in res) fetchUsers();
  }

  async function openEdit(userId: string) {
    const res = await getUser(userId);
    if ("user" in res) {
      setEditUserData(res.user as Partial<User>);
    }
  }

  function updateField(path: string, value: unknown) {
    setEditUserData((prev) => {
      if (!prev) return prev;
      const keys = path.split(".");
      const newData = structuredClone(prev) as Record<string, unknown>;
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]] || typeof obj[keys[i]] !== "object") {
          obj[keys[i]] = {};
        }
        obj = obj[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return newData as Partial<User>;
    });
  }

  function updateArrayItem(
    arrayField: string,
    index: number,
    field: string,
    value: unknown
  ) {
    setEditUserData((prev) => {
      if (!prev) return prev;
      const newData = structuredClone(prev) as Record<string, unknown>;
      const arr = (newData[arrayField] as Record<string, unknown>[]) || [];
      if (!arr[index]) arr[index] = {};
      arr[index][field] = value;
      newData[arrayField] = arr;
      return newData as Partial<User>;
    });
  }

  function removeArrayItem(arrayField: string, index: number) {
    setEditUserData((prev) => {
      if (!prev) return prev;
      const newData = structuredClone(prev) as Record<string, unknown>;
      const arr = (newData[arrayField] as unknown[]) || [];
      arr.splice(index, 1);
      newData[arrayField] = arr;
      return newData as Partial<User>;
    });
  }

  function addArrayItem(arrayField: string, template: Record<string, unknown>) {
    setEditUserData((prev) => {
      if (!prev) return prev;
      const newData = structuredClone(prev) as Record<string, unknown>;
      const arr = (newData[arrayField] as Record<string, unknown>[]) || [];
      arr.push(template);
      newData[arrayField] = arr;
      return newData as Partial<User>;
    });
  }

  async function handleSave() {
    if (!editUserData?._id) return;
    setSaving(true);
    const res = await editUser(editUserData._id as string, editUserData as Record<string, unknown>);
    if ("success" in res) {
      setEditUserData(null);
      fetchUsers();
    }
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            className="w-56 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] placeholder:text-outline-variant focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant">
            {users.length} / {totalPages * limit}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-ambient">
        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-12 font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
            <SpinnerIcon className="size-4 animate-spin" />
            Loading...
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
            No users found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-left font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Domain</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="transition hover:bg-surface-container-low"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs uppercase tracking-[0.08em] text-on-surface-variant">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-primary">
                      {user.jobDomain}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant" />
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEdit(user._id)}
                      className="mr-2 rounded-lg border border-outline-variant px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition hover:border-primary hover:text-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="rounded-lg border border-error/30 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-error transition hover:bg-error/10"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="rounded-lg border border-outline-variant px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="rounded-lg border border-outline-variant px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {editUserData && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 py-12 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-2xl border border-outline-variant bg-white p-8 shadow-electric">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-headline text-xl font-semibold uppercase tracking-[-0.05em]">
                Edit User
              </h2>
              <button
                onClick={() => setEditUserData(null)}
                className="rounded-lg border border-outline-variant p-2 transition hover:bg-surface-container-low"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="space-y-8">
              <Section title="Basic Info">
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="First Name" value={editUserData.firstName ?? ""} onChange={(v) => updateField("firstName", v)} />
                  <TextField label="Last Name" value={editUserData.lastName ?? ""} onChange={(v) => updateField("lastName", v)} />
                  <TextField label="Email" value={editUserData.email ?? ""} onChange={(v) => updateField("email", v)} />
                  <TextField label="Phone" value={editUserData.phone ?? ""} onChange={(v) => updateField("phone", v)} />
                  <TextField label="Job Domain" value={editUserData.jobDomain ?? ""} onChange={(v) => updateField("jobDomain", v)} />
                  <TextField label="Summary" value={editUserData.summary ?? ""} onChange={(v) => updateField("summary", v)} />
                  <TextField label="Languages" value={(editUserData.languages ?? []).join(", ")} onChange={(v) => updateField("languages", v.split(",").map((s) => s.trim()).filter(Boolean))} />
                </div>
              </Section>

              <Section title="Skills">
                <TextField
                  label="Skills (comma-separated)"
                  value={(editUserData.skills ?? []).join(", ")}
                  onChange={(v) => updateField("skills", v.split(",").map((s) => s.trim()).filter(Boolean))}
                />
              </Section>

              <Section title="Address">
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="Street" value={editUserData.address?.street ?? ""} onChange={(v) => updateField("address.street", v)} />
                  <TextField label="City" value={editUserData.address?.city ?? ""} onChange={(v) => updateField("address.city", v)} />
                  <TextField label="PIN" value={editUserData.address?.pin ?? ""} onChange={(v) => updateField("address.pin", v)} />
                  <TextField label="State" value={editUserData.address?.state ?? ""} onChange={(v) => updateField("address.state", v)} />
                  <TextField label="Country" value={editUserData.address?.country ?? ""} onChange={(v) => updateField("address.country", v)} />
                </div>
              </Section>

              <Section title="Social Links">
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="LinkedIn" value={editUserData.socialLinks?.linkedin ?? ""} onChange={(v) => updateField("socialLinks.linkedin", v)} />
                  <TextField label="GitHub" value={editUserData.socialLinks?.github ?? ""} onChange={(v) => updateField("socialLinks.github", v)} />
                  <TextField label="Portfolio" value={editUserData.socialLinks?.portfolio ?? ""} onChange={(v) => updateField("socialLinks.portfolio", v)} />
                  <TextField label="Twitter" value={editUserData.socialLinks?.twitter ?? ""} onChange={(v) => updateField("socialLinks.twitter", v)} />
                </div>
              </Section>

              <ArraySection
                title="Education"
                items={editUserData.education ?? []}
                fields={[
                  { key: "degree", label: "Degree" },
                  { key: "institution", label: "Institution" },
                  { key: "location", label: "Location" },
                  { key: "startDate", label: "Start Date" },
                  { key: "endDate", label: "End Date" },
                  { key: "gpa", label: "GPA" },
                ]}
                onUpdate={(i, f, v) => updateArrayItem("education", i, f, v)}
                onRemove={(i) => removeArrayItem("education", i)}
                onAdd={() => addArrayItem("education", { degree: "", institution: "", location: "", startDate: "", endDate: "" })}
              />

              <ArraySection
                title="Experience"
                items={editUserData.experience ?? []}
                fields={[
                  { key: "company", label: "Company" },
                  { key: "position", label: "Position" },
                  { key: "location", label: "Location" },
                  { key: "startDate", label: "Start Date" },
                  { key: "endDate", label: "End Date" },
                ]}
                textareaFields={[{ key: "description", label: "Description (one per line)" }]}
                textareaParser={(v) => v.split("\n").filter(Boolean)}
                textareaFormatter={(v) => (Array.isArray(v) ? v.join("\n") : "")}
                onUpdate={(i, f, v) => updateArrayItem("experience", i, f, v)}
                onRemove={(i) => removeArrayItem("experience", i)}
                onAdd={() => addArrayItem("experience", { company: "", position: "", location: "", startDate: "", endDate: "", description: [] })}
              />

              <ArraySection
                title="Projects"
                items={editUserData.projects ?? []}
                fields={[
                  { key: "name", label: "Name" },
                  { key: "description", label: "Description" },
                  { key: "url", label: "URL" },
                ]}
                textareaFields={[{ key: "technologies", label: "Technologies (one per line)" }]}
                textareaParser={(v) => v.split("\n").filter(Boolean)}
                textareaFormatter={(v) => (Array.isArray(v) ? v.join("\n") : "")}
                onUpdate={(i, f, v) => updateArrayItem("projects", i, f, v)}
                onRemove={(i) => removeArrayItem("projects", i)}
                onAdd={() => addArrayItem("projects", { name: "", description: "", technologies: [] })}
              />

              <ArraySection
                title="Certifications"
                items={editUserData.certifications ?? []}
                fields={[
                  { key: "name", label: "Name" },
                  { key: "issuer", label: "Issuer" },
                  { key: "date", label: "Date" },
                  { key: "url", label: "URL" },
                ]}
                onUpdate={(i, f, v) => updateArrayItem("certifications", i, f, v)}
                onRemove={(i) => removeArrayItem("certifications", i)}
                onAdd={() => addArrayItem("certifications", { name: "", issuer: "", date: "" })}
              />
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-outline-variant pt-6">
              <button
                onClick={() => setEditUserData(null)}
                className="rounded-lg border border-outline-variant px-6 py-3 font-mono text-xs uppercase tracking-[0.12em] transition hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-primary-container disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 font-headline text-sm font-semibold uppercase tracking-[-0.03em] text-primary">
        {title}
      </h3>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-on-surface-variant">
        {label}
      </span>
      {multiline ? (
        <textarea
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-mono text-xs focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-mono text-xs focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function ArraySection({
  title,
  items,
  fields,
  textareaFields,
  textareaParser,
  textareaFormatter,
  onUpdate,
  onRemove,
  onAdd,
}: {
  title: string;
  items: unknown[];
  fields: { key: string; label: string }[];
  textareaFields?: { key: string; label: string }[];
  textareaParser?: (v: string) => string[];
  textareaFormatter?: (v: unknown) => string;
  onUpdate: (index: number, field: string, value: unknown) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}) {
  return (
    <Section title={title}>
      <div className="space-y-4">
        {items.map((raw, i) => {
          const item = raw as Record<string, unknown>;
          return (
          <div key={i} className="relative rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <button
              onClick={() => onRemove(i)}
              className="absolute right-3 top-3 text-on-surface-variant transition hover:text-error"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="grid grid-cols-2 gap-3">
              {fields.map((f) => (
                <TextField
                  key={f.key}
                  label={f.label}
                  value={(item[f.key] as string) ?? ""}
                  onChange={(v) => onUpdate(i, f.key, v)}
                />
              ))}
              {textareaFields?.map((tf) => (
                <div key={tf.key} className="col-span-2">
                  <TextField
                    label={tf.label}
                    value={textareaFormatter ? textareaFormatter(item[tf.key]) : ((item[tf.key] as string) ?? "")}
                    onChange={(v) => onUpdate(i, tf.key, textareaParser ? textareaParser(v) : v)}
                    multiline
                  />
                </div>
              ))}
            </div>
          </div>
          );
        })}
        <button
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-outline-variant px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant transition hover:border-primary hover:text-primary"
        >
          + Add {title}
        </button>
      </div>
    </Section>
  );
}

function SpinnerIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3a9 9 0 1 1-8.2 5.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
