# SkillBridge Frontend

Simple Angular + Bootstrap frontend for your Spring Boot `OnlineJobPortal` backend, designed like a beginner-friendly real job portal.

## Run in local

1. Start Spring Boot app on `http://localhost:8081` (or update `proxy.conf.json`)
2. Open terminal in `frontend` folder
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start Angular app:
   ```bash
   npm start
   ```
5. Open `http://localhost:4200`

## Why proxy is used

`proxy.conf.json` forwards `/api`, `/authentication`, and `/admin` calls to Spring Boot, so you avoid CORS issues while developing.

## Pages included

- `Home`: Quick explanation of app flow
- `Auth`: Signup + login (`/authentication`)
- `Jobs`: List + create jobs (`/api/jobs`)
- `Freelancers`: List + create freelancers (`/api/freelancers`)
- `Recruiters`: Register/login/list recruiters (`/api/recruiters`)
- `Admin`: Pending recruiter approval + user management (`/admin`)
- `Skills`: Create/list/find/delete skills (`/api/skills`)
- `Applications`: Apply/update/remove/find job applications (`/jobapplication`)
- `Feedback`: Submit feedback (`/feedback/add`)
- `Bookmarks`: Bookmark freelancers and list bookmarks (`/api/bookmark`)

## Learn in 1 hour path

1. Check `src/app/services/api.service.ts`
2. Open one component (for example `jobs.component.ts`)
3. Follow flow: form submit -> service call -> API response -> list refresh
