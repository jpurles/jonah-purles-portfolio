# Jonah Purles Portfolio

A small, framework-free portfolio site for editing in VS Code.

## Open locally

Open this folder in VS Code and open `index.html` in a browser. For a local server, the VS Code Live Server extension works well.

## Adding videos

For the repeatable video intake, asset, card, and verification steps, see [VIDEO_WORKFLOW.md](VIDEO_WORKFLOW.md).

## Personalize

- Replace the sample projects in `index.html` with your titles and descriptions.
- Assign a project to a section with its card’s `data-sections` attribute (`byu`, `ad-creation`, `passion`, or `archive`). Add `favorites` to any card you want to show under My Favorites. My Work shows every card by default.
- Add a web-ready MP4 to `assets/videos/` and a matching still image to `assets/posters/`. Set the card’s `<video data-src="..." data-poster="...">` paths and include an `<img class="project-poster">` for that still. The still appears at rest; the MP4 loads and plays muted on hover or keyboard focus, then the still returns when focus leaves. The uploaded originals are not needed in the site folder.
- Contact details are set in the contact sections of `index.html` and `about.html`.
- Update the draft biography and beliefs in `about.html`.
- Adjust layout, typography, and the light/dark palettes in `styles.css`.

Dark mode is the default. The theme toggle remembers each visitor’s choice in local storage.
