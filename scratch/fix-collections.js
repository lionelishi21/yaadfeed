const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://lionelishmael_db_user:QlyPp6dgKy9WyKCl@cluster0.peqgshw.mongodb.net/yardvybes?appName=Cluster0";

async function insertArticles() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    console.log('✅ Connected to database:', db.databaseName);
    
    const collection = db.collection('news_items');

    const articles = [
      {
        title: "Real Talk: Vybz Kartel – The Raw Reflection of Jamaican Society and True Artistry",
        slug: "vybz-kartel-reflection-jamaican-society-real-talk",
        summary: "A philosophical look into how Vybz Kartel's music serves as a mirror to Jamaican society, reflecting the raw truths of our environment and the power of unfiltered expression.",
        content: `<h2>The Essence of True Artistry</h2>
<p>When discussing true artistry in modern music, few names evoke as much passion, debate, and undeniable influence as Vybz Kartel. What many people fail to realize is that true artists are rare, and I commend the "World Boss" for undeniably being one. The truth about reality, and how we become who we are, is fundamentally tied to our environment. I am afraid we may never see another artist quite like Vybz Kartel.</p>

<h2>Dancehall as a Symptom of Society</h2>
<p>What many might overlook is that this subconscious, raw form of Dancehall and Reggae music is a direct symptom of Jamaican society. If properly harnessed with the right level of education and intention, this cultural expression can be immensely powerful. That is what makes Vybz Kartel so unique. If you truly want to understand the fabric of Jamaican society, you can listen to almost any of his songs. They offer a profound understanding of how we react and what we experience daily in Jamaica, particularly from the perspective of the so-called lower class.</p>

<h2>Art Without Filters</h2>
<p>He is a true artist who essentially became what he sang about—a reality that ultimately led to his time in prison. But the moral of his story isn't a simple tale of good or bad; it tells us that people are shaped by what their environment creates.</p>
<p>I remember seeing Vybz Kartel at the very beginning, going to school at Holy Trinity High School, where he was even the head boy. At that time, I despised his music. I simply didn't understand what art really was. However, as a philosophy student, I remember reading about art and realizing a profound truth: there is no right or wrong way when it comes to art. Art is simply art. Vybz Kartel was among the first to express the raw reality of our culture without the polite filters.</p>

<h2>Overcoming the Environment</h2>
<p>From that realization, my perspective shifted. I have listened to his work with a new understanding, and I am proud to see what he has accomplished musically. We live in a time where the tools are readily available to help us achieve anything we want in life. We must not let our environment stop us, whether we are artists, entrepreneurs, or in any other profession.</p>
<p>Let us unite and become more than what our surroundings dictate. Let's recognize the power of unfiltered expression, learn from the realities it exposes, and hope that we can use our voices and tools to transcend our circumstances and build a better future.</p>`,
        imageUrl: "/images/vybz-kartel-real-talk.png",
        category: "culture",
        source: "YaadFeed Real Talk",
        url: "https://yaadfeed.com/news/vybz-kartel-reflection-jamaican-society-real-talk",
        publishedAt: new Date(),
        author: "YaadFeed Editorial",
        tags: ["Real Talk", "Vybz Kartel", "Dancehall", "Jamaican Society", "Culture"],
        keywords: ["Vybz Kartel", "Real Talk", "Jamaican Society", "Dancehall Culture", "True Artistry", "Holy Trinity High School"],
        isPopular: true,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Vybz Kartel Indirectly Announces His Fiancée Is Pregnant — Fans Go Wild",
        slug: "vybz-kartel-fiancee-pregnant-announcement-2026",
        summary: "Dancehall icon Vybz Kartel has sent the internet into a frenzy after dropping indirect hints that his fiancée is expecting a baby. Here's everything we know about the World Boss's subtle but unmistakable announcement.",
        content: `<h2>The World Boss Drops the Biggest Hint Yet</h2>
<p>Dancehall king Vybz Kartel, known for his bold and unapologetic style, has done it again — but this time, it's not a new riddim that has the internet buzzing. The "World Boss" has indirectly announced that his fiancée is pregnant, and fans across Jamaica and the diaspora are absolutely ecstatic.</p>

<p>While Kartel didn't make a traditional announcement or post a direct statement, his recent social media activity and cryptic messages have left little room for doubt. Fans quickly connected the dots after a series of posts featuring baby-related emojis, references to "new life," and what appeared to be subtle nods to fatherhood once again.</p>

<h2>How Fans Decoded the Announcement</h2>
<p>It all started when eagle-eyed followers noticed a shift in Kartel's posts. The Dancehall legend, who has never been shy about expressing his personal life through his art, began sharing content that hinted at a growing family. From Instagram stories with baby shoes to lyrical references in recent voice notes shared with fans, the message was clear to those paying attention.</p>

<p>"Di World Boss a go be a daddy again! Blessings pon blessings!" one fan tweeted, which quickly went viral across Caribbean social media. Within hours, the topic was trending on X (formerly Twitter) in Jamaica, with thousands celebrating the news.</p>

<h2>A New Chapter After Freedom</h2>
<p>Since his release from prison, Vybz Kartel has been on an extraordinary journey of reinvention. From unveiling his mega mansion to re-establishing himself as the undisputed king of Dancehall, every move he makes commands attention. This latest personal milestone adds another layer to what has been a remarkable comeback story.</p>

<p>For Kartel, who has always been open about the importance of family in his life, this news represents more than just personal joy — it symbolizes the new chapter he has been building since regaining his freedom. The World Boss has spoken repeatedly about wanting to create a legacy beyond music, and expanding his family is a powerful statement of that intent.</p>

<h2>The Dancehall Community Reacts</h2>
<p>Fellow artists and industry figures have been quick to send their congratulations, even as the announcement remains "indirect." Several prominent Dancehall and Reggae artists took to social media to share well-wishes, with many praising Kartel for finding happiness and stability after years of adversity.</p>

<p>"Real G move in silence. Blessings to the World Boss and his queen," posted one well-known Dancehall selector, capturing the sentiment shared by many in the community.</p>

<h2>What This Means for Kartel's Music</h2>
<p>If history is any guide, fans can expect this life event to fuel some of Kartel's most personal and powerful music yet. The artist has always drawn from his real-life experiences to create songs that resonate deeply with his audience. From love anthems to street chronicles, Kartel's ability to translate his life into art is what makes him one of the greatest lyricists Dancehall has ever produced.</p>

<p>Whether this leads to a tender love song for his fiancée, a celebratory track about fatherhood, or something entirely unexpected, one thing is certain — the World Boss always delivers.</p>

<h2>Congratulations to the World Boss</h2>
<p>While we await an official confirmation, the signs are unmistakable. YaadFeed extends heartfelt congratulations to Vybz Kartel and his fiancée on this beautiful new chapter. In a world where Dancehall often dominates headlines for controversy, moments like these remind us that behind the music, these are real people living real lives — and new life is always worth celebrating.</p>

<p><em>Stay tuned to YaadFeed for updates on this developing story and all the latest from the world of Jamaican music and culture.</em></p>`,
        imageUrl: "/images/vybz-kartel-baby-announcement.png",
        category: "entertainment",
        source: "YaadFeed Exclusive",
        url: "https://yaadfeed.com/news/vybz-kartel-fiancee-pregnant-announcement-2026",
        publishedAt: new Date(),
        author: "YaadFeed Editorial",
        tags: ["Vybz Kartel", "Dancehall", "Entertainment", "Celebrity News", "Breaking News"],
        keywords: [
          "Vybz Kartel", "Vybz Kartel fiancée pregnant", "Vybz Kartel baby",
          "Vybz Kartel announcement", "Dancehall news", "Vybz Kartel 2026",
          "World Boss baby", "Jamaican celebrity news", "Vybz Kartel family"
        ],
        isPopular: true,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const article of articles) {
      const exists = await collection.findOne({ slug: article.slug });
      if (exists) {
        console.log(`⏭️ "${article.title}" already exists, updating...`);
        await collection.updateOne({ slug: article.slug }, { $set: { ...article, createdAt: exists.createdAt } });
        console.log(`✅ Updated`);
      } else {
        await collection.insertOne(article);
        console.log(`✅ Inserted "${article.title}"`);
      }
    }

    // Verify
    const total = await collection.countDocuments();
    const ourArticles = await collection.find({
      slug: { $in: [
        'vybz-kartel-reflection-jamaican-society-real-talk',
        'vybz-kartel-fiancee-pregnant-announcement-2026'
      ]}
    }).toArray();
    console.log(`\n✅ Verification: ${ourArticles.length} new articles in news_items`);
    ourArticles.forEach(a => console.log(`  - ${a.title}`));
    console.log(`📊 Total articles in news_items: ${total}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

insertArticles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
