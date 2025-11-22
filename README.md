# Tutorial: Run a Next.js 15 Project with pnpm

This guide will show you how to quickly set up, install dependencies, and start developing a Next.js 15+ application using **pnpm** (a fast, disk space-efficient package manager).

---

## Prerequisites

- **Node.js** 22 or higher. Download from [nodejs.org](https://nodejs.org/)
- **pnpm** installed globally. Install with:

  ```bash
  npm install -g pnpm
  ```

---

## 1. Clone the Project

If you are starting from a boilerplate or public repo:

```bash
git clone https://github.com/your-username/your-nextjs15-project.git
cd your-nextjs15-project
```

---

## 2. Install Dependencies with pnpm

```bash
pnpm install
```

Unlike npm or yarn, `pnpm` creates a fast, symlinked `node_modules` folder using a global content-addressable store, so installs are much faster and save disk space across projects.

---

## 3. Configure Environment Variables (Optional, but Recommended)

If your project requires environment variables (such as API keys):

1. Copy `.env.example` to `.env.local`, or create `.env.local` yourself.
2. Edit values according to your needs, for example:

   ```dotenv
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```

---

## 4. Run the Development Server

```bash
pnpm dev
```

By default, this starts your Next.js 15 app at [http://localhost:3000](http://localhost:3000).

Open your browser and navigate to that address to view your application.

---

## 5. Useful Scripts

Here are common scripts for a Next.js + pnpm project (check your `package.json` for your project’s exact commands):

- **Development:**
  ```bash
  pnpm dev
  ```
- **Build production:**
  ```bash
  pnpm build
  ```
- **Start production server:**
  ```bash
  pnpm start
  ```
- **Lint code:**
  ```bash
  pnpm lint
  ```
- **Test:**
  ```bash
  pnpm test
  ```

---

## 6. Additional Notes

- Preferred IDE: [VSCode](https://code.visualstudio.com/) with the recommended extensions for Next.js, ESLint, and Tailwind CSS, if used.
- If you see a `pnpm` error about missing lockfile or modules, try clearing old state: `pnpm install --force`.

---

## 7. Deploying

Hosting providers that support Next.js 15+ and pnpm out-of-the-box include:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Sevalla](https://sevalla.com/)
- [Render](https://render.com/)

On these platforms, set the install command to `pnpm install` and the build command to `pnpm build`.

---

## 8. Troubleshooting

- Make sure you don’t mix package managers (don’t use `npm install` or `yarn install` in a pnpm-managed project).
- Delete any `node_modules` folder and `pnpm-lock.yaml` if you hit "out of sync" errors, then run `pnpm install`.
- Check Node.js version with `node -v` (must be 22+).

---

## 9. Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [pnpm Documentation](https://pnpm.io/)

---

Happy coding! 🎉
