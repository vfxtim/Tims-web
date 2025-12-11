# YouTube Video Embedding - Status & Re-enablement Guide

## Current Status
- **Gallery Type:** Static image gallery (non-clickable)
- **Location:** Section-Four / Portfolio section (`index.html` lines 307-354)
- **Issue:** YouTube video embedding was disabled due to video embedding restrictions

## What Happened
The project originally attempted to embed YouTube videos using Magnific Popup lightbox. Four gallery items in Section-Four were configured to open YouTube videos on click.

**Issue Encountered:**
- Videos with IDs `3Mru_O4VPZE` and `hn54rvnNVRQ` refused to load in embedded iframes
- **Root Cause:** The video owners/channels have disabled embedding (a YouTube account setting)
- YouTube sends `X-Frame-Options: SAMEORIGIN` or `Content-Security-Policy: frame-ancestors 'none'` headers, preventing the video from loading in any iframe on third-party sites

## Why It Can't Be "Fixed" With Code
- This is a **server-side restriction** set by YouTube/video owners, not a code issue
- No amount of JavaScript, CSS, or HTML modifications can override YouTube's embedding policy
- The only solutions are:
  1. Use a video ID from a channel that **allows embedding**
  2. Switch to a different video platform (Vimeo, self-hosted, etc.)
  3. Open watch pages in new tabs (fallback UX)

## How to Re-enable Video Embedding

### Option 1: Use a Video ID That Allows Embedding (Quickest)
1. Find a YouTube video where embedding is enabled (owner's channel allows it)
2. Test the embed URL directly in your browser:
   ```
   https://www.youtube.com/embed/VIDEO_ID
   ```
   - If it plays: embedding is allowed ✓
   - If it shows an error: embedding is disabled ✗

3. Update `index.html` gallery items (lines 309, 323, 337, 351):
   ```html
   <!-- OLD (disabled): -->
   <div class="gallery-item-sub">
     <img src="...">
   </div>

   <!-- NEW (with clickable video): -->
   <a class="gallery-item-sub youtube" href="https://www.youtube.com/embed/YOUR_VIDEO_ID">
     <img src="...">
   </a>
   ```

4. Uncomment/re-enable the YouTube popup in `assets/javascript/script.js` (lines 134-138):
   ```javascript
   $('.youtube').magnificPopup({
       items: {
           src: 'https://www.youtube.com/embed/YOUR_VIDEO_ID'
       },
       type: 'iframe'
   });
   ```

### Option 2: Use Vimeo Instead
Vimeo allows embedding by default on most videos. Replace YouTube links with Vimeo video embeds using the same `.vimeo` class already in the code.

### Option 3: Fallback - Open Watch Page in New Tab
Modify script.js to open the YouTube watch page when clicked instead of trying to embed:
```javascript
$('.youtube').on('click', function(e) {
    e.preventDefault();
    const videoUrl = $(this).attr('href');
    const watchUrl = videoUrl.replace('/embed/', '/watch?v=');
    window.open(watchUrl, '_blank');
});
```

## Files Involved
- **HTML:** `index.html` (lines 307-354 - Section-Four gallery)
- **JavaScript:** `assets/javascript/script.js` (lines 130-138 - popup initialization)
- **CSS:** `assets/css/style.css` (`.gallery`, `.gallery-item`, `.gallery-item-sub` classes)

## Testing Workflow
1. Get a YouTube video ID
2. Test: `https://www.youtube.com/embed/VIDEO_ID` in browser
3. If it plays → use that ID
4. Update `index.html` anchors with `href="https://www.youtube.com/embed/VIDEO_ID"`
5. Update `script.js` popup `src` to match
6. Test on the live site

## Reference: Previous Attempts
- Tried video IDs: `3Mru_O4VPZE`, `hn54rvnNVRQ` — both had embedding disabled
- Tested URL formats: youtu.be, watch?v=, /embed/ — all normalized correctly
- Magnific Popup configuration verified working (logs showed correct URL parsing)
- Browser iframe attributes (allow, allowfullscreen) verified — not the issue

---
*Last updated: 2025-12-12*
*Next step: Find an embeddable video and follow Option 1 above*
