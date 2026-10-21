# BaiiSelf | Game Review Hub

Static website for GitHub Pages.

## Files
- `index.html` — page structure
- `style.css` — layout, colors, responsive styles and 16:9 image frames
- `script.js` — game data, filters, gallery, community review form and suggestions
- `images/` — add game cover and screenshot images here

## Add game images
For each game, upload four JPG files to its matching folder:
- `cover.jpg`
- `scene-1.jpg`
- `scene-2.jpg`
- `scene-3.jpg`

Image paths are declared in `script.js`. Keep folder and file names exactly as written there. Genshin Impact and Wuthering Waves folder names currently contain a space.

## Important: community form storage
This is a static GitHub Pages site. Community reviews and game suggestions currently save to the submitting visitor's own browser (`localStorage`); they are **not shared with other visitors** and do not notify the site owner. To collect public submissions across devices, connect the forms to a shared backend/database or an external form service before advertising them as public community features.

## Deploy
Commit the files to the repository root on the branch configured for GitHub Pages. Open the repository's Settings → Pages to check the publishing source.
