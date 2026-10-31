# Appocalypse Games

Responsive indie studio website, published with GitHub Pages at https://appocalypsegames.com.

The site ships as static HTML, CSS and JavaScript, without runtime dependencies. Existing public URLs are preserved.

## Local preview

Requires Node.js 20 or newer. No installation is needed.

```sh
npm run dev
```

Open http://127.0.0.1:4173. The local server supports the same extensionless page URLs as GitHub Pages.

## Editing

- `scripts/games.mjs`: game names, descriptions, platforms, screenshots and store links.
- `scripts/build.mjs`: page templates and shared navigation/footer.
- `content/privacy/`: original legal text, rendered without copy changes.
- `styles.css`: shared design and responsive layouts.
- `site.js`: mobile menu, catalogue filters and screenshot galleries.
- `images/web/`: optimised WebP copies of the original studio artwork and screenshots. Original images remain in `images/`.

After changing content or templates:

```sh
npm run build
npm run check
```

Commit the generated HTML alongside its source templates. GitHub Pages serves the root files directly, with no server or build step required in production. The `webAntigua/` archive is independent of the current site.
