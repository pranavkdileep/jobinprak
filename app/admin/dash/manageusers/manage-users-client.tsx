"use client";

import { deleteUser, editUser, listUsers } from "@/actions/admin/mng-users";
import { useCallback, useEffect, useState } from "react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobDomain: string;
  createdAt: string;
}

export default function ManageUsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const limit = 5;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await listUsers({ page, limit, search: search || undefined });
    if ("users" in res) {
      setUsers(res.users as User[]);
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

  function startEdit(user: User) {
    setEditId(user._id);
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      jobDomain: user.jobDomain,
    });
  }

  async function handleSave() {
    if (!editId) return;
    const res = await editUser(editId, editData);
    if ("success" in res) {
      setEditId(null);
      fetchUsers();
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-headline text-xl font-semibold uppercase tracking-[-0.05em]">
          Manage Users
        </h2>
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
          <div className="flex items-center justify gap-3 px-6 py-12 text-center font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
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
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {users.map((user) =>
                editId === user._id ? (
                  <tr key={user._id} className="bg-primary/5">
                    <td className="px-6 py-3">
                      <input
                        className="w-full rounded border border-outline-variant bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] focus:border-primary focus:outline-none"
                        value={editData.firstName ?? ""}
                        onChange={(e) =>
                          setEditData((p) => ({ ...p, firstName: e.target.value }))
                        }
                        placeholder="First"
                      />
                      <input
                        className="mt-1 w-full rounded border border-outline-variant bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] focus:border-primary focus:outline-none"
                        value={editData.lastName ?? ""}
                        onChange={(e) =>
                          setEditData((p) => ({ ...p, lastName: e.target.value }))
                        }
                        placeholder="Last"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        className="w-full rounded border border-outline-variant bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] focus:border-primary focus:outline-none"
                        value={editData.email ?? ""}
                        onChange={(e) =>
                          setEditData((p) => ({ ...p, email: e.target.value }))
                        }
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        className="w-full rounded border border-outline-variant bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] focus:border-primary focus:outline-none"
                        value={editData.jobDomain ?? ""}
                        onChange={(e) =>
                          setEditData((p) => ({ ...p, jobDomain: e.target.value }))
                        }
                      />
                    </td>
                    <td className="px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={handleSave}
                        className="mr-2 rounded-lg bg-primary px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-primary-container"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="rounded-lg border border-outline-variant px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] transition hover:bg-surface-container-low"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
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
                    <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => startEdit(user)}
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
                )
              )}
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
    </div>
  );
}

function SpinnerIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3a9 9 0 1 1-8.2 5.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
