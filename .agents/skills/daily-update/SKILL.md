---
name: daily-update
description: Automates the daily scraping process to find new content and update the website. Use this skill when the user asks to "run the daily update" or "scrape new content".
---

# Daily Update Workflow

When the user asks you to run the daily update or scrape new content, follow these exact steps to update their website's database securely and seamlessly:

1. **Start the Next.js Development Server (if not running)**
   Use the `run_command` tool to launch the local development server in the background:
   ```bash
   npm run dev
   ```
   *Wait a few seconds for the server to fully initialize on port 4000.*

2. **Trigger the Scraper**
   Use the `run_command` tool to execute the existing scraping scripts.
   ```bash
   npm run scrape-artists
   ```
   *(Note: This sends a request to `http://localhost:4000/api/scrape-artists` behind the scenes, so the dev server must be running).*

3. **Check Missing Images**
   After the scraper finishes, remind the user about the `manual-image-management` skill.
   Run the following script to check if any new articles require images:
   ```bash
   npm run check-missing-images
   ```

4. **Report Back to User**
   - Provide a summary of the scraping script's output (how many new articles were found/added).
   - Inform the user which articles need manual images uploaded to `public/images/generated/`.
   - Ask if they'd like you to shut down the development server or keep it running so they can preview the new content.
