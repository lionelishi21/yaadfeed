#!/usr/bin/env node

require('dotenv').config();

const HELP_TEXT = `
🇯🇲 YaadFeed Article Regeneration Tool - Local Image System

USAGE:
  npm run regenerate [-- --count=N] [-- --mode=MODE]
  node scripts/regenerate-articles.js [--count=N] [--mode=MODE] [--help]

MODES:
  generate      Generate new articles with AI images saved locally (default)
  update-images Update existing articles with new local AI images

OPTIONS:
  --count=N     Number of articles to generate (default: 10)
  --mode=MODE   Operation mode: generate or update-images
  --help        Show this help message

📸 NEW LOCAL IMAGE SYSTEM:
  • AI images are generated ONCE during article creation
  • Images are downloaded and saved to public/images/generated/
  • Website displays local images = NO GENERATION COSTS on visits
  • Estimated savings: 95% reduction in OpenAI image costs
  • Local images load faster and are always available

EXAMPLES:
  npm run regenerate                    # Generate 10 articles with local images
  npm run regenerate:15                 # Generate 15 articles with local images  
  npm run regenerate:images             # Update existing articles with local images
  npm run regenerate -- --count=25     # Generate 25 articles with local images

COST BREAKDOWN (per article):
  • AI Text Generation: ~$0.03
  • AI Image Generation: ~$0.04 (ONCE, saved locally)
  • Image Display: $0.00 (served from local storage)
  • Total per article: ~$0.07 (vs $0.04 per page view previously)

REQUIREMENTS:
  • OPENAI_API_KEY in environment
  • MONGODB_URI in environment
  • Write permissions to public/images/generated/
`;

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(HELP_TEXT);
    return;
  }

  // Check required environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is required in environment variables');
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is required in environment variables');
    process.exit(1);
  }

  // Parse arguments
  const count = parseInt(args.find(arg => arg.startsWith('--count='))?.split('=')[1] || '10');
  const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'generate';

  console.log('🇯🇲 YaadFeed Article Regeneration - Local Image System');
  console.log('════════════════════════════════════════════════════════');
  console.log(`📊 Mode: ${mode}`);
  console.log(`📝 Count: ${count} articles`);
  console.log(`💾 Images: Saved locally to public/images/generated/`);
  console.log('════════════════════════════════════════════════════════');

  try {
    const { ArticleGenerator } = require('../src/lib/articleGenerator');
    const { ImageService } = require('../src/lib/imageService');

    let result;
    const startTime = Date.now();

    if (mode === 'update-images') {
      console.log('\n🖼️ Updating existing articles with new local images...');
      await ArticleGenerator.updateExistingArticlesWithImages();
      
      // Get image stats
      const imageStats = await ImageService.getImageStats();
      
      result = {
        success: true,
        message: 'Successfully updated existing articles with local images',
        mode: 'update-images',
        imageStats
      };
    } else {
      console.log(`\n🚀 Generating ${count} new articles with local images...`);
      result = await ArticleGenerator.regenerateAllContent(count);
      
      // Get image stats
      const imageStats = await ImageService.getImageStats();
      result.imageStats = imageStats;
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (result.success) {
      console.log('\n✅ SUCCESS!');
      console.log('════════════════════════════════════════════════════════');
      console.log(`⏱️  Duration: ${duration} seconds`);
      console.log(`📝 Articles: ${result.count || 'N/A'} processed`);
      console.log(`🖼️  Local Images: ${result.imageStats?.totalImages || 0} total`);
      console.log(`📁 Image Directory: ${result.imageStats?.directory || 'N/A'}`);
      
      if (result.articles && result.articles.length > 0) {
        console.log('\n📰 Generated Articles:');
        result.articles.slice(0, 5).forEach((article, index) => {
          const imageType = article.imageUrl?.startsWith('/images/generated/') ? '🤖 AI-Local' : '📷 Fallback';
          console.log(`  ${index + 1}. ${article.title?.substring(0, 60)}... [${imageType}]`);
        });
        
        if (result.articles.length > 5) {
          console.log(`  ... and ${result.articles.length - 5} more articles`);
        }
      }
      
      console.log('\n💰 Cost Benefits:');
      console.log('  • Images generated once and saved locally');
      console.log('  • Zero generation costs on website visits');
      console.log('  • Faster loading from local storage');
      console.log('  • Always available (no external API dependencies)');
      
    } else {
      console.log('\n❌ FAILED!');
      console.log('════════════════════════════════════════════════════════');
      console.log(`⏱️  Duration: ${duration} seconds`);
      console.log(`❌ Error: ${result.error || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('\n❌ SCRIPT ERROR:');
    console.error('════════════════════════════════════════════════════════');
    console.error(error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
} 