# Game Review Hub

A beginner-friendly, responsive game review website built with plain HTML, CSS, and JavaScript. Designed for GitHub Pages.

## Features
- Dark black-and-purple gaming theme
- Sample game library with genre, cover-style artwork, and scores
- Search, category filters, and sorting
- Review form with 1–10 score
- Reviews saved in the current browser using `localStorage`

## Important limitation
This starter version is a static demo. Reviews are stored only in the browser/device that submitted them, so other visitors will not see those reviews. To enable shared public reviews, add a backend/database and appropriate abuse protection (for example, Supabase/Firebase plus validation and moderation). Do not put private API keys in frontend files.

## Publish with GitHub Pages
1. Create a **public** repository named `game-review-hub` on GitHub (GitHub Free supports Pages for public repositories).
2. Upload `index.html` and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then click **Save**.
6. Wait for deployment. Your website URL will usually be `https://YOUR-USERNAME.github.io/game-review-hub/`. Replace `YOUR-USERNAME` with your GitHub username.
7. If you update `index.html`, commit the changes; Pages will redeploy automatically.

## Customize
- Edit the `games` array near the bottom of `index.html` to add or change games.
- Current artwork is emoji/gradient placeholder art. Replace it with original artwork or images you have permission to use.
- Review text and scores are demo content; make them your own before publishing.
