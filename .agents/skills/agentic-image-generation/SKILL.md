---
name: agentic-image-generation
description: Automates the process of identifying articles missing images, generating an AI image for them using the `generate_image` tool, and saving them to the database.
---

# Agentic Image Generation Workflow

When the user asks you to manually generate missing images using your own capabilities (because they lack API credits or prefer the AI agent to do it), follow these exact steps:

1. **List Missing Images**
   Use the `run_command` tool to execute the helper script which queries the live database for articles that are missing an `imageUrl`:
   ```bash
   source ~/.nvm/nvm.sh && nvm use 22 && npx tsx scripts/agent-image-helper.ts list
   ```
   *Note: This script requires a valid `MONGODB_URI` in `.env.local`.*

2. **Generate Images**
   The helper script will output a list of articles, including their `ID`, a suggested `Slug`, and a suggested `Prompt`.
   - For the articles you wish to process (start with a small batch, like 1 to 5 at a time), use your `generate_image` tool.
   - Supply the suggested `Prompt` (or modify it as appropriate) and use the `Slug` as the `ImageName` parameter.

3. **Move and Update Database**
   Once the `generate_image` tool completes, it will save the image to the artifacts directory.
   - Use the `run_command` tool to copy/move the generated image from the artifacts directory to `public/images/generated/[slug].png` in the workspace.
   - Use the helper script to update the live database with the new image path:
     ```bash
     source ~/.nvm/nvm.sh && nvm use 22 && npx tsx scripts/agent-image-helper.ts update [ID] /images/generated/[slug].png
     ```

4. **Verify and Repeat**
   - Confirm with the user that the images look good.
   - If there are more missing images, ask the user if they'd like you to continue processing the next batch.
