---
name: youtube-audio-downloader
description: "Use when downloading audio from YouTube URLs, converting to MP3, or when yt-dlp returns 403 Forbidden, bot detection errors, Sign in to confirm, n-challenge solving failed, or Only images are available for download errors."
user_invocable: true
---

# YouTube Audio Downloader  

## Overview 
Downloads YouTube audio as MP3 using yt-dlp with Node.js runtime and remote EJS challenge solver. Bypasses YouTube bot detection and n-challenge protection.  

## Prerequisites
| Tool | Check | Install |
|------|-------|---------|
| yt-dlp | yt-dlp --version | pip install yt-dlp |
| Node.js | node --version | https://nodejs.org |
| cookies file | See below | Export from browser |
yt-dlp version must be less than 90 days old. Upgrade if needed: pip install -U yt-dlp
## Cookies Setup (Required)
YouTube requires authentication cookies to bypass bot detection.
1. Install Chrome extension: Get cookies.txt LOCALLY
   URL: https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc
2. Open YouTube in Chrome while logged in
3. Click the extension, Export, save as www.youtube.com_cookies.txt
4. Place the file in your working directory
NOTE: If Chrome is running, --cookies-from-browser chrome will fail with
"Could not copy Chrome cookie database." Always use the exported file instead.
## Download Command
    yt-dlp -x --audio-format mp3 --audio-quality 0 --cookies "www.youtube.com_cookies.txt" --js-runtimes node --remote-components "ejs:github" -o "%(title)s.%(ext)s" "YOUTUBE_URL"
Key flags:
| Flag | Purpose |
|------|---------|
| -x | Extract audio only |
| --audio-format mp3 | Convert to MP3 |
| --audio-quality 0 | Best quality (0 = highest VBR) |
| --cookies | Auth cookies file path |
| --js-runtimes node | Use Node.js for JS challenges |
| --remote-components ejs:github | Download challenge solver from GitHub (required for n-challenge) |
## Troubleshooting
| Error | Cause | Fix |
|-------|-------|-----|
| Sign in to confirm you are not a bot | No cookies | Export and provide cookies file |
| Could not copy Chrome cookie database | Chrome is running | Export cookies.txt manually |
| n challenge solving failed + Only images available | Missing JS runtime or challenge solver | Add --js-runtimes node --remote-components ejs:github |
| Requested format is not available | n-challenge failed, only thumbnails returned | Same as above |
| Version warning more than 90 days old | Outdated yt-dlp | pip install -U yt-dlp |
| HTTP 403 on all fragments | Old yt-dlp, no PO token support | Upgrade yt-dlp |
## Common Mistakes
- Using --cookies-from-browser chrome while Chrome is open: always fails, use exported file instead
- Missing --remote-components ejs:github: n-challenge fails silently, only thumbnails returned
- Missing --js-runtimes node: yt-dlp defaults to deno which is not installed, challenge not solved
- Old yt-dlp version: missing PO token support causes 403 on all fragments