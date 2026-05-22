"use client";

import {
  bulkUpload,
  cleanExpiredJobs,
  createJob,
  deleteJob,
  getJob,
  listJobs,
  updateJob,
} from "@/actions/admin/jobs";
import { useCallback, useEffect, useState } from "react";
import type { Job, JobDetails } from "@/types/jobs";

interface JobRow {
  _id: string;
  job_title: string;
  company_name: string;
  source: string;
  posted_date: string;
  job_id: number;
}

const emptyDetails: JobDetails = {
  min_experience: 0,
  max_experience: 0,
  small_description: "",
  skill_set: [],
  responsibilities: [],
  apply_email: "",
};

export default function ManageJobsClient() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editJob, setEditJob] = useState<Partial<Job> | null>(null);
  const [saving, setSaving] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);
  const [cleanResult, setCleanResult] = useState<string | null>(null);
  const [cleaning, setCleaning] = useState(false);
  const limit = 10;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const res = await listJobs({ page, limit, search: search || undefined });
    if ("jobs" in res) {
      setJobs(res.jobs as JobRow[]);
      setTotalPages(res.totalPages ?? 1);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this job?")) return;
    const res = await deleteJob(id);
    if ("success" in res) fetchJobs();
  }

  async function openEdit(jobId: string) {
    const res = await getJob(jobId);
    if ("job" in res) setEditJob(res.job as Partial<Job>);
  }

  function openCreate() {
    setEditJob({
      job_title: "",
      company_name: "",
      posted_date: "",
      closing_date: "",
      details: { ...emptyDetails },
      job_id: Date.now(),
      company_id: 0,
      source: "infopark",
    });
  }

  function updateField(path: string, value: unknown) {
    setEditJob((prev) => {
      if (!prev) return prev;
      const keys = path.split(".");
      const newData = structuredClone(prev) as Record<string, unknown>;
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]] || typeof obj[keys[i]] !== "object")
          obj[keys[i]] = {};
        obj = obj[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return newData as Partial<Job>;
    });
  }

  function updateArrayItem(
    arrayField: string,
    index: number,
    value: string
  ) {
    setEditJob((prev) => {
      if (!prev) return prev;
      const newData = structuredClone(prev) as Record<string, unknown>;
      const details = newData.details as Record<string, unknown>;
      const arr = (details[arrayField] as string[]) || [];
      arr[index] = value;
      details[arrayField] = arr;
      return newData as Partial<Job>;
    });
  }

  function removeArrayItem(arrayField: string, index: number) {
    setEditJob((prev) => {
      if (!prev) return prev;
      const newData = structuredClone(prev) as Record<string, unknown>;
      const details = newData.details as Record<string, unknown>;
      const arr = (details[arrayField] as string[]) || [];
      arr.splice(index, 1);
      details[arrayField] = arr;
      return newData as Partial<Job>;
    });
  }

  function addArrayItem(arrayField: string) {
    setEditJob((prev) => {
      if (!prev) return prev;
      const newData = structuredClone(prev) as Record<string, unknown>;
      const details = newData.details as Record<string, unknown>;
      const arr = (details[arrayField] as string[]) || [];
      arr.push("");
      details[arrayField] = arr;
      return newData as Partial<Job>;
    });
  }

  async function handleSave() {
    if (!editJob) return;
    setSaving(true);

    const isNew = !editJob._id;
    const data = { ...editJob };
    delete (data as Record<string, unknown>)._id;

    const res = isNew
      ? await createJob(data as Omit<Job, "_id">)
      : await updateJob(editJob._id as string, data);

    if ("success" in res) {
      setEditJob(null);
      fetchJobs();
    }
    setSaving(false);
  }

  async function handleBulkUpload(formData: FormData) {
    setBulkResult(null);
    const res = await bulkUpload(formData);
    if ("error" in res) {
      setBulkResult(`Error: ${res.error}`);
    } else {
      setBulkResult(
        `Inserted ${res.inserted}, skipped ${res.skipped} (${res.total} total)`
      );
      fetchJobs();
    }
  }

  async function handleCleanExpired() {
    if (!confirm("Delete all jobs with past closing dates?")) return;
    setCleaning(true);
    setCleanResult(null);
    const res = await cleanExpiredJobs();
    if ("error" in res) {
      setCleanResult(`Error: ${res.error}`);
    } else {
      setCleanResult(res.message);
      fetchJobs();
    }
    setCleaning(false);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            className="w-56 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] placeholder:text-outline-variant focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant">
            {jobs.length} / {totalPages * limit}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              await handleBulkUpload(fd);
              (e.target as HTMLFormElement).reset();
            }}
            className="flex items-center gap-2"
          >
            <input
              name="file"
              type="file"
              accept=".json"
              className="w-40 text-xs font-mono text-on-surface-variant file:mr-2 file:rounded-lg file:border file:border-outline-variant file:bg-surface-container-low file:px-3 file:py-1.5 file:font-mono file:text-xs file:uppercase file:tracking-[0.1em] file:text-on-surface file:hover:bg-surface-container"
            />
            <button
              type="submit"
              className="rounded-lg border border-outline-variant px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition hover:border-primary hover:text-primary"
            >
              Upload JSON
            </button>
          </form>
          <button
            onClick={openCreate}
            className="rounded-lg bg-primary px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-primary-container"
          >
            + New Job
          </button>
          <button
            onClick={handleCleanExpired}
            disabled={cleaning}
            className="rounded-lg border border-error/30 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-error transition hover:bg-error/10 disabled:cursor-wait disabled:opacity-50"
          >
            {cleaning ? "Cleaning..." : "Clean Expired"}
          </button>
        </div>
      </div>

      {cleanResult && (
        <div className="rounded-xl border border-error/25 bg-error-container/50 px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-on-error-container">
          {cleanResult}
        </div>
      )}

      {bulkResult && (
        <div className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-primary">
          {bulkResult}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-ambient">
        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-12 font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
            <SpinnerIcon className="size-4 animate-spin" />
            Loading...
          </div>
        ) : jobs.length === 0 ? (
          <div className="px-6 py-12 text-center font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
            No jobs found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-left font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">
                <th className="px-6 py-4 font-medium">Job Title</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Posted</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="transition hover:bg-surface-container-low"
                >
                  <td className="max-w-xs truncate px-6 py-4 font-mono text-sm font-medium">
                    {job.job_title}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs uppercase tracking-[0.08em] text-on-surface-variant">
                    {job.company_name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] ${
                        job.source === "infopark"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {job.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                    {job.posted_date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEdit(job._id)}
                      className="mr-2 rounded-lg border border-outline-variant px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition hover:border-primary hover:text-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
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

      {editJob && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 py-12 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-2xl border border-outline-variant bg-white p-8 shadow-electric">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-headline text-xl font-semibold uppercase tracking-[-0.05em]">
                {editJob._id ? "Edit Job" : "Create Job"}
              </h2>
              <button
                onClick={() => setEditJob(null)}
                className="rounded-lg border border-outline-variant p-2 transition hover:bg-surface-container-low"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6 6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-8">
              <Section title="Basic Info">
                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    label="Job Title"
                    value={editJob.job_title ?? ""}
                    onChange={(v) => updateField("job_title", v)}
                  />
                  <TextField
                    label="Company Name"
                    value={editJob.company_name ?? ""}
                    onChange={(v) => updateField("company_name", v)}
                  />
                  <TextField
                    label="Posted Date"
                    value={editJob.posted_date ?? ""}
                    onChange={(v) => updateField("posted_date", v)}
                  />
                  <TextField
                    label="Closing Date"
                    value={editJob.closing_date ?? ""}
                    onChange={(v) => updateField("closing_date", v)}
                  />
                  <TextField
                    label="Job ID"
                    value={String(editJob.job_id ?? "")}
                    onChange={(v) => updateField("job_id", Number(v))}
                  />
                  <TextField
                    label="Company ID"
                    value={String(editJob.company_id ?? "")}
                    onChange={(v) => updateField("company_id", Number(v))}
                  />
                  <div className="col-span-2">
                    <label className="block space-y-1.5">
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-on-surface-variant">
                        Source
                      </span>
                      <select
                        className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-mono text-xs focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
                        value={editJob.source ?? "infopark"}
                        onChange={(e) => updateField("source", e.target.value)}
                      >
                        <option value="infopark">Infopark</option>
                        <option value="technopark">Technopark</option>
                      </select>
                    </label>
                  </div>
                </div>
              </Section>

              <Section title="Details">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <TextField
                      label="Description"
                      value={editJob.details?.small_description ?? ""}
                      onChange={(v) =>
                        updateField("details.small_description", v)
                      }
                      multiline
                    />
                  </div>
                  <TextField
                    label="Min Experience (years)"
                    value={String(editJob.details?.min_experience ?? "")}
                    onChange={(v) =>
                      updateField("details.min_experience", Number(v))
                    }
                  />
                  <TextField
                    label="Max Experience (years)"
                    value={String(editJob.details?.max_experience ?? "")}
                    onChange={(v) =>
                      updateField("details.max_experience", Number(v))
                    }
                  />
                  <div className="col-span-2">
                    <TextField
                      label="Apply Email"
                      value={editJob.details?.apply_email ?? ""}
                      onChange={(v) =>
                        updateField("details.apply_email", v)
                      }
                    />
                  </div>
                </div>
              </Section>

              <ListSection
                title="Skills"
                items={editJob.details?.skill_set ?? []}
                onUpdate={(i, v) => updateArrayItem("skill_set", i, v)}
                onRemove={(i) => removeArrayItem("skill_set", i)}
                onAdd={() => addArrayItem("skill_set")}
              />

              <ListSection
                title="Responsibilities"
                items={editJob.details?.responsibilities ?? []}
                onUpdate={(i, v) => updateArrayItem("responsibilities", i, v)}
                onRemove={(i) => removeArrayItem("responsibilities", i)}
                onAdd={() => addArrayItem("responsibilities")}
              />
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-outline-variant pt-6">
              <button
                onClick={() => setEditJob(null)}
                className="rounded-lg border border-outline-variant px-6 py-3 font-mono text-xs uppercase tracking-[0.12em] transition hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-primary-container disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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

function ListSection({
  title,
  items,
  onUpdate,
  onRemove,
  onAdd,
}: {
  title: string;
  items: string[];
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}) {
  return (
    <Section title={title}>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-mono text-xs focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
              value={item}
              onChange={(e) => onUpdate(i, e.target.value)}
            />
            <button
              onClick={() => onRemove(i)}
              className="shrink-0 text-on-surface-variant transition hover:text-error"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ))}
        <button
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-outline-variant px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant transition hover:border-primary hover:text-primary"
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
      <path
        d="M12 3a9 9 0 1 1-8.2 5.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
