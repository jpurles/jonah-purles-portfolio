# Adding videos to Jonah's portfolio

## What to send

Attach the original video files or share their local paths. For each clip, include any details you already know:

- **Title** for the card
- **Section** (`Client Video Work`, `Ad Creation`, `Passion Projects`, `My Favorites`, or `Archive`; default to `Passion Projects` if not specified)
- **Description** (optional)
- **Thumbnail moment** (optional; otherwise choose a clear representative frame)

If you only send a video, use a clean title based on its filename, add it to Passion Projects, and choose the thumbnail frame. Ask before inventing project claims or results for the description.

## Import steps

1. Keep the source file unchanged in its original location.
2. Create a browser-friendly H.264 MP4 in `assets/videos/` and a real still-frame JPEG in `assets/posters/`, using the same lowercase, hyphenated filename stem.
3. Add a project card in `index.html` that points to both assets and assigns the requested section.
4. Confirm both paths resolve, the video fully decodes, and the poster is visible at rest. Confirm muted looping playback starts on hover or keyboard focus and returns to the poster afterward.
5. Keep each MP4 under GitHub's regular per-file size limit.

The portfolio uses the still image for the resting card. It loads the MP4 only when someone hovers over or focuses the card, so the full clips do not download just to browse the grid.
