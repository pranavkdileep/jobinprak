"use client";

import { resetPasswordState } from "@/actions/auth/reset-password";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const initialState: { errors?: Record<string, string> } = {};

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(
    resetPasswordState.bind(null, token),
    initialState
  );
  const errors = state?.errors ?? {};

  return (
    <div className="group relative rounded-2xl border border-outline-variant bg-white/78 p-6 shadow-ambient backdrop-blur-2xl transition duration-500 hover:border-primary/40 hover:shadow-electric md:p-10">
      <div className="absolute -left-px -top-px size-4 border-l-2 border-t-2 border-primary" />
      <div className="absolute -bottom-px -right-px size-4 border-b-2 border-r-2 border-primary" />

      <form action={formAction} className="space-y-6">
        {errors._form ? (
          <div className="rounded-xl border border-error/25 bg-error-container px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-on-error-container">
            {errors._form}
          </div>
        ) : null}

        <input type="hidden" name="token" value={token} />

        <Field
          error={errors.password}
          icon={<KeyIcon className="size-5" />}
          label="New Access Key"
          marker="REQ_01"
          name="password"
          placeholder="••••••••••••"
          type="password"
        />

        <SubmitButton />

        <div className="text-center">
          <Link
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant transition-colors hover:text-primary"
            href="/login"
          >
            <ArrowIcon className="size-4 rotate-180 transition group-hover:-translate-x-1" />
            BACK TO AUTHORIZATION
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, marker, name, placeholder, type, icon, error }: { label: string; marker: string; name: string; placeholder: string; type: string; icon: React.ReactNode; error?: string }) {
  return (
    <label className="group/field block space-y-2">
      <span className="flex justify-between font-mono text-xs uppercase tracking-[0.14em] text-outline-variant transition-colors group-focus-within/field:text-primary">
        {label}
        <span className="text-primary/50 transition-opacity group-focus-within/field:text-primary group-focus-within/field:opacity-100">
          {marker}
        </span>
      </span>
      <span className="relative block">
        <input
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 pr-12 font-mono text-sm uppercase tracking-[0.08em] transition-all placeholder:text-outline-variant hover:border-outline focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15"
          name={name}
          placeholder={placeholder}
          type={type}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline/45 transition-colors group-focus-within/field:text-primary">
          {icon}
        </span>
      </span>
      {error ? <span className="block font-mono text-xs uppercase tracking-[0.12em] text-error">{error}</span> : null}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="group/submit flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-6 py-5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 transition duration-300 hover:-translate-y-1 hover:bg-primary-container hover:shadow-electric active:translate-y-0 disabled:cursor-wait disabled:opacity-75"
      disabled={pending}
      type="submit"
    >
      <span className="transition duration-300 group-hover/submit:translate-x-1">
        {pending ? "Updating..." : "Update Access Key"}
      </span>
      {pending ? (
        <SpinnerIcon className="size-4 animate-spin" />
      ) : (
        <ArrowIcon className="size-5 transition duration-300 group-hover/submit:translate-x-1" />
      )}
    </button>
  );
}

function KeyIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 10a4 4 0 1 0-2.5 3.7L14 16h3v-3h3v-3h-6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ArrowIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SpinnerIcon({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3a9 9 0 1 1-8.2 5.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
