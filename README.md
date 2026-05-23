# JobInPark

**AI-Powered Job Discovery Platform for Tech Parks**

JobInPark is a full-featured job portal built with Next.js 16 that connects job seekers at tech parks (Technopark, Infopark) with intelligent job matching, AI-generated application emails, multi-channel notifications, and a built-in resume builder.

<p align="center">
  <img src="repo/Screenshot1.png" alt="JobInPark Landing Page" width="800"/>
  <br/>
  <em>Landing Page — Typing hero animation with featured job listings</em>
</p>

---

## Features

<div align="center">
  <table>
    <tr>
      <td align="center" width="200">
        <strong>🎯 AI Job Matching</strong><br/>
        <sub>Skills & domain based matching</sub>
      </td>
      <td align="center" width="200">
        <strong>📬 Multi-Channel Notifications</strong><br/>
        <sub>Email · Telegram · WhatsApp</sub>
      </td>
      <td align="center" width="200">
        <strong>🤖 AI Cover Letters</strong><br/>
        <sub>NVIDIA GPT-powered generation</sub>
      </td>
    </tr>
    <tr>
      <td align="center" width="200">
        <strong>📄 Resume Builder</strong><br/>
        <sub>4 themes · HTML download</sub>
      </td>
      <td align="center" width="200">
        <strong>👤 User Dashboard</strong><br/>
        <sub>Command center with filters</sub>
      </td>
      <td align="center" width="200">
        <strong>🛡️ Admin Panel</strong><br/>
        <sub>Analytics · CRUD · Bulk upload</sub>
      </td>
    </tr>
    <tr>
      <td align="center" width="200">
        <strong>🔍 Public Job Board</strong><br/>
        <sub>Filters · Sort · Experience range</sub>
      </td>
      <td align="center" width="200">
        <strong>🔐 Auth System</strong><br/>
        <sub>JWT · Email verification · Reset</sub>
      </td>
      <td align="center" width="200">
        <strong>⚡ Workflow Automation</strong><br/>
        <sub>Orchestrated multi-step processes</sub>
      </td>
    </tr>
  </table>
</div>

---

## Screenshots

<p align="center">
  <img src="repo/Screenshot1.png" alt="Landing Page" width="380"/>
  <img src="repo/Screenshot2.png" alt="Dashboard" width="380"/>
  <br/>
  <img src="repo/Screenshot3.png" alt="Job Details with AI Email" width="380"/>
  <img src="repo/Screenshot4.png" alt="Resume Builder" width="380"/>
  <br/>
  <img src="repo/Screenshot5.png" alt="Admin Dashboard" width="380"/>
  <img src="repo/Screenshot6.png" alt="Notification Settings" width="380"/>
  <br/>
  <img src="repo/Screenshot7.png" alt="Profile Editor" width="380"/>
</p>

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.2.6](https://nextjs.org) (App Router) |
| **UI Library** | [React 19.2.4](https://react.dev) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Database** | [MongoDB 7](https://www.mongodb.com) (native driver) |
| **Auth** | JWT ([`jose`](https://github.com/panva/jose)) + [`bcryptjs`](https://github.com/dcodeIO/bcrypt.js) |
| **AI Engine** | [OpenAI SDK](https://github.com/openai/openai-node) → [NVIDIA NIM API](https://build.nvidia.com/explore/discover) (`openai/gpt-oss-120b`) |
| **Email** | [Resend](https://resend.com) |
| **Telegram** | Telegram Bot API |
| **Workflow** | [`workflow`](https://www.npmjs.com/package/workflow) SDK v4.2.4 |
| **Fonts** | [Geist](https://vercel.com/font) + [JetBrains Mono](https://www.jetbrains.com/lp/mono/) |
| **Containerization** | Docker Compose (MongoDB 7 + Mongo Express) |

---

## Project Structure

```
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Landing page (hero + featured jobs)
│   ├── layout.tsx              # Root layout with fonts
│   ├── globals.css             # Tailwind v4 theme + design system
│   ├── dash/                   # User dashboard
│   ├── admin/                  # Admin panel
│   ├── login/ & signup/        # Auth pages
│   ├── jobs/page.tsx           # Public job board
│   └── api/                    # API routes (health, email verify, resume, telegram)
├── actions/                    # Server Actions
│   ├── auth/                   # Login, create account, reset password
│   ├── user/                   # Jobs, profile, AI email, settings
│   ├── admin/                  # Admin CRUD, analytics, bulk upload
│   ├── email/                  # Resend wrapper + templates
│   ├── telegram/send.ts        # Telegram bot sender
│   └── whatsapp/send.ts        # WhatsApp sender (mock)
├── components/                 # Shared React components
├── workflows/                  # Workflow SDK definitions
├── lib/                        # Utilities (db, resume templates)
├── types/                      # TypeScript interfaces
├── public/                     # Static assets (favicons, images)
├── repo/                       # README screenshots
├── proxy.ts                    # Next.js middleware (auth routing)
├── docker-compose.yml          # Local MongoDB setup
└── .env.local                   # Environment variables
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **MongoDB** 7 (local via Docker or Atlas)
- **npm** / **pnpm** / **yarn**

### Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB
MONGODB_URI=mongodb://admin:password@localhost:27017/jobinpark?authSource=admin

# JWT
JWT_SECRET=your-secret-key-min-32-chars-long

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=notifications@jobinpark.com

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token

# AI (NVIDIA NIM)
OPENAI_API_KEY=nvapi-xxxxxxxxxxxx
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1

# App
NEXT_PUBLIC_APP_URL=https://jobinpark.com
```

### Option 1: Local Dev with Docker

```bash
# Start MongoDB 7 + Mongo Express (http://localhost:8081)
docker compose up -d

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Option 2: Local Dev with Atlas

Point `MONGODB_URI` to your MongoDB Atlas connection string, then:

```bash
npm install
npm run dev
```

---

## Deployment Guide

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/jobinpark.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Framework preset: **Next.js** (auto-detected)

3. **Environment Variables**
   Add all variables from `.env.local` in Vercel Dashboard → Project Settings → Environment Variables.

4. **Deploy**
   Vercel auto-deploys on every `git push` to the production branch.

5. **Custom Domain** (optional)
   Go to Project Settings → Domains → add `jobinpark.com`. Update DNS records as instructed.

6. **MongoDB Network Access**
   Ensure your MongoDB deployment allows connections from Vercel's IP range, or use IP-based access lists.

### Production Build

```bash
npm run build
npm start
```

---

## How It Works

### Job Matching Engine

1. Workflow engine fetches active jobs from MongoDB.
2. Each user's skills and job domain are compared against job titles, descriptions, and required skills.
3. Matched jobs are dispatched via Email (Resend), Telegram, and WhatsApp.

### AI Email Generation

1. User clicks **Apply** on a job card.
2. Profile (skills, experience, education) + job details are sent to NVIDIA's GPT model.
3. A personalized cover letter and application email are returned instantly.

### Resume Builder

1. Fill out profile: education, experience, projects, skills, certifications.
2. Choose a theme — **Minimalist**, **Executive**, **Creative**, or **Terminal**.
3. Download a self-contained HTML resume file.

### Notification Channels

- **Email**: Transactional emails via Resend with rich HTML templates.
- **Telegram**: Messages sent through a dedicated bot.
- **WhatsApp**: Mock integration ready for provider swap.

---

## Design System

The UI follows a **cinematic, technical aesthetic** — Apple-inspired minimalism fused with blueprint-style futuristic design.

| Element | Specification |
|---|---|
| **Primary Color** | Electric Blue `#0055c8` / `#1e73ff` |
| **Surface** | Soft-white `#f8f9fb` |
| **Headlines** | JetBrains Mono (oversized, tight letter-spacing) |
| **Body** | Geist (humanist sans-serif) |
| **Card Radius** | `rounded-2xl` (24px) |
| **Button Radius** | `rounded-lg` (8px) |
| **Elevation** | Glassmorphism + ambient shadows |
| **Grid** | 12-column fluid, 8px base unit |

Full specification in [`DESIGN.md`](DESIGN.md).

---

## License

This is a private project. All rights reserved.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/pranavkdileep">Pranav K Dileep</a><br/>
  <sub>Computer Science & Cyber Security · UCE Thodupuzha</sub>
</p>
