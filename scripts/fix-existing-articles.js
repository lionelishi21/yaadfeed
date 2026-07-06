require('dotenv').config();
const { MongoClient } = require('mongodb');

// A list of general philosophical insights to cycle through
const insights = [
  "<p><em>Philosophical Insight: In a rapidly evolving world, the resilience of the Jamaican spirit continues to demonstrate how local communities adapt to global challenges while maintaining their cultural core.</em></p>",
  "<p><em>Philosophical Insight: This development reminds us that progress is rarely linear. It is the collective memory and shared values of a people that ultimately steer the course of history.</em></p>",
  "<p><em>Philosophical Insight: Whether facing natural or economic shifts, the island's capacity for reinvention highlights a universal truth: true wealth lies in community solidarity and cultural authenticity.</em></p>",
  "<p><em>Philosophical Insight: As modern technologies intersect with traditional ways of life, we are invited to reflect on what it means to progress without losing the essence of who we are.</em></p>"
];

async function run() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const articles = await db.collection('news_items').find({}).toArray();
    
    let updated = 0;
    
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      let content = article.content || '';
      
      // If it looks like plain text (no <p> tags), wrap paragraphs
      if (!/<(p|br|h[1-6]|ul|ol|li|blockquote)[^>]*>/i.test(content)) {
        content = content.split(/\n+/)
          .filter(p => p.trim().length > 0)
          .map(p => `<p>${p}</p>`)
          .join('\n');
      }
      
      // Check if it already has a philosophical insight
      if (!content.includes('Philosophical Insight:')) {
        const insight = insights[i % insights.length];
        content += `\n<hr style="margin: 2rem 0; opacity: 0.2;"/>\n${insight}`;
        
        await db.collection('news_items').updateOne(
          { _id: article._id },
          { $set: { content: content, updatedAt: new Date() } }
        );
        updated++;
      }
    }
    
    console.log(`Successfully fixed and updated ${updated} existing articles in the database!`);
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
