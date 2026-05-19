"use client";

import { createAccountState } from "@/actions/auth/createaccount";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const domains = [
  { value: "AI / ML", label: "AI / ML", icon: BrainIcon },
  { value: "Frontend", label: "Frontend", icon: LayersIcon },
  { value: "Backend", label: "Backend", icon: TerminalIcon },
  { value: "Infosec", label: "Infosec", icon: ShieldIcon },
  { value: "Data Science", label: "Data Science", icon: DatabaseIcon },
  { value: "Other", label: "Other", icon: MoreIcon },
];

const initialState: { errors?: Record<string, string> } = {};

export default function SignupForm() {
  const [state, formAction] = useActionState(createAccountState, initialState);
  const errors = state?.errors ?? {};

  return (
    <div
      className="group/form relative overflow-hidden rounded-2xl border border-outline-variant bg-white/72 p-6 shadow-ambient backdrop-blur-2xl transition duration-500 hover:border-primary/40 hover:shadow-electric md:p-10 lg:p-12"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover/form:opacity-100" style={{ background: "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(30 115 255 / 0.10), transparent 42%)" }} />

      <form action={formAction} className="relative space-y-7">
        {errors._form ? (
          <div className="rounded-xl border border-error/25 bg-error-container px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-on-error-container">
            {errors._form}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="First Name" name="firstName" placeholder="e.g. Satoshi" error={errors.firstName} />
          <Field label="Last Name" name="lastName" placeholder="e.g. Nakamoto" error={errors.lastName} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Node ID (Email)" name="email" placeholder="operator@jobgrid.net" type="email" error={errors.email} />
          <Field label="Master Access Key" name="password" placeholder="••••••••••••" type="password" error={errors.password} />
        </div>

        <fieldset className="space-y-4">
          <legend className="font-mono text-xs uppercase tracking-[0.16em] text-outline">
            Select Operational Domain
          </legend>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {domains.map((domain, index) => {
              const Icon = domain.icon;
              return (
                <label key={domain.value} className="group/domain cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="jobDomain"
                    value={domain.value}
                    defaultChecked={index === 1}
                  />
                  <span className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-outline-variant bg-surface-container px-3 py-4 text-center transition duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary/5 hover:shadow-ambient peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:shadow-electric peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40">
                    <Icon className="mb-2 size-6 text-outline transition duration-300 group-hover/domain:scale-110 group-hover/domain:text-primary peer-checked:text-primary" />
                    <span className="font-mono text-xs font-medium uppercase tracking-[0.12em] transition peer-checked:font-bold">
                      {domain.label}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {errors.jobDomain ? <p className="font-mono text-xs uppercase tracking-[0.12em] text-error">{errors.jobDomain}</p> : null}
        </fieldset>

        <div className="space-y-6 pt-3">
          <SubmitButton />
          <div className="flex items-center justify-center gap-3 text-center">
            <span className="h-px w-8 bg-outline-variant" />
            <p className="text-label-md text-on-surface-variant">
              Already in the network? <Link className="font-bold text-primary transition hover:tracking-wide" href="/login">Authorize</Link>
            </p>
            <span className="h-px w-8 bg-outline-variant" />
          </div>
        </div>
      </form>

      <div className="relative mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 lg:justify-start">
        <StatusDot>Encryption: AES-256 Enabled</StatusDot>
        <StatusDot>Network Protocol v.7</StatusDot>
        <StatusDot>Auto-sync Active</StatusDot>
      </div>
    </div>
  );
}

function Field({ label, name, placeholder, type = "text", error }: { label: string; name: string; placeholder: string; type?: string; error?: string }) {
  return (
    <label className="group/field block">
      <span className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-outline transition-colors group-focus-within/field:text-primary">
        {label}
      </span>
      <input
        className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-4 text-body-md transition duration-300 placeholder:text-outline-variant hover:border-outline focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
        name={name}
        placeholder={placeholder}
        type={type}
      />
      {error ? <span className="mt-2 block font-mono text-xs uppercase tracking-[0.12em] text-error">{error}</span> : null}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="group/submit flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg bg-primary px-6 py-5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 transition duration-300 hover:-translate-y-1 hover:bg-primary-container hover:shadow-electric active:translate-y-0 disabled:cursor-wait disabled:opacity-75"
      disabled={pending}
      type="submit"
    >
      <span className="transition duration-300 group-hover/submit:translate-x-1">
        {pending ? "Generating..." : "Generate Profile"}
      </span>
      <ArrowIcon className="size-5 transition duration-300 group-hover/submit:translate-x-1" />
    </button>
  );
}

function StatusDot({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-outline">
      <span className="size-2 rounded-full bg-primary shadow-electric" />
      {children}
    </div>
  );
}

function BrainIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V5M15 5a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V5M6 11h12M9 8H5M15 8h4M9 15H5M15 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function LayersIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 8 5-8 5-8-5 8-5ZM4 13l8 5 8-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="m4 17 8 5 8-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function TerminalIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" /><path d="m7 10 2 2-2 2M12 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ShieldIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>;
}

function DatabaseIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7c0-2.2 14-2.2 14 0v10c0 2.2-14 2.2-14 0V7Z" stroke="currentColor" strokeWidth="2" /><path d="M5 7c0 2.2 14 2.2 14 0M5 12c0 2.2 14 2.2 14 0" stroke="currentColor" strokeWidth="2" /></svg>;
}

function MoreIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 12h.01M12 12h.01M17 12h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>;
}

function ArrowIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
