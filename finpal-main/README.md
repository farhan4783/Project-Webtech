# Finpal

This is a Vite React project. This repository is prepared to deploy to GitHub Pages via GitHub Actions.

Quick local commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

Push to GitHub (example)

1. Create a new repo on GitHub (do NOT initialize with a README).
2. In this project directory run:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git add -A
git commit -m "Initial commit"
git push -u origin main
```

Deployment (GitHub Pages)

- A GitHub Actions workflow is included at `.github/workflows/deploy.yml`. It builds the site and publishes the `dist/` output to the `gh-pages` branch whenever you push to `main`.
- No extra secrets are needed; the workflow uses `GITHUB_TOKEN`.

Alternative hosts

- Vercel or Netlify: connect your GitHub repo and they will auto-deploy on push. For Vercel, import the project and set the framework to `Vite`.

If you want, I can initialize git here, make the initial commit, and help create the remote or set up a repo on GitHub (you will need to authenticate when pushing or provide a token).
