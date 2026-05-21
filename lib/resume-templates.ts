import type { User } from "@/types/user";

export function renderResume(user: User, theme: string): string {
  const safeUser = normalizeResumeUser(user);
  const fullName = `${safeUser.firstName} ${safeUser.lastName}`.trim() || "Unnamed Candidate";
  const location = [safeUser.address?.city, safeUser.address?.state, safeUser.address?.country].filter(Boolean).join(", ");

  switch (theme) {
    case "minimalist":
      return renderMinimalist(safeUser, fullName, location);
    case "executive":
      return renderExecutive(safeUser, fullName, location);
    case "creative":
      return renderCreative(safeUser, fullName, location);
    case "tech":
      return renderTech(safeUser, fullName, location);
    default:
      return renderMinimalist(safeUser, fullName, location);
  }
}

function normalizeResumeUser(user: User): User {
  return {
    ...user,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    address: user.address ?? { street: "", city: "", pin: "", state: "", country: "" },
    jobDomain: user.jobDomain ?? "",
    skills: Array.isArray(user.skills) ? user.skills : [],
    education: Array.isArray(user.education)
      ? user.education.map((item) => ({
          degree: item.degree ?? "",
          institution: item.institution ?? "",
          location: item.location ?? "",
          startDate: item.startDate ?? "",
          endDate: item.endDate ?? "",
          gpa: item.gpa ?? "",
        }))
      : [],
    experience: Array.isArray(user.experience)
      ? user.experience.map((item) => ({
          company: item.company ?? "",
          position: item.position ?? "",
          location: item.location ?? "",
          startDate: item.startDate ?? "",
          endDate: item.endDate ?? "",
          description: Array.isArray(item.description) ? item.description : [],
        }))
      : [],
    projects: Array.isArray(user.projects)
      ? user.projects.map((item) => ({
          name: item.name ?? "",
          description: item.description ?? "",
          technologies: Array.isArray(item.technologies) ? item.technologies : [],
          url: item.url ?? "",
        }))
      : [],
    certifications: Array.isArray(user.certifications)
      ? user.certifications.map((item) => ({
          name: item.name ?? "",
          issuer: item.issuer ?? "",
          date: item.date ?? "",
          url: item.url ?? "",
        }))
      : [],
    languages: Array.isArray(user.languages) ? user.languages : [],
    socialLinks: user.socialLinks ?? {},
  };
}

function renderMinimalist(user: User, name: string, location: string): string {
  const socialLinks = buildSocialLinks(user);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${name} - Resume</title>
<style>
@page{size:A4;margin:18mm}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;background:#fff;line-height:1.55}
@media print{body{background:#fff}}
.header{margin-bottom:22px;padding-bottom:16px;border-bottom:1px solid #e5e5e5}
.name{font-size:28px;font-weight:700;letter-spacing:-0.5px;color:#111}
.title-line{font-size:13px;color:#666;margin-top:2px;letter-spacing:0.3px}
.contact{display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:8px;font-size:11.5px;color:#555}
.contact span{display:inline-flex;align-items:center;gap:4px}
.contact a{color:#555;text-decoration:none}
.contact a:hover{color:#000}
.section{margin-bottom:18px}
.section-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#111;border-bottom:1px solid #e5e5e5;padding-bottom:4px;margin-bottom:10px}
.summary{font-size:12.5px;color:#444;line-height:1.65}
.entry{margin-bottom:12px}
.entry-header{display:flex;justify-content:space-between;align-items:baseline}
.entry-title{font-size:13.5px;font-weight:600;color:#111}
.entry-date{font-size:11px;color:#888;white-space:nowrap}
.entry-sub{font-size:12px;color:#555;margin-top:1px}
.entry-desc{font-size:11.5px;color:#444;margin-top:4px;padding-left:14px}
.entry-desc li{margin-bottom:2px}
.skills-grid{display:flex;flex-wrap:wrap;gap:5px}
.skill-tag{font-size:11px;padding:3px 10px;background:#f5f5f5;border-radius:3px;color:#333}
.lang-list{display:flex;flex-wrap:wrap;gap:5px}
.lang-tag{font-size:11.5px;color:#444}
.cert-entry{font-size:12px;color:#333;margin-bottom:4px}
.cert-entry strong{color:#111}
.cert-entry span{color:#777}
</style>
</head>
<body>
<div class="header">
<div class="name">${name}</div>
${user.jobDomain ? `<div class="title-line">${user.jobDomain}</div>` : ""}
<div class="contact">
${user.email ? `<span>${user.email}</span>` : ""}
${user.phone ? `<span>${user.phone}</span>` : ""}
${location ? `<span>${location}</span>` : ""}
${socialLinks}
</div>
</div>

${user.summary ? `<div class="section"><div class="section-title">Summary</div><div class="summary">${user.summary}</div></div>` : ""}

${user.experience.length > 0 ? `<div class="section"><div class="section-title">Experience</div>${user.experience.map(exp => `<div class="entry"><div class="entry-header"><span class="entry-title">${exp.position}</span><span class="entry-date">${exp.startDate} — ${exp.endDate}</span></div><div class="entry-sub">${exp.company}${exp.location ? ` · ${exp.location}` : ""}</div>${exp.description.length > 0 ? `<ul class="entry-desc">${exp.description.map(d => `<li>${d}</li>`).join("")}</ul>` : ""}</div>`).join("")}</div>` : ""}

${user.education.length > 0 ? `<div class="section"><div class="section-title">Education</div>${user.education.map(edu => `<div class="entry"><div class="entry-header"><span class="entry-title">${edu.degree}</span><span class="entry-date">${edu.startDate} — ${edu.endDate}</span></div><div class="entry-sub">${edu.institution}${edu.location ? ` · ${edu.location}` : ""}${edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div></div>`).join("")}</div>` : ""}

${user.skills.length > 0 ? `<div class="section"><div class="section-title">Skills</div><div class="skills-grid">${user.skills.map(s => `<span class="skill-tag">${s}</span>`).join("")}</div></div>` : ""}

${user.projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>${user.projects.map(p => `<div class="entry"><div class="entry-header"><span class="entry-title">${p.name}</span></div><div class="entry-sub">${p.description}</div>${p.technologies.length > 0 ? `<div style="margin-top:3px;font-size:11px;color:#777">${p.technologies.join(" · ")}</div>` : ""}</div>`).join("")}</div>` : ""}

${user.certifications.length > 0 ? `<div class="section"><div class="section-title">Certifications</div>${user.certifications.map(c => `<div class="cert-entry"><strong>${c.name}</strong> — ${c.issuer} <span>(${c.date})</span></div>`).join("")}</div>` : ""}

${user.languages && user.languages.length > 0 ? `<div class="section"><div class="section-title">Languages</div><div class="lang-list">${user.languages.map(l => `<span class="lang-tag">${l}</span>`).join("")}</div></div>` : ""}
</body>
</html>`;
}

function renderExecutive(user: User, name: string, location: string): string {
  const socialLinks = buildSocialLinks(user);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${name} - Resume</title>
<style>
@page{size:A4;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,'Times New Roman',serif;color:#1c1c1c;background:#faf9f6}
@media print{body{background:#fff}}
.sidebar{position:fixed;left:0;top:0;width:210px;height:100%;background:#1a2332;color:#e8e8e8;padding:32px 22px}
.main{margin-left:210px;padding:32px 36px}
.sidebar .avatar{width:72px;height:72px;border-radius:50%;background:#2a3a50;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:#c4a35a;margin-bottom:16px}
.sidebar .name{font-size:18px;font-weight:700;color:#fff;letter-spacing:0.3px;line-height:1.3}
.sidebar .title{font-size:11px;color:#c4a35a;margin-top:4px;text-transform:uppercase;letter-spacing:1px}
.sidebar-section{margin-top:24px}
.sidebar-title{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#c4a35a;border-bottom:1px solid #2a3a50;padding-bottom:4px;margin-bottom:8px}
.sidebar .contact-item{font-size:11px;color:#bbb;margin-bottom:5px;word-break:break-all}
.sidebar .contact-item a{color:#bbb;text-decoration:none}
.sidebar .skill-item{display:inline-block;font-size:10.5px;padding:2px 8px;background:#2a3a50;border-radius:2px;color:#ccc;margin:2px 3px 2px 0}
.sidebar .lang-item{font-size:11px;color:#bbb;margin-bottom:3px}
.main-section{margin-bottom:20px}
.main-title{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1a2332;border-bottom:2px solid #c4a35a;padding-bottom:4px;margin-bottom:12px}
.summary{font-size:12.5px;color:#444;line-height:1.7;font-style:italic}
.entry{margin-bottom:14px;padding-left:12px;border-left:2px solid #c4a35a}
.entry-title{font-size:13.5px;font-weight:700;color:#1a2332}
.entry-date{font-size:10.5px;color:#888;margin-top:1px}
.entry-sub{font-size:11.5px;color:#555;margin-top:2px}
.entry-desc{font-size:11px;color:#444;margin-top:4px;padding-left:12px}
.entry-desc li{margin-bottom:2px}
.cert-entry{font-size:11.5px;color:#333;margin-bottom:4px}
.cert-entry strong{color:#1a2332}
.cert-entry span{color:#888}
.project-entry{margin-bottom:10px}
.project-name{font-size:12.5px;font-weight:600;color:#1a2332}
.project-desc{font-size:11px;color:#444;margin-top:2px}
.project-tech{font-size:10px;color:#888;margin-top:2px}
</style>
</head>
<body>
<div class="sidebar">
<div class="avatar">${name.charAt(0)}</div>
<div class="name">${name}</div>
${user.jobDomain ? `<div class="title">${user.jobDomain}</div>` : ""}

<div class="sidebar-section">
<div class="sidebar-title">Contact</div>
${user.email ? `<div class="contact-item">${user.email}</div>` : ""}
${user.phone ? `<div class="contact-item">${user.phone}</div>` : ""}
${location ? `<div class="contact-item">${location}</div>` : ""}
${user.socialLinks?.linkedin ? `<div class="contact-item"><a href="${user.socialLinks.linkedin}">LinkedIn</a></div>` : ""}
${user.socialLinks?.github ? `<div class="contact-item"><a href="${user.socialLinks.github}">GitHub</a></div>` : ""}
${user.socialLinks?.portfolio ? `<div class="contact-item"><a href="${user.socialLinks.portfolio}">Portfolio</a></div>` : ""}
</div>

${user.skills.length > 0 ? `<div class="sidebar-section"><div class="sidebar-title">Skills</div>${user.skills.map(s => `<span class="skill-item">${s}</span>`).join("")}</div>` : ""}

${user.languages && user.languages.length > 0 ? `<div class="sidebar-section"><div class="sidebar-title">Languages</div>${user.languages.map(l => `<div class="lang-item">${l}</div>`).join("")}</div>` : ""}
</div>

<div class="main">
${user.summary ? `<div class="main-section"><div class="main-title">Professional Summary</div><div class="summary">${user.summary}</div></div>` : ""}

${user.experience.length > 0 ? `<div class="main-section"><div class="main-title">Experience</div>${user.experience.map(exp => `<div class="entry"><div class="entry-title">${exp.position}</div><div class="entry-date">${exp.startDate} — ${exp.endDate}</div><div class="entry-sub">${exp.company}${exp.location ? ` · ${exp.location}` : ""}</div>${exp.description.length > 0 ? `<ul class="entry-desc">${exp.description.map(d => `<li>${d}</li>`).join("")}</ul>` : ""}</div>`).join("")}</div>` : ""}

${user.education.length > 0 ? `<div class="main-section"><div class="main-title">Education</div>${user.education.map(edu => `<div class="entry"><div class="entry-title">${edu.degree}</div><div class="entry-date">${edu.startDate} — ${edu.endDate}</div><div class="entry-sub">${edu.institution}${edu.location ? ` · ${edu.location}` : ""}${edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div></div>`).join("")}</div>` : ""}

${user.projects.length > 0 ? `<div class="main-section"><div class="main-title">Projects</div>${user.projects.map(p => `<div class="project-entry"><div class="project-name">${p.name}</div><div class="project-desc">${p.description}</div>${p.technologies.length > 0 ? `<div class="project-tech">${p.technologies.join(" · ")}</div>` : ""}</div>`).join("")}</div>` : ""}

${user.certifications.length > 0 ? `<div class="main-section"><div class="main-title">Certifications</div>${user.certifications.map(c => `<div class="cert-entry"><strong>${c.name}</strong> — ${c.issuer} <span>(${c.date})</span></div>`).join("")}</div>` : ""}
</div>
</body>
</html>`;
}

function renderCreative(user: User, name: string, location: string): string {
  const socialLinks = buildSocialLinks(user);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${name} - Resume</title>
<style>
@page{size:A4;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#2d2d2d;background:#fff}
@media print{body{background:#fff}}
.header{background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);color:#fff;padding:36px 32px 28px}
.header .name{font-size:30px;font-weight:800;letter-spacing:-0.5px}
.header .title{font-size:13px;opacity:0.85;margin-top:4px;letter-spacing:0.5px}
.header .contact{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:12px;font-size:11.5px;opacity:0.9}
.header .contact a{color:#fff;text-decoration:none}
.content{padding:24px 32px}
.section{margin-bottom:20px}
.section-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.section-icon{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#a855f7);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700}
.section-title{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6366f1}
.section-line{flex:1;height:2px;background:linear-gradient(90deg,#e0e7ff,transparent)}
.summary{font-size:12.5px;color:#555;line-height:1.65;padding-left:4px}
.card{background:#faf5ff;border-radius:10px;padding:14px 16px;margin-bottom:10px;border-left:3px solid #a855f7;transition:transform 0.2s}
.card:hover{transform:translateX(2px)}
.card-title{font-size:13px;font-weight:700;color:#1e1b4b}
.card-sub{font-size:11px;color:#7c3aed;margin-top:2px}
.card-date{font-size:10px;color:#a78bfa;margin-top:1px}
.card-desc{font-size:11px;color:#555;margin-top:5px;padding-left:12px}
.card-desc li{margin-bottom:2px}
.skills-wrap{display:flex;flex-wrap:wrap;gap:6px}
.skill-pill{font-size:10.5px;padding:4px 12px;background:linear-gradient(135deg,#ede9fe,#faf5ff);border:1px solid #e0e7ff;border-radius:20px;color:#6d28d9;font-weight:500}
.cert-item{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.cert-dot{width:6px;height:6px;border-radius:50%;background:#a855f7}
.cert-name{font-size:12px;font-weight:600;color:#1e1b4b}
.cert-meta{font-size:10.5px;color:#7c3aed}
.project-card{background:#f5f3ff;border-radius:10px;padding:12px 14px;margin-bottom:8px}
.project-name{font-size:12.5px;font-weight:700;color:#4c1d95}
.project-desc{font-size:11px;color:#555;margin-top:2px}
.project-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.project-tag{font-size:9.5px;padding:2px 7px;background:#ede9fe;border-radius:10px;color:#7c3aed}
.lang-wrap{display:flex;flex-wrap:wrap;gap:6px}
.lang-pill{font-size:11px;padding:3px 12px;background:#f5f3ff;border-radius:15px;color:#6d28d9}
</style>
</head>
<body>
<div class="header">
<div class="name">${name}</div>
${user.jobDomain ? `<div class="title">${user.jobDomain}</div>` : ""}
<div class="contact">
${user.email ? `<span>${user.email}</span>` : ""}
${user.phone ? `<span>${user.phone}</span>` : ""}
${location ? `<span>${location}</span>` : ""}
${socialLinks}
</div>
</div>
<div class="content">
${user.summary ? `<div class="section"><div class="section-header"><div class="section-icon">S</div><div class="section-title">Summary</div><div class="section-line"></div></div><div class="summary">${user.summary}</div></div>` : ""}

${user.experience.length > 0 ? `<div class="section"><div class="section-header"><div class="section-icon">E</div><div class="section-title">Experience</div><div class="section-line"></div></div>${user.experience.map(exp => `<div class="card"><div class="card-title">${exp.position}</div><div class="card-sub">${exp.company}${exp.location ? ` · ${exp.location}` : ""}</div><div class="card-date">${exp.startDate} — ${exp.endDate}</div>${exp.description.length > 0 ? `<ul class="card-desc">${exp.description.map(d => `<li>${d}</li>`).join("")}</ul>` : ""}</div>`).join("")}</div>` : ""}

${user.education.length > 0 ? `<div class="section"><div class="section-header"><div class="section-icon">D</div><div class="section-title">Education</div><div class="section-line"></div></div>${user.education.map(edu => `<div class="card"><div class="card-title">${edu.degree}</div><div class="card-sub">${edu.institution}${edu.location ? ` · ${edu.location}` : ""}${edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div><div class="card-date">${edu.startDate} — ${edu.endDate}</div></div>`).join("")}</div>` : ""}

${user.skills.length > 0 ? `<div class="section"><div class="section-header"><div class="section-icon">T</div><div class="section-title">Skills</div><div class="section-line"></div></div><div class="skills-wrap">${user.skills.map(s => `<span class="skill-pill">${s}</span>`).join("")}</div></div>` : ""}

${user.projects.length > 0 ? `<div class="section"><div class="section-header"><div class="section-icon">P</div><div class="section-title">Projects</div><div class="section-line"></div></div>${user.projects.map(p => `<div class="project-card"><div class="project-name">${p.name}</div><div class="project-desc">${p.description}</div><div class="project-tags">${p.technologies.map(t => `<span class="project-tag">${t}</span>`).join("")}</div></div>`).join("")}</div>` : ""}

${user.certifications.length > 0 ? `<div class="section"><div class="section-header"><div class="section-icon">C</div><div class="section-title">Certifications</div><div class="section-line"></div></div>${user.certifications.map(c => `<div class="cert-item"><div class="cert-dot"></div><div class="cert-name">${c.name}</div><div class="cert-meta">${c.issuer} · ${c.date}</div></div>`).join("")}</div>` : ""}

${user.languages && user.languages.length > 0 ? `<div class="section"><div class="section-header"><div class="section-icon">L</div><div class="section-title">Languages</div><div class="section-line"></div></div><div class="lang-wrap">${user.languages.map(l => `<span class="lang-pill">${l}</span>`).join("")}</div></div>` : ""}
</div>
</body>
</html>`;
}

function renderTech(user: User, name: string, location: string): string {
  const socialLinks = buildSocialLinks(user);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${name} - Resume</title>
<style>
@page{size:A4;margin:16mm 18mm}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Fira Code','Cascadia Code','Consolas',monospace;color:#d4d4d4;background:#1e1e1e;font-size:11px;line-height:1.6}
@media print{body{background:#fff;color:#1a1a1a}}
.kw{color:#569cd6}
.str{color:#ce9178}
.cm{color:#6a9955}
.type{color:#4ec9b0}
.num{color:#b5cea8}
.fn{color:#dcdcaa}
.var{color:#9cdcfe}
.op{color:#d4d4d4}
.header{margin-bottom:16px;border-bottom:1px solid #3c3c3c;padding-bottom:10px}
.header .line{display:flex;align-items:center;gap:6px}
.header .name{font-size:20px;font-weight:700;color:#dcdcaa}
.header .title{color:#6a9955;margin-top:2px}
.contact-line{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:6px;color:#9cdcfe;font-size:10.5px}
.contact-line a{color:#9cdcfe;text-decoration:none}
.section{margin-bottom:14px}
.section-head{color:#569cd6;font-size:12px;margin-bottom:6px}
.section-head::before{content:"// "}
.summary{color:#d4d4d4;padding-left:14px;border-left:2px solid #3c3c3c}
.block{padding-left:14px;border-left:2px solid #3c3c3c;margin-bottom:8px}
.block-header{color:#dcdcaa;font-size:12px}
.block-meta{color:#6a9955;font-size:10px}
.block-sub{color:#ce9178;font-size:10.5px}
.block-desc{color:#d4d4d4;font-size:10.5px;padding-left:12px;margin-top:3px}
.block-desc li{margin-bottom:2px}
.skill-line{display:flex;flex-wrap:wrap;gap:4px}
.skill-tag{font-size:10px;padding:2px 8px;background:#2d2d2d;border:1px solid #3c3c3c;border-radius:3px;color:#4ec9b0}
.cert-line{color:#d4d4d4;font-size:10.5px;margin-bottom:3px}
.cert-line .cn{color:#dcdcaa}
.cert-line .ci{color:#ce9178}
.cert-line .cd{color:#6a9955}
.project-block{padding-left:14px;border-left:2px solid #3c3c3c;margin-bottom:8px}
.project-name{color:#dcdcaa;font-size:11.5px}
.project-desc{color:#d4d4d4;font-size:10.5px;margin-top:2px}
.project-tech{color:#4ec9b0;font-size:9.5px;margin-top:2px}
.lang-line{display:flex;flex-wrap:wrap;gap:4px}
.lang-tag{color:#9cdcfe;font-size:10.5px}
</style>
</head>
<body>
<div class="header">
<div class="line"><span class="kw">const</span> <span class="var">name</span> <span class="op">=</span> <span class="str">"${name}"</span><span class="op">;</span></div>
${user.jobDomain ? `<div class="title"><span class="kw">const</span> <span class="var">role</span> <span class="op">=</span> <span class="str">"${user.jobDomain}"</span><span class="op">;</span></div>` : ""}
<div class="contact-line">
${user.email ? `<span>${user.email}</span>` : ""}
${user.phone ? `<span>${user.phone}</span>` : ""}
${location ? `<span>${location}</span>` : ""}
${socialLinks}
</div>
</div>

${user.summary ? `<div class="section"><div class="section-head">summary</div><div class="summary">${user.summary}</div></div>` : ""}

${user.experience.length > 0 ? `<div class="section"><div class="section-head">experience</div>${user.experience.map(exp => `<div class="block"><div class="block-header">fn ${exp.position}() {</div><div class="block-meta">${exp.startDate} → ${exp.endDate}</div><div class="block-sub">company: "${exp.company}"${exp.location ? `, location: "${exp.location}"` : ""}</div>${exp.description.length > 0 ? `<ul class="block-desc">${exp.description.map(d => `<li>${d}</li>`).join("")}</ul>` : ""}<div class="block-header">}</div></div>`).join("")}</div>` : ""}

${user.education.length > 0 ? `<div class="section"><div class="section-head">education</div>${user.education.map(edu => `<div class="block"><div class="block-header">class ${edu.degree.replace(/[^a-zA-Z0-9]/g, "")}</div><div class="block-sub">institution: "${edu.institution}"${edu.location ? `, location: "${edu.location}"` : ""}${edu.gpa ? `, gpa: "${edu.gpa}"` : ""}</div><div class="block-meta">${edu.startDate} → ${edu.endDate}</div></div>`).join("")}</div>` : ""}

${user.skills.length > 0 ? `<div class="section"><div class="section-head">skills</div><div class="skill-line">${user.skills.map(s => `<span class="skill-tag">${s}</span>`).join("")}</div></div>` : ""}

${user.projects.length > 0 ? `<div class="section"><div class="section-head">projects</div>${user.projects.map(p => `<div class="project-block"><div class="project-name">project "${p.name}"</div><div class="project-desc">${p.description}</div><div class="project-tech">[${p.technologies.join(", ")}]</div></div>`).join("")}</div>` : ""}

${user.certifications.length > 0 ? `<div class="section"><div class="section-head">certifications</div>${user.certifications.map(c => `<div class="cert-line"><span class="cn">${c.name}</span> <span class="op">@</span> <span class="ci">${c.issuer}</span> <span class="cd">(${c.date})</span></div>`).join("")}</div>` : ""}

${user.languages && user.languages.length > 0 ? `<div class="section"><div class="section-head">languages</div><div class="lang-line">${user.languages.map(l => `<span class="lang-tag">"${l}"</span>`).join("")}</div></div>` : ""}
</body>
</html>`;
}

function buildSocialLinks(user: User): string {
  const links: string[] = [];
  if (user.socialLinks?.linkedin) links.push(`<a href="${user.socialLinks.linkedin}">LinkedIn</a>`);
  if (user.socialLinks?.github) links.push(`<a href="${user.socialLinks.github}">GitHub</a>`);
  if (user.socialLinks?.portfolio) links.push(`<a href="${user.socialLinks.portfolio}">Portfolio</a>`);
  if (user.socialLinks?.twitter) links.push(`<a href="${user.socialLinks.twitter}">X/Twitter</a>`);
  return links.join("");
}
