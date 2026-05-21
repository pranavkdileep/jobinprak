import {
  addCertification,
  addEducation,
  addExperience,
  addProject,
  changePassword,
  deleteCertification,
  deleteEducation,
  deleteExperience,
  deleteProject,
  editCertification,
  editEducation,
  editExperience,
  editProject,
  editUserProfile,
  getUserProfile,
} from "@/actions/user/profile";
import { DashboardShell } from "@/components/dashboard-shell";
import type { User } from "@/types/user";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

type ProfileSearchParams = Promise<{
  success?: string | string[];
  error?: string | string[];
}>;

type ProfileUser = Omit<User, "password" | "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: ProfileSearchParams;
}) {
  const params = await searchParams;
  const result = await getUserProfile();
  const user = "user" in result ? (result.user as ProfileUser) : null;
  const success = first(params.success);
  const error = first(params.error) || ("error" in result ? result.error : "");

  async function updateProfile(formData: FormData) {
    "use server";

    const data = {
      firstName: text(formData, "firstName"),
      lastName: text(formData, "lastName"),
      phone: text(formData, "phone"),
      jobDomain: text(formData, "jobDomain"),
      summary: text(formData, "summary"),
      address: {
        street: text(formData, "street"),
        city: text(formData, "city"),
        state: text(formData, "state"),
        pin: text(formData, "pin"),
        country: text(formData, "country"),
      },
      skills: csv(formData, "skills"),
      languages: csv(formData, "languages"),
      socialLinks: {
        linkedin: text(formData, "linkedin"),
        github: text(formData, "github"),
        portfolio: text(formData, "portfolio"),
        twitter: text(formData, "twitter"),
      },
    };

    const response = await editUserProfile(data);
    if ("error" in response) {
      redirect(`/dash/profile?error=${encodeURIComponent(response.error ?? "Failed to update profile")}`);
    }

    redirect(`/dash/profile?success=${encodeURIComponent(response.message ?? "Profile updated successfully")}`);
  }

  async function addEducationAction(formData: FormData) {
    "use server";
    await redirectProfileResult(addEducation(educationFromForm(formData)));
  }

  async function editEducationAction(formData: FormData) {
    "use server";
    await redirectProfileResult(editEducation(numberField(formData, "index"), educationFromForm(formData)));
  }

  async function deleteEducationAction(formData: FormData) {
    "use server";
    await redirectProfileResult(deleteEducation(numberField(formData, "index")));
  }

  async function addExperienceAction(formData: FormData) {
    "use server";
    await redirectProfileResult(addExperience(experienceFromForm(formData)));
  }

  async function editExperienceAction(formData: FormData) {
    "use server";
    await redirectProfileResult(editExperience(numberField(formData, "index"), experienceFromForm(formData)));
  }

  async function deleteExperienceAction(formData: FormData) {
    "use server";
    await redirectProfileResult(deleteExperience(numberField(formData, "index")));
  }

  async function addProjectAction(formData: FormData) {
    "use server";
    await redirectProfileResult(addProject(projectFromForm(formData)));
  }

  async function editProjectAction(formData: FormData) {
    "use server";
    await redirectProfileResult(editProject(numberField(formData, "index"), projectFromForm(formData)));
  }

  async function deleteProjectAction(formData: FormData) {
    "use server";
    await redirectProfileResult(deleteProject(numberField(formData, "index")));
  }

  async function addCertificationAction(formData: FormData) {
    "use server";
    await redirectProfileResult(addCertification(certificationFromForm(formData)));
  }

  async function editCertificationAction(formData: FormData) {
    "use server";
    await redirectProfileResult(editCertification(numberField(formData, "index"), certificationFromForm(formData)));
  }

  async function deleteCertificationAction(formData: FormData) {
    "use server";
    await redirectProfileResult(deleteCertification(numberField(formData, "index")));
  }

  async function changePasswordAction(formData: FormData) {
    "use server";
    const response = await changePassword(text(formData, "currentPassword"), text(formData, "newPassword"));
    if ("errors" in response) {
      const errors = response.errors ?? {};
      const message = errors._form ?? errors.currentPassword ?? errors.newPassword ?? "Failed to change password";
      redirect(`/dash/profile?error=${encodeURIComponent(message)}`);
    }
    redirect(`/dash/profile?success=${encodeURIComponent(response.message ?? "Password changed successfully")}`);
  }

  return (
    <DashboardShell active="profile">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 border-b-2 border-on-surface pb-6 md:mb-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                {"//"} Profile_Configuration
              </p>
              <h1 className="font-headline text-[clamp(2.8rem,8vw,4.5rem)] font-bold leading-none tracking-[-0.08em] text-on-surface">
                Command Center
              </h1>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded border border-outline-variant bg-surface-container-low px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-on-surface shadow-ambient">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              Identity_Mode: Read/Write
            </div>
          </div>
        </header>

        {success && <StatusMessage tone="success" message={success} />}
        {error && <StatusMessage tone="error" message={error} />}

        <form action={updateProfile} className="space-y-8">
          <ProfileModule index="01" title="Personal Intelligence">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="First Name" name="firstName" defaultValue={user?.firstName} placeholder="Enter first name" />
              <Field label="Last Name" name="lastName" defaultValue={user?.lastName} placeholder="Enter last name" />
              <Field label="Email" name="email" defaultValue={user?.email} placeholder="operator@domain.com" disabled />
              <Field label="Phone" name="phone" defaultValue={user?.phone} placeholder="+1 (555) 000-0000" />
              <Field label="Primary Job Domain" name="jobDomain" defaultValue={user?.jobDomain} placeholder="e.g., Full Stack Development" className="md:col-span-2" />
              <Field label="System Summary" name="summary" defaultValue={user?.summary} placeholder="Initialize biography protocol..." multiline className="md:col-span-2" />
            </div>
          </ProfileModule>

          <ProfileModule index="02" title="Geolocation Node">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Street Address" name="street" defaultValue={user?.address?.street} placeholder="Enter physical coordinates" className="md:col-span-2" />
              <Field label="City" name="city" defaultValue={user?.address?.city} placeholder="City node" />
              <Field label="State/Province" name="state" defaultValue={user?.address?.state} placeholder="Region identifier" />
              <Field label="Pin / Zip Code" name="pin" defaultValue={user?.address?.pin} placeholder="00000" />
              <Field label="Country" name="country" defaultValue={user?.address?.country} placeholder="Global sector" />
            </div>
          </ProfileModule>

          <ProfileModule index="05" title="Technical Assets">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Skills Array" name="skills" defaultValue={user?.skills?.join(", ")} placeholder="React, Python, Docker" className="md:col-span-2" />
              <SkillPreview items={user?.skills ?? []} />
              <Field label="Languages" name="languages" defaultValue={user?.languages?.join(", ")} placeholder="English, Malayalam" className="md:col-span-2" />
            </div>
          </ProfileModule>

          <ProfileModule index="06" title="Public Signal Links">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="LinkedIn" name="linkedin" defaultValue={user?.socialLinks?.linkedin} placeholder="https://linkedin.com/in/operator" />
              <Field label="GitHub" name="github" defaultValue={user?.socialLinks?.github} placeholder="https://github.com/operator" />
              <Field label="Portfolio" name="portfolio" defaultValue={user?.socialLinks?.portfolio} placeholder="https://operator.dev" />
              <Field label="Twitter / X" name="twitter" defaultValue={user?.socialLinks?.twitter} placeholder="https://x.com/operator" />
            </div>
          </ProfileModule>

          <div className="sticky bottom-6 z-30 flex flex-col gap-3 rounded-2xl border border-outline-variant bg-surface/90 p-4 shadow-electric backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <button type="reset" className="profile-secondary-button">
              Reset Node Data
            </button>
            <button type="submit" className="profile-primary-button">
              <SyncIcon className="size-4 transition-transform group-hover:rotate-180" />
              Synchronize Identity
            </button>
          </div>
        </form>

        <div className="mt-8 space-y-8">
          <CollectionModule index="03" title="Education Matrix" addAction={addEducationAction} addLabel="Add Education" addFields={<EducationFields />}>
            <CollectionList empty="No education nodes configured.">
              {(user?.education ?? []).map((item, index) => (
                <CollectionItem key={`${item.degree}-${index}`} title={item.degree || "Education Node"} subtitle={`${item.institution || "Institution"} // ${item.location || "Location"}`} deleteAction={deleteEducationAction} index={index}>
                  <form action={editEducationAction} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="index" value={index} />
                    <EducationFields item={item} />
                    <SaveMiniButton />
                  </form>
                </CollectionItem>
              ))}
            </CollectionList>
          </CollectionModule>

          <CollectionModule index="04" title="Experience Log" addAction={addExperienceAction} addLabel="Add Experience" addFields={<ExperienceFields />}>
            <CollectionList empty="No experience records synchronized.">
              {(user?.experience ?? []).map((item, index) => (
                <CollectionItem key={`${item.company}-${index}`} title={item.position || "Experience Node"} subtitle={`${item.company || "Company"} // ${item.location || "Location"}`} deleteAction={deleteExperienceAction} index={index}>
                  <form action={editExperienceAction} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="index" value={index} />
                    <ExperienceFields item={item} />
                    <SaveMiniButton />
                  </form>
                </CollectionItem>
              ))}
            </CollectionList>
          </CollectionModule>

          <CollectionModule index="07" title="Project Archives" addAction={addProjectAction} addLabel="Add Project" addFields={<ProjectFields />}>
            <CollectionList empty="No projects uploaded.">
              {(user?.projects ?? []).map((item, index) => (
                <CollectionItem key={`${item.name}-${index}`} title={item.name || "Project Node"} subtitle={(item.technologies ?? []).join(", ") || "Technology stack pending"} deleteAction={deleteProjectAction} index={index}>
                  <form action={editProjectAction} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="index" value={index} />
                    <ProjectFields item={item} />
                    <SaveMiniButton />
                  </form>
                </CollectionItem>
              ))}
            </CollectionList>
          </CollectionModule>

          <CollectionModule index="08" title="Certification Keys" addAction={addCertificationAction} addLabel="Add Certification" addFields={<CertificationFields />}>
            <CollectionList empty="No certification keys added.">
              {(user?.certifications ?? []).map((item, index) => (
                <CollectionItem key={`${item.name}-${index}`} title={item.name || "Certification Key"} subtitle={`${item.issuer || "Issuer"} // ${item.date || "Date"}`} deleteAction={deleteCertificationAction} index={index}>
                  <form action={editCertificationAction} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="index" value={index} />
                    <CertificationFields item={item} />
                    <SaveMiniButton />
                  </form>
                </CollectionItem>
              ))}
            </CollectionList>
          </CollectionModule>

          <ProfileModule index="09" title="Password Rotation">
            <form action={changePasswordAction} className="grid gap-6 md:grid-cols-2">
              <Field label="Current Password" name="currentPassword" placeholder="Current access key" type="password" />
              <Field label="New Password" name="newPassword" placeholder="New access key" type="password" />
              <button type="submit" className="profile-primary-button md:col-span-2 md:w-fit">
                <SyncIcon className="size-4 transition-transform group-hover:rotate-180" />
                Rotate Password
              </button>
            </form>
          </ProfileModule>
        </div>
      </div>
    </DashboardShell>
  );
}

function ProfileModule({ children, index, title }: { children: ReactNode; index: string; title: string }) {
  return (
    <section className="profile-module scan-card group relative overflow-hidden rounded-2xl border border-outline-variant bg-white/84 p-6 shadow-ambient backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-electric">
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

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  multiline,
  disabled,
  className = "",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder: string;
  type?: string;
  multiline?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const inputClass = "profile-input";

  return (
    <label className={`group block ${className}`}>
      <span className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-on-surface-variant transition-colors group-focus-within:text-primary">
        {label}
      </span>
      {multiline ? (
        <textarea className={inputClass} name={name} defaultValue={defaultValue ?? ""} placeholder={placeholder} rows={5} />
      ) : (
        <input className={inputClass} name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder} disabled={disabled} />
      )}
    </label>
  );
}

function CollectionModule({
  children,
  index,
  title,
  addAction,
  addLabel,
  addFields,
}: {
  children: ReactNode;
  index: string;
  title: string;
  addAction: (formData: FormData) => void | Promise<void>;
  addLabel: string;
  addFields: ReactNode;
}) {
  return (
    <ProfileModule index={index} title={title}>
      <form action={addAction} className="mb-6 grid gap-4 rounded-xl border border-outline-variant/70 bg-surface-container-low/60 p-4 md:grid-cols-2">
        {addFields}
        <button type="submit" className="profile-secondary-button md:col-span-2 md:w-fit">
          + {addLabel}
        </button>
      </form>
      {children}
    </ProfileModule>
  );
}

function CollectionList({ children, empty }: { children: ReactNode; empty: string }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;
  if (!hasChildren) {
    return <p className="rounded-lg border border-dashed border-outline-variant px-4 py-6 text-center font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">{empty}</p>;
  }
  return <div className="space-y-4">{children}</div>;
}

function CollectionItem({
  children,
  title,
  subtitle,
  deleteAction,
  index,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
  deleteAction: (formData: FormData) => void | Promise<void>;
  index: number;
}) {
  return (
    <details className="group/item rounded-xl border border-outline-variant bg-white/70 p-4 transition duration-300 open:shadow-ambient hover:border-primary/60">
      <summary className="flex cursor-pointer list-none flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>
          <span className="block font-headline text-xl font-semibold uppercase tracking-[-0.05em] text-on-surface">{title}</span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-on-surface-variant">{subtitle}</span>
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-primary transition group-open/item:rotate-180">Expand</span>
      </summary>
      <div className="mt-5 border-t border-outline-variant pt-5">
        {children}
        <form action={deleteAction} className="mt-4">
          <input type="hidden" name="index" value={index} />
          <button className="rounded border border-error/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-error transition hover:bg-error/10">
            Delete Node
          </button>
        </form>
      </div>
    </details>
  );
}

function SaveMiniButton() {
  return (
    <button type="submit" className="profile-primary-button md:col-span-2 md:w-fit">
      Save Node
    </button>
  );
}

function EducationFields({ item }: { item?: ProfileUser["education"][number] }) {
  return (
    <>
      <Field label="Degree" name="degree" defaultValue={item?.degree} placeholder="B.Tech Computer Science" />
      <Field label="Institution" name="institution" defaultValue={item?.institution} placeholder="University node" />
      <Field label="Location" name="location" defaultValue={item?.location} placeholder="Campus sector" />
      <Field label="GPA" name="gpa" defaultValue={item?.gpa} placeholder="8.5 / 10" />
      <Field label="Start Date" name="startDate" defaultValue={item?.startDate} placeholder="2020" />
      <Field label="End Date" name="endDate" defaultValue={item?.endDate} placeholder="2024" />
    </>
  );
}

function ExperienceFields({ item }: { item?: ProfileUser["experience"][number] }) {
  return (
    <>
      <Field label="Company" name="company" defaultValue={item?.company} placeholder="Company node" />
      <Field label="Position" name="position" defaultValue={item?.position} placeholder="Role title" />
      <Field label="Location" name="location" defaultValue={item?.location} placeholder="Remote / City" />
      <Field label="Start Date" name="startDate" defaultValue={item?.startDate} placeholder="Jan 2023" />
      <Field label="End Date" name="endDate" defaultValue={item?.endDate} placeholder="Present" />
      <Field label="Description" name="description" defaultValue={item?.description?.join("\n")} placeholder="One bullet per line" multiline />
    </>
  );
}

function ProjectFields({ item }: { item?: ProfileUser["projects"][number] }) {
  return (
    <>
      <Field label="Project Name" name="name" defaultValue={item?.name} placeholder="Project codename" />
      <Field label="URL" name="url" defaultValue={item?.url} placeholder="https://project.dev" />
      <Field label="Technologies" name="technologies" defaultValue={item?.technologies?.join(", ")} placeholder="React, MongoDB, Docker" className="md:col-span-2" />
      <Field label="Description" name="description" defaultValue={item?.description} placeholder="Project summary" multiline className="md:col-span-2" />
    </>
  );
}

function CertificationFields({ item }: { item?: ProfileUser["certifications"][number] }) {
  return (
    <>
      <Field label="Certification" name="name" defaultValue={item?.name} placeholder="AWS Certified Developer" />
      <Field label="Issuer" name="issuer" defaultValue={item?.issuer} placeholder="Issuer node" />
      <Field label="Date" name="date" defaultValue={item?.date} placeholder="2024" />
      <Field label="URL" name="url" defaultValue={item?.url} placeholder="https://credential.url" />
    </>
  );
}

function SkillPreview({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="md:col-span-2 flex flex-wrap gap-2">
      {items.slice(0, 8).map((item) => (
        <span key={item} className="rounded border border-outline-variant bg-surface-container-high px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-on-surface transition hover:border-primary hover:text-primary">
          {item} ×
        </span>
      ))}
    </div>
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

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function csv(formData: FormData, key: string) {
  return text(formData, key)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function lines(formData: FormData, key: string) {
  return text(formData, key)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberField(formData: FormData, key: string) {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? value : 0;
}

async function redirectProfileResult(
  promise: Promise<{ error?: string; success?: boolean; message?: string }>,
) {
  const response = await promise;
  if (response.error) {
    redirect(`/dash/profile?error=${encodeURIComponent(response.error)}`);
  }
  redirect(`/dash/profile?success=${encodeURIComponent(response.message ?? "Profile updated successfully")}`);
}

function educationFromForm(formData: FormData) {
  return {
    degree: text(formData, "degree"),
    institution: text(formData, "institution"),
    location: text(formData, "location"),
    startDate: text(formData, "startDate"),
    endDate: text(formData, "endDate"),
    gpa: text(formData, "gpa"),
  };
}

function experienceFromForm(formData: FormData) {
  return {
    company: text(formData, "company"),
    position: text(formData, "position"),
    location: text(formData, "location"),
    startDate: text(formData, "startDate"),
    endDate: text(formData, "endDate"),
    description: lines(formData, "description"),
  };
}

function projectFromForm(formData: FormData) {
  return {
    name: text(formData, "name"),
    description: text(formData, "description"),
    technologies: csv(formData, "technologies"),
    url: text(formData, "url"),
  };
}

function certificationFromForm(formData: FormData) {
  return {
    name: text(formData, "name"),
    issuer: text(formData, "issuer"),
    date: text(formData, "date"),
    url: text(formData, "url"),
  };
}

function SyncIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11a8 8 0 0 0-14.8-4M4 4v5h5M4 13a8 8 0 0 0 14.8 4M20 20v-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
