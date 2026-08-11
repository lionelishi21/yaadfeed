const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: '.env' });
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'yardvybes';

const articles = [
  {
    slug: 'global-rise-afro-dancehall-fusion',
    content: `
      <p>The musical landscape is shifting rapidly, and at the epicenter of this global tremor is a new, unmistakable sound: Afro-Dancehall fusion. Over the past few years, the line between traditional Jamaican Dancehall and the explosive, rhythmic complexities of West African Afrobeats has increasingly blurred. What began as a series of experimental cross-cultural collaborations has now evolved into some of the biggest chart-topping hits of the decade, reshaping the very fabric of global pop music.</p>
      
      <h3>The Historical Roots of a Shared Connection</h3>
      <p>While this explosive collaboration might seem like a sudden phenomenon to mainstream pop audiences, the roots of this rhythmic connection run incredibly deep. The transatlantic exchange of musical ideas is not a new concept; rather, it is a continuation of a historical dialogue. Afrobeats artists—hailing predominantly from Nigeria and Ghana—have long cited Jamaican reggae and dancehall legends as foundational influences. Icons like Bob Marley, Buju Banton, and Vybz Kartel have historically dominated the airwaves in West Africa, deeply embedding the Caribbean sonic aesthetic into the minds of young African producers.</p>
      <p>Conversely, Jamaican music itself was born from the drum patterns, syncopations, and vocal stylings carried over from the African continent centuries ago. In many ways, the modern Afro-Dancehall fusion is less of a new invention and more of a homecoming. Now, artists from Kingston to Lagos are realizing that their shared sonic ancestry creates absolute magic when combined in the modern studio environment.</p>
      
      <blockquote>
        "When we link up in the studio, it's never two different cultures trying to awkwardly figure each other out. It's literally family reuniting. The drum patterns talk to each other intuitively. We don't even need to discuss the tempo; the vibe just sets itself instantly." — Legendary Jamaican Dancehall Producer
      </blockquote>

      <h3>Chart Domination and Streaming Success</h3>
      <p>The commercial impact of this genre-blending cannot be overstated. From massive global remixes—think of Burna Boy collaborating with Popcaan, or Wizkid teaming up with Damian Marley—to entirely original cross-continental projects, this fusion has proven to be a commercial juggernaut. Streaming numbers across platforms like Spotify and Apple Music have skyrocketed as fans from the Caribbean diaspora, the African continent, and the broader global market embrace the unified sound.</p>
      <p>The tempo, the infectious energy, and the lyrical delivery blend so perfectly that it creates a genre capable of dominating clubs from London to New York to Tokyo. It is a sound that feels simultaneously deeply rooted in cultural tradition and entirely futuristic. The heavy basslines of dancehall provide a grounding force for the intricate, rapid-fire percussion of Afrobeats, creating a groove that is impossible to ignore.</p>
      
      <h3>Cultural Impact Beyond the Music</h3>
      <p>Beyond the charts and streaming revenues, the Afro-Dancehall movement is fostering a deeper cultural connection between the Caribbean and Africa. Music videos are frequently shot in both Kingston and Lagos, showcasing shared cultural aesthetics, fashion, and dance styles. Choreographers are blending classic dancehall moves with the latest Afrobeats steps, creating viral TikTok trends that further propel the music into the global mainstream.</p>
      <p>This cross-pollination is also opening up massive new touring markets. Jamaican artists who previously focused on North American and European tours are now headlining sold-out stadium shows in West Africa, while Afrobeats superstars are receiving hero's welcomes in the Caribbean.</p>
      
      <h3>The Future of the Diaspora's Sound</h3>
      <p>As we look to the future, the Afro-Dancehall movement shows absolutely no signs of slowing down. Major international record labels are actively seeking out these cross-continental collaborations, setting up writing camps in both Jamaica and Nigeria to manufacture the next big global hit. Producers are experimenting with incorporating elements of other regional sounds, such as South African Amapiano and Latin Reggaeton, into the mix.</p>
      <p>Ultimately, this movement is a testament to the power of the diaspora. By blending their unique yet deeply connected musical heritages, artists from the Caribbean and Africa are ensuring that the rhythm of their ancestors will continue to rule the global airwaves for generations to come. The Afro-Dancehall fusion is not just a passing trend; it is the new standard of international pop music.</p>
    `
  },
  {
    slug: 'reggae-boyz-world-cup-qualifiers',
    content: `
      <p>The anticipation is palpable across the island, hanging thick in the tropical air as the Jamaica National Football Team—affectionately and globally known as the Reggae Boyz—gears up for what many football analysts consider their most important and promising World Cup qualifying campaign since their historic, unforgettable run to France in 1998. With a revitalized squad, a completely overhauled tactical philosophy, and a nation's hopes resting on their shoulders, the Reggae Boyz are ready to make a massive statement on the global stage.</p>
      
      <h3>A New Tactical Era Under Visionary Management</h3>
      <p>For years, Jamaican football was characterized by a specific style: immense physical strength, blazing speed on the counter-attack, and a reliance on individual brilliance. While entertaining, this approach often fell short against highly organized, tactically astute international opponents. However, under new and visionary management, the Reggae Boyz have completely overhauled their tactical approach.</p>
      <p>Moving away from the traditional kick-and-rush style, the team is now deeply embracing a modern, possession-based, high-pressing game. This monumental shift has required intense, grueling training camps and a newfound discipline on the pitch. The coaching staff has prioritized technical ability, emphasizing quick passing triangles, spatial awareness, and maintaining shape defensively. The results in recent friendlies have been stark: a team that not only runs hard but thinks two steps ahead of the opposition.</p>
      
      <h3>Strategic Recruitment: Tapping the Diaspora</h3>
      <p>A crucial and often debated element of this modern campaign has been the strategic recruitment of diaspora players. By aggressively tapping into deep talent pools primarily in the English Premier League, the English Championship, and the American MLS, the Jamaican Football Federation (JFF) has assembled a squad that boasts an incredible hybrid of local grit and top-tier European experience.</p>
      
      <ul>
        <li><strong>Enhanced Midfield Dominance:</strong> The addition of seasoned, technically gifted playmakers who learned their trade in European academies has stabilized the center of the pitch, allowing Jamaica to dictate the tempo of matches rather than just reacting to them.</li>
        <li><strong>Lethal Attack:</strong> A potent mix of young, pacey local wingers and clinical, experienced strikers promises significantly more goals. The attacking third is now characterized by fluid movement and ruthless finishing.</li>
        <li><strong>Defensive Solidity:</strong> A completely reorganized backline, featuring towering center-backs with top-flight experience, has proven incredibly hard to break down. Clean sheets are becoming an expectation rather than a hopeful outcome.</li>
      </ul>

      <blockquote>
        "We are no longer just relying on raw athleticism. The current squad has the tactical intelligence to go toe-to-toe with the best teams in CONCACAF. We are building a system, not just throwing eleven fast players on a field. The diaspora players bring invaluable experience, but the locally-based talent brings the heart. Together, it's a terrifying combination." — Jamaican Football Analyst
      </blockquote>

      <h3>The Cultural Impact of a Winning Team</h3>
      <p>The impact of a successful Reggae Boyz run extends far beyond the football pitch; it is a unifying force for the entire nation. During major qualifiers, the streets of Kingston, Montego Bay, and every parish in between become a sea of green, black, and gold. The national pride generated by the team's success provides a tangible economic and social boost, inspiring young athletes across the island to pursue their dreams with renewed vigor.</p>
      <p>The JFF and local sponsors have recognized this, investing heavily in grassroots programs to ensure that the current success is not a fleeting moment, but the foundation of a sustainable footballing powerhouse in the Caribbean.</p>

      <h3>The Arduous Journey Ahead</h3>
      <p>Despite the immense optimism, the journey ahead is undeniably arduous. The CONCACAF qualifying region is notoriously unforgiving, featuring tough, physical matches against regional giants like Mexico and the United States, as well as grueling away fixtures in hostile environments across Central America.</p>
      <p>However, if their recent form, tactical discipline, and squad depth are any indicators, the Reggae Boyz are more prepared than ever. They are ready to battle through the adversity, make history once again, and bring their unique Caribbean flair back to the world's biggest and most prestigious sporting stage. The road to the World Cup starts now, and Jamaica is watching.</p>
    `
  },
  {
    slug: 'kingston-tech-renaissance',
    content: `
      <p>Often celebrated globally for its unparalleled cultural exports—from reggae music to world-dominating sprinters—Kingston, Jamaica, is rapidly gaining a new, entirely different reputation: the undisputed tech capital of the Caribbean. A massive surge of digital entrepreneurship, fueled by brilliant young innovators, returning diaspora talent, and newly supportive government policies, is fundamentally transforming the city's economic landscape and pointing toward a highly lucrative digital future.</p>
      
      <h3>The Co-Working Boom and Startup Culture</h3>
      <p>Walk into any of Kingston's sleek, newly minted co-working spaces, and you will find a vibrant scene deeply reminiscent of Silicon Valley, albeit with significantly better weather, stunning tropical views, and a faint reggae soundtrack humming in the background. Young developers, UI/UX designers, and ambitious founders are huddled around laptops, aggressively collaborating on digital solutions intended for both the local and global markets.</p>
      <p>The diversity of these startups is staggering. There are cutting-edge fintech applications designed specifically to provide seamless banking and payment solutions for the Caribbean's unbanked populations. There are innovative agri-tech platforms utilizing drone technology and AI to optimize local farming yields, combating food insecurity. There are ed-tech platforms striving to democratize access to high-quality education across the island.</p>
      
      <blockquote>
        "For a long time, the narrative was that to be successful in tech, you had to leave Jamaica and go to the US or Canada. That brain drain hurt us. But now? We have the talent right here, we have the drive, and we finally have the ecosystem to support it. Kingston is proving that world-class, disruptive technology doesn't only come out of California. It comes from where the hunger is." — Kingston Tech Startup Founder
      </blockquote>

      <h3>Government Initiatives and Private Investment</h3>
      <p>This technological renaissance isn't happening in a vacuum. It is the result of a concerted effort by both the Jamaican government and increasingly savvy private angel investors who have recognized the limitless potential of the tech sector. The government has rolled out massive initiatives to improve broadband infrastructure, ensuring reliable, high-speed internet access is viewed as a fundamental utility rather than a luxury.</p>
      <p>Furthermore, new incubator programs and significant tax incentives for digital startups have laid the critical groundwork for this rapid, sustained growth. Local universities are revamping their computer science curriculums to focus on modern programming languages and agile development methodologies, ensuring a steady pipeline of highly skilled graduates ready to enter the workforce.</p>
      
      <h3>Overcoming Traditional Barriers</h3>
      <p>The journey has not been without its hurdles. Historically, securing venture capital funding in the Caribbean has been notoriously difficult, with traditional banks hesitant to lend to software companies lacking physical collateral. However, this is changing rapidly. International venture capitalists, particularly those with ties to the Caribbean diaspora, are beginning to establish funds specifically earmarked for Jamaican and Caribbean startups.</p>
      <p>These investors realize that Kingston offers a unique proposition: a highly educated, English-speaking workforce operating in a timezone identical to the US East Coast, but with significantly lower operational costs than tech hubs in North America.</p>
      
      <h3>The Future is Digital</h3>
      <p>As these local startups scale, acquire users, and begin to attract serious international venture capital, Kingston is poised to become a definitive blueprint for how emerging, developing economies can leverage digital technology to effectively leapfrog traditional industrial development barriers.</p>
      <p>The tech renaissance is not just about creating cool apps; it is about economic sovereignty, job creation, and positioning Jamaica as a formidable player in the 21st-century global digital economy. The future of the Jamaican economy is increasingly, and undeniably, digital.</p>
    `
  },
  {
    slug: 'evolution-of-sound-clashes',
    content: `
      <p>The Sound Clash is the undisputed beating heart of Jamaican music culture, an intense, visceral musical battleground where reputations are forged in fire and destroyed in seconds. What began decades ago as humble neighborhood sound systems battling for local supremacy on the dusty streets of Kingston has spectacularly evolved into a massive global phenomenon. Today, these events fill massive international arenas, drawing thousands of fanatic attendees and millions of online viewers, armed with deafening bass, theatrical insults, and electrifying musical tension.</p>
      
      <h3>The Enduring Art of the Dubplate</h3>
      <p>At the absolute core of the clash ecosystem is the 'dubplate'—an exclusive, highly customized recording where famous artists literally shout out the specific sound system playing the track, often simultaneously disrespecting their opponents. The dubplate is the ultimate weapon in a sound clash; it proves a sound system's influence, wealth, and musical connections.</p>
      <p>In the golden era of the 80s and 90s, securing a dubplate meant physically tracking down notoriously elusive reggae and dancehall artists in smoky Kingston recording studios, negotiating cash fees on the spot, and cutting the track directly to a heavy vinyl acetate disc. It was a localized, highly secretive process. Today, however, the dubplate economy is entirely digital, undeniably global, and incredibly lucrative. A top-tier sound system in Japan or Germany can easily commission a custom dubplate from a Jamaican superstar via email and receive the high-quality digital audio file within hours.</p>
      
      <h3>The Rules of Engagement</h3>
      <p>Despite the massive technological shifts, the fundamental rules of engagement remain fiercely traditional. Selectors (the DJs) and MCs (the hypemen/orators) go round for round in a structured format, playing their rarest, most expensive, and most impactful dubplates. The objective is to 'kill' the opposing sound.</p>
      <p>The winner is not decided by a panel of judges, but purely by crowd response—measured in roars, air horns, and the banging of stadium seats. This makes the sound clash one of the most brutally democratic, unpredictable, and visceral forms of musical competition on the planet. A sound system can spend tens of thousands of dollars on exclusive music, but if the MC fails to connect with the crowd's energy, they will be mercilessly booed off the stage.</p>
      
      <h3>From Street Corners to Global Spectacles</h3>
      <p>Modern sound clashes are highly produced, multi-million dollar spectacles. The humble stacks of wooden speaker boxes have been replaced by or supplemented with giant LED screens, dramatic laser lighting rigs, and massive, state-of-the-art line array audio systems capable of physically shaking the building.</p>
      
      <ul>
        <li><strong>Technological Advancements:</strong> Digital controllers and high-end audio processing software have radically changed how selectors mix, allowing for seamless transitions, live remixing, and instant access to libraries of tens of thousands of songs.</li>
        <li><strong>Global Reach:</strong> High-definition livestreams bring the intense clash experience to millions of die-hard fans worldwide, creating a global community that debates the outcomes fiercely on social media for weeks after the event.</li>
        <li><strong>Cultural Preservation:</strong> Despite the modern, commercial gloss and international competitors, the clash remains a vital, uncompromising preserver of authentic reggae and dancehall history. To win a clash, you must know the foundation music deeply.</li>
      </ul>

      <blockquote>
        "A clash isn't just a party; it's a war. It's chess played with music. You have to read the crowd, anticipate your opponent's next move, and know exactly when to drop that one legendary dubplate that will tear the roof off the arena. The technology has changed, but the spirit of the war is exactly the same as it was in the 1980s." — Veteran Sound System Selector
      </blockquote>

      <h3>The Undying Legacy</h3>
      <p>The spectacular evolution of the sound clash proves that true, potent cultural artifacts do not simply disappear when faced with modernization; they adapt, mutate, and conquer entirely new stages. As international sound leagues continue to grow, pitting sounds from Tokyo, Berlin, and New York against Jamaican veterans, the clash ensures that the uncompromising foundation of Jamaican music continues to aggressively shake the world.</p>
    `
  }
];

async function updateArticles() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB);
    const collection = db.collection('news_items');

    for (const article of articles) {
      console.log(\`Updating article: \${article.slug}\`);
      
      const result = await collection.updateOne(
        { slug: article.slug },
        { $set: { content: article.content, updatedAt: new Date() } }
      );
      
      if (result.matchedCount > 0) {
        console.log(\`Successfully updated: \${article.slug} (\${result.modifiedCount} modified)\`);
      } else {
        console.log(\`Warning: Article not found: \${article.slug}\`);
      }
    }
    
    console.log('All articles successfully expanded!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

updateArticles();
