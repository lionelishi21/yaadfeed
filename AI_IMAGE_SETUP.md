# 🎨 AI Image Generation Setup for YaadFeed

Your news site now supports **AI-generated dancehall and Jamaica-themed images** for articles using OpenAI DALL-E!

## 🚀 Quick Setup

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Click "Create new secret key"
4. Copy your API key (starts with `sk-...`)

### 2. Add API Key to Environment
Edit your `.env.local` file and add:
```bash
# OpenAI API for image generation
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Restart Development Server
```bash
npm run dev
```

## 🎯 How It Works

### Automatic AI Images
- **Dancehall/Music Articles**: Automatically get AI-generated images
- **Featured Articles**: First 5 articles always get AI images
- **Smart Detection**: Detects artist names (Vybz Kartel, Shenseea, etc.)

### Image Themes by Category
- **Entertainment**: Dancehall stages, reggae studios, sound systems
- **Sports**: Jamaican athletics, Olympic colors
- **Politics**: Kingston cityscape, Parliament buildings
- **Culture**: Jamaican festivals, Rastafarian art
- **Business**: Modern Kingston, Caribbean commerce

### Example Generated Prompts
```
"Create a vibrant dancehall stage performance with reggae and dancehall aesthetic. 
Style should reflect Shenseea's dancehall aesthetic. Include musical elements like 
speakers, microphones, or instruments. Digital art style, high contrast, vibrant colors."
```

## 🔧 Features

### ✅ Smart Caching
- Images are cached to avoid regenerating
- Saves API costs and improves performance

### ✅ Fallback System
- No API key? → Uses beautiful Jamaica-themed local images
- API fails? → Automatic fallback to local images
- Always shows something, never broken images

### ✅ Loading States
- Shows "🎨 Generating AI image..." while creating
- Smooth fade-in when image is ready

## 💰 Cost Estimation

- **DALL-E 3**: ~$0.04 per image (1024x1024)
- **Typical usage**: 10-20 images/day = $0.40-$0.80/day
- **Monthly**: ~$12-25 for a news site

## 🛠️ API Endpoints

### Generate Image
```bash
POST http://localhost:3002/api/generate-image
```

**Request:**
```json
{
  "title": "Shenseea Drops New Dancehall Anthem",
  "category": "entertainment", 
  "keywords": ["shenseea", "dancehall", "music"],
  "summary": "Rising dancehall star releases..."
}
```

**Response:**
```json
{
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/...",
  "prompt": "Create a vibrant dancehall stage performance...",
  "success": true
}
```

## 🎨 Customization

### Add More Artists
Edit `/src/app/api/generate-image/route.ts`:
```javascript
const dancehallArtists = [
  'vybz kartel', 'shenseea', 'spice', 'popcaan',
  'your-new-artist-name' // Add here
];
```

### Modify Visual Themes
Edit the `categoryThemes` object in the same file to customize image styles.

## 🐛 Troubleshooting

### No Images Generating?
1. Check `.env.local` has correct API key
2. Restart server: `npm run dev`
3. Check browser console for errors
4. Verify OpenAI account has credits

### Images Not Jamaica-Themed?
- The AI prompts are specifically designed for Jamaica/dancehall content
- Each image includes Jamaican colors, tropical elements, and cultural references

### API Costs Too High?
- Reduce AI generation to only dancehall articles
- Edit `ImageService.isDancehallContent()` to be more selective
- Increase caching duration

## 🌟 Example Results

With proper setup, your articles will have custom images like:
- **"Vybz Kartel Releases New Track"** → Dancehall studio with Jamaican flag colors
- **"Jamaica Wins Olympic Gold"** → Athletic track with Jamaican colors
- **"Reggae Sumfest 2025 Lineup"** → Festival stage with crowd and tropical sunset

## 🔗 Useful Links
- [OpenAI DALL-E Documentation](https://platform.openai.com/docs/guides/images)
- [OpenAI Pricing](https://openai.com/pricing#image-models)
- [API Usage Dashboard](https://platform.openai.com/usage)

---

Your YaadFeed site now creates **custom AI images** for every dancehall article! 🇯🇲🎵 