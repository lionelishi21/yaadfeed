---
name: manual-image-management
description: Handles image generation manually by skipping the OpenAI API and using placeholder images, since the user uploads images themselves.
---

# Manual Image Management

The user has opted to skip programmatic AI image generation (e.g., via OpenAI's DALL-E) to save costs and control the image generation process manually.

When the user asks to "skip the API for images" or use placeholder images, follow these steps:
1. Do not make any calls to the `openai.images.generate` endpoint.
2. Ensure that any code that handles image generation (e.g., `src/lib/imageService.ts`) is configured to gracefully fallback to local placeholder images or skip image generation entirely if `OPENAI_API_KEY` is not present or set to a dummy value.
3. Inform the user that placeholder images have been used for the new content.
4. Remind the user they can manually upload their own generated images to the `public/images/generated/` directory or use the Admin panel to update images.
5. If modifying scraping scripts, ensure they do not require an active `OPENAI_API_KEY` for images, and bypass the image generation step while continuing to process text and metadata.
