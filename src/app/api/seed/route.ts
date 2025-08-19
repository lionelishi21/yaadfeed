import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Sample news data to seed the database
const sampleNewsData = [
  {
    title: "Bob Marley's Legacy Continues to Inspire New Generation of Jamaican Artists",
    slug: "bob-marleys-legacy-continues-to-inspire-new-generation-of-jamaican-artists",
    summary: "Recent surge in reggae music popularity among young artists showcases the enduring influence of the legendary musician.",
    content: "The timeless influence of Bob Marley continues to resonate through Jamaica's music scene as a new generation of artists draws inspiration from his revolutionary sound and message. Recent studies show a 40% increase in reggae-influenced tracks from emerging Jamaican musicians, with many citing Marley's social consciousness and musical innovation as primary influences.\n\nYoung artists like Koffee, Protoje, and Chronixx have been leading this revival, blending traditional reggae with modern elements while maintaining the spiritual and political messaging that made Marley's music so powerful. The impact extends beyond music, influencing fashion, lifestyle, and social activism among Jamaica's youth.\n\n'Bob Marley didn't just make music, he created a movement,' says music historian Dr. Carolyn Cooper. 'His message of unity, love, and resistance continues to speak to young people facing similar struggles today.'\n\nThe One Love Peace Concert, held annually in his honor, has become a platform for new artists to showcase their talents while honoring reggae's roots. This year's event featured over 20 emerging artists, demonstrating the vibrant future of Jamaican music culture.",
    category: "entertainment",
    image_url: "/images/bob-marley-legacy.jpg",
    published_at: "2025-06-25T10:00:00Z",
    author: "Maria Thompson",
    tags: ["bob-marley", "reggae", "music", "legacy", "jamaican-artists"],
    keywords: ["bob-marley", "reggae", "music", "legacy", "jamaican-artists"],
    is_popular: true,
    view_count: 1250,
    source: "jamaica-gleaner"
  },
  {
    title: "Jamaica's Tourism Industry Shows Strong Recovery Post-Pandemic",
    slug: "jamaicas-tourism-industry-shows-strong-recovery-post-pandemic",
    summary: "New statistics reveal tourist arrivals have exceeded pre-2019 levels, with significant growth in cultural tourism.",
    content: "Jamaica's tourism sector has demonstrated remarkable resilience and growth, with recent data from the Jamaica Tourist Board showing visitor arrivals have surpassed pre-pandemic levels by 15%. The island welcomed over 4.3 million visitors in the first half of 2025, marking a significant milestone in the industry's recovery.\n\nCultural tourism has emerged as a key driver of this growth, with visitors increasingly interested in authentic Jamaican experiences beyond traditional beach holidays. Music tours, culinary experiences, and historical site visits have seen substantial increases in popularity.\n\n'Tourists are seeking deeper connections with our culture,' explains Tourism Minister Edmund Bartlett. 'They want to understand our music, taste our food, and learn our history. This shift towards experiential tourism is creating new opportunities for local communities.'\n\nThe growth has been particularly beneficial for rural communities, with homestays and cultural experiences providing alternative income sources. Popular attractions include the Bob Marley Museum in Kingston, Blue Mountain coffee plantations, and reggae music heritage sites.\n\nHotel occupancy rates have reached 85%, the highest in five years, while new resort developments are planned for the next two years to accommodate growing demand.",
    category: "business",
    image_url: "/images/jamaica-tourism.jpg",
    published_at: "2025-06-25T08:30:00Z",
    author: "James Wilson",
    tags: ["tourism", "economy", "recovery", "cultural-tourism", "statistics"],
    keywords: ["tourism", "economy", "recovery", "cultural-tourism", "statistics"],
    is_popular: false,
    view_count: 823,
    source: "jamaica-observer"
  },
  {
    title: "Reggae Sumfest 2025 Lineup Announced: Featuring International and Local Stars",
    slug: "reggae-sumfest-2025-lineup-announced-featuring-international-and-local-stars",
    summary: "This year's festival promises to be the biggest yet, with headliners from Jamaica and around the world.",
    content: "Reggae Sumfest 2025 has unveiled its star-studded lineup, featuring a perfect blend of international superstars and rising Jamaican talent. The festival, set to take place in Montego Bay from July 15-21, will host over 50 artists across multiple stages.\n\nHeadlining acts include Grammy-winning artists Damian Marley, Shaggy, and Sean Paul, alongside international collaborators like Rihanna and Major Lazer. The festival also prominently features emerging Jamaican artists including Koffee, Popcaan, and Skillibeng, showcasing the evolution of reggae and dancehall music.\n\n'Sumfest has always been about celebrating the global reach of Jamaican music while nurturing homegrown talent,' says festival director Joe Bogdanovich. 'This year's lineup perfectly captures that spirit.'\n\nNew additions to the festival include a dedicated stage for acoustic performances, allowing artists to showcase stripped-down versions of their hits, and a cultural village featuring traditional Jamaican crafts, food, and storytelling.\n\nTicket sales have already exceeded expectations, with early bird packages selling out within 48 hours. The festival expects to attract over 100,000 visitors, making it one of the largest music events in the Caribbean.",
    category: "entertainment",
    image_url: "/images/reggae-sumfest.jpg",
    published_at: "2025-06-24T16:45:00Z",
    author: "Sarah Johnson",
    tags: ["reggae-sumfest", "music-festival", "reggae", "dancehall", "montego-bay"],
    keywords: ["reggae-sumfest", "music-festival", "reggae", "dancehall", "montego-bay"],
    is_popular: true,
    view_count: 2156,
    source: "jamaica-star"
  },
  {
    title: "Kingston's Tech Hub Expansion Creates 500 New Jobs",
    slug: "kingstons-tech-hub-expansion-creates-500-new-jobs",
    summary: "Major technology companies establish operations in Jamaica, bringing high-skilled employment opportunities.",
    content: "Kingston's growing reputation as a Caribbean technology hub has received a significant boost with the announcement of several major tech companies establishing operations in the capital city. The expansion is expected to create over 500 high-skilled jobs within the next 18 months, representing a major milestone for Jamaica's digital economy.\n\nLeading the charge is TechFlow Jamaica, a subsidiary of a major US software company, which will establish a development center focusing on fintech solutions for the Caribbean market. The company plans to hire 200 software engineers, data analysts, and project managers, with salaries competitive with international standards.\n\nAdditionally, three smaller startups specializing in e-commerce, digital marketing, and mobile app development have announced their intention to scale operations significantly. These companies are taking advantage of Jamaica's growing pool of tech talent and competitive operational costs.\n\n'Jamaica has all the ingredients for a thriving tech sector,' says Minister of Science, Energy and Technology, Daryl Vaz. 'We have talented graduates, improving digital infrastructure, and a strategic location that serves as a gateway to both North and South American markets.'",
    category: "business",
    image_url: "/images/kingston-tech-hub.jpg",
    published_at: "2025-06-23T09:45:00Z",
    author: "Kevin Richards",
    tags: ["technology", "jobs", "kingston", "tech-hub", "digital-economy"],
    keywords: ["technology", "jobs", "kingston", "tech-hub", "digital-economy"],
    is_popular: true,
    view_count: 1423,
    source: "jamaica-gleaner"
  }
];

export async function POST(request: NextRequest) {
  try {
    // Add basic authentication to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const expectedAuth = process.env.SEED_API_KEY || 'development-seed-key';
    
    if (authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();

    // Clear existing news items (optional - remove this line if you want to keep existing data)
    // await supabase.from('news_items').delete().neq('id', '');

    // Insert sample news data
    const { data, error } = await supabase
      .from('news_items')
      .insert(sampleNewsData)
      .select();

    if (error) {
      console.error('Error seeding database:', error);
      return NextResponse.json({ error: 'Failed to seed database', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      insertedCount: data?.length || 0,
      articles: data
    });

  } catch (error) {
    console.error('Seed API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 