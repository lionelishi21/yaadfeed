// Articles for 1 October 2026.
// Every figure below comes from the linked sources. No quotes are invented:
// where officials are cited, their remarks are paraphrased and attributed.

const sources = (items) =>
  `<h3>Sources</h3><ul>${items
    .map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></li>`)
    .join('')}</ul>`;

module.exports = [
  {
    title: 'BOJ Raises Policy Rate to 6% as Inflation Climbs to 7.9%: What It Means for Your Loans and Savings',
    slug: 'boj-raises-policy-rate-6-percent-inflation-september-2026',
    cover: 'boj-policy-rate-6-percent.jpg',
    category: 'business',
    tags: ['Bank of Jamaica', 'Interest Rates', 'Inflation', 'Economy', 'Cost of Living'],
    keywords: ['BOJ policy rate', 'Jamaica inflation', 'interest rates Jamaica', 'Bank of Jamaica', 'cost of living'],
    summary:
      'The Bank of Jamaica has lifted its policy rate by 50 basis points to 6.0%, effective 29 September, after headline inflation rose to 7.9% in August. Here is why it happened and what borrowers and savers should expect.',
    content: `<p>The Bank of Jamaica (BOJ) has raised its policy interest rate by 50 basis points to 6.0 per cent, the central bank's clearest signal yet that it is worried about how quickly prices are rising. The increase took effect on Tuesday, 29 September 2026, after the Monetary Policy Committee (MPC) met on 24 and 25 September and voted unanimously for the move.</p>
<p>For most Jamaicans the policy rate is an abstract number. Its effects are not. It is the rate the BOJ pays commercial banks on overnight deposits, and it sets the floor for what banks charge on loans and pay on savings. When it rises, borrowing gradually becomes more expensive across the economy.</p>
<h3>Why the BOJ moved now</h3>
<p>The trigger is inflation. Data from the Statistical Institute of Jamaica show headline inflation reached 7.9 per cent in August 2026, up from 7.5 per cent in July. That is well outside the BOJ's 4 to 6 per cent target range. Core inflation, which strips out the most volatile food and fuel prices, held at 5.2 per cent.</p>
<p>In its summary of the decision, the MPC pointed to pressures at home and abroad:</p>
<ul>
<li><strong>Global tensions.</strong> Escalating conflict in the Middle East and the continuing Russia-Ukraine war have kept commodity prices elevated.</li>
<li><strong>El Niño.</strong> Intensified dry conditions have cut crop yields and are expected to keep agricultural prices high for longer than first projected.</li>
<li><strong>Tighter global financial conditions</strong>, arriving faster than the bank had forecast.</li>
<li><strong>Second-round effects.</strong> Higher farm-gate and import costs are now showing up in processed food and services.</li>
<li><strong>Expectations.</strong> Businesses surveyed in July expected inflation of 7.3 per cent, up from 6.7 per cent in June.</li>
</ul>
<p>That last point matters most to a central bank. Once firms and workers assume prices will keep rising, they set prices and wage demands accordingly, and a temporary shock becomes a lasting one. The BOJ said the increase is meant to stop that from happening.</p>
<p>The committee had held the rate steady in August. The bank has defended that call, saying it was appropriate given the conditions and risks assessed at the time, which have since worsened.</p>
<h3>What it means for borrowers</h3>
<p>The policy rate does not change your loan overnight, but it does change the direction of travel.</p>
<ul>
<li><strong>Variable-rate loans</strong> are the most exposed. If your mortgage, car loan or business line of credit carries a floating rate, check the terms and ask your lender whether an adjustment is planned.</li>
<li><strong>New loans</strong> are likely to be priced higher in the coming months. If you are about to borrow, compare offers and ask how long a quoted rate is locked in.</li>
<li><strong>Fixed-rate loans</strong> are unaffected until the fixed period ends.</li>
<li><strong>Credit cards and micro-loans</strong> already carry rates far above the policy rate. Paying down this debt first remains the best return available to most households.</li>
</ul>
<p>Private-sector credit was still growing at 7.9 per cent in July, according to the BOJ. Slowing that growth is part of how a rate increase cools demand.</p>
<h3>What it means for savers</h3>
<p>Savers stand to gain slowly. Deposit rates tend to follow the policy rate with a lag, and banks typically pass on increases to borrowers faster than to depositors. With inflation at 7.9 per cent, money in an ordinary savings account is still losing purchasing power. It is worth comparing fixed deposits and other instruments rather than waiting for your current account rate to move.</p>
<h3>The dollar and the wider economy</h3>
<p>The BOJ described Jamaica's international reserves as healthy and a strong buffer, and said it expects the exchange rate to remain relatively stable. The US dollar closed at J$159.87 on Wednesday, 30 September, up seven cents on the day, according to the bank's published rates.</p>
<p>The harder question is growth. The increase comes while the economy is already weak. Preliminary estimates from the Planning Institute of Jamaica show output shrank 2.9 per cent in the April to June quarter, with agriculture, forestry and fishing down 15.3 per cent as the island continues to absorb the effects of Hurricane Melissa and the drought. Raising rates in a contracting economy is uncomfortable, and the BOJ acknowledged that growth remains vulnerable in the 2026/27 fiscal year because of agricultural shocks and limits on tourism capacity. It expects activity to strengthen in 2027/28.</p>
<h3>What to watch next</h3>
<p>The bank's own forecast is that inflation will rise further before returning to the target range by mid-2027. That means this may not be the last increase. Three things will shape the next decision: the monthly inflation figures, whether rain eases the pressure on food prices, and what happens to oil and shipping costs abroad.</p>
<p>For households, the practical message is to plan for higher borrowing costs to last into next year, and to treat any variable-rate debt as the first thing to review.</p>
${sources([
      ['Bank of Jamaica: Summary of Decisions, September 2026', 'https://boj.org.jm/summary-of-decisions-september-2026/'],
      ['Jamaica Observer: BOJ increases policy rate to 6% to contain inflation', 'https://www.jamaicaobserver.com/2026/09/29/boj-increases-policy-rate-6-contain-inflation/'],
      ['The Rio Times: Jamaica economy shrinks 2.9% in April-June 2026', 'https://www.riotimesonline.com/jamaica-economy-contracts-29-percent-second-quarter-2026'],
    ])}`,
  },

  {
    title: 'Drought Hits 107 Water Systems as Mona Reservoir Falls to 33.7%: What You Need to Know',
    slug: 'jamaica-drought-107-water-systems-mona-reservoir-october-2026',
    cover: 'jamaica-drought-107-water-systems.jpg',
    category: 'environment',
    tags: ['Drought', 'NWC', 'Water', 'El Niño', 'Kingston'],
    keywords: ['Jamaica drought', 'NWC water restrictions', 'Mona Reservoir level', 'Hermitage Dam', 'El Niño Jamaica'],
    summary:
      'The National Water Commission says 107 of the 150 water systems it is monitoring are now affected by drought, with Mona Reservoir at 33.7% and Hermitage Dam at 40.2%. Tougher restrictions are expected.',
    content: `<p>Jamaica's drought is no longer confined to the Corporate Area. The National Water Commission (NWC) says 107 of the 150 water systems it is monitoring across the island are now affected by dry conditions, and the minister responsible for water has warned that tougher restrictions are on the way.</p>
<p>The figures were reported by <em>The Gleaner</em> on Thursday, 1 October, citing Dr Phillippa Campbell-Francis, the NWC's acting vice-president of operations. She said the affected systems are at varying stages, with some facilities down to zero per cent of capacity and others at about 40 per cent.</p>
<h3>Where the reservoirs stand</h3>
<p>The two facilities that supply most of Kingston and St Andrew are both well under half full:</p>
<ul>
<li><strong>Mona Reservoir:</strong> 33.7 per cent of capacity</li>
<li><strong>Hermitage Dam:</strong> 40.2 per cent of capacity. Hermitage supplies more than 40 per cent of the Kingston Metropolitan Area and St Andrew.</li>
</ul>
<p>The speed of the decline at Mona is the worrying part. On 10 August the reservoir was reported at 54.5 per cent. By 16 September it had fallen to 35.9 per cent, and it has since slipped to 33.7 per cent. That is a drop of more than 20 percentage points in under two months. Hermitage has held steadier, moving from 40.7 per cent to 40.2 per cent over the same period.</p>
<p>Beyond the Corporate Area, the NWC named St Thomas and the parishes of the north-east among the hardest hit.</p>
<h3>The restrictions already in place</h3>
<p>If you are an NWC customer, these rules already apply:</p>
<ul>
<li><strong>Prohibition orders</strong> have been in force since 17 August in seven parishes: Kingston, St Andrew, St Thomas, St Mary, Portland, St Ann and St Catherine. They ban the use of NWC-supplied water for non-essential purposes such as watering lawns, washing vehicles and filling or refilling pools.</li>
<li><strong>Scheduled supply</strong> for customers on the Mona system began on 17 September, with water provided between 6:00 a.m. and 4:00 p.m. daily.</li>
</ul>
<p>Water Minister Matthew Samuda has said stricter measures will follow in the coming weeks. He has also said, according to <em>The Gleaner</em>, that the current El Niño is set to produce the worst drought Jamaica has experienced.</p>
<h3>Why it is this bad</h3>
<p>El Niño is a periodic warming of the Pacific Ocean that shifts weather patterns worldwide. In the Caribbean it suppresses the rising air and thunderstorms that normally bring rain. This year's event has strengthened during what should be the wetter part of Jamaica's year.</p>
<p>There is also a problem that has nothing to do with the weather. Roughly 70 per cent of the water the NWC produces is classed as non-revenue water, meaning it is lost to leaks, theft or metering failures before it earns anything. The target is 30 per cent. The programme to get there is planned to run for 11 years: one year of audit, five years of works and five years of maintenance. In a drought, every litre lost from an old pipe is a litre that never reaches a home.</p>
<h3>The knock-on effects</h3>
<p>The drought is reaching well beyond household taps. Agriculture, forestry and fishing output fell 15.3 per cent in the April to June quarter, according to preliminary Planning Institute of Jamaica estimates, with the drought named alongside Hurricane Melissa as a cause. Lower crop yields are feeding into food prices, and the Bank of Jamaica cited El Niño conditions among the reasons it raised its policy rate to 6.0 per cent this week.</p>
<h3>How to stretch your supply</h3>
<p>With scheduled supply likely to widen, a few habits make a real difference:</p>
<ul>
<li><strong>Store safely.</strong> Fill covered, clean containers during supply hours. Keep drinking water separate, and keep containers sealed to stop mosquitoes breeding.</li>
<li><strong>Fix leaks now.</strong> A dripping tap or running toilet cistern wastes water around the clock. Check your meter with every tap off. If it is still turning, you have a leak.</li>
<li><strong>Reuse where you can.</strong> Water from rinsing vegetables or laundry can flush toilets or go on plants.</li>
<li><strong>Shorten showers</strong> and turn off the tap while soaping, shaving or brushing teeth.</li>
<li><strong>Report leaks and broken mains</strong> to the NWC rather than assuming someone else has.</li>
<li><strong>Follow the prohibition orders.</strong> Washing a car with a hose or topping up a pool with NWC water is prohibited in the seven listed parishes.</li>
</ul>
<h3>What happens next</h3>
<p>Officials had earlier expected dry conditions to last into September or October. With reservoir levels still falling at the start of October, the next few weeks of rainfall will decide whether the restrictions ease or tighten. We will update this story as the NWC announces new measures.</p>
${sources([
      ['The Gleaner: Drought drains 107 water systems', 'https://jamaica-gleaner.com/article/news/20261001/drought-drains-107-water-systems'],
      ['The Gleaner: Samuda warns of tougher water restrictions in coming weeks', 'https://jamaica-gleaner.com/article/news/20260930/samuda-warns-tougher-water-restrictions-coming-weeks-amid-ongoing-drought'],
      ['Jamaica Observer: Water restrictions tighten as Mona Reservoir falls to 35.9%', 'https://www.jamaicaobserver.com/2026/09/17/water-restrictions-tighten-nwc-customers-mona-reservoir-falls-35-9/'],
      ['Jamaica Observer: Gov’t to issue water prohibition orders amid worsening drought', 'https://www.jamaicaobserver.com/2026/08/10/govt-issue-water-prohibition-orders-amid-worsening-drought/'],
    ])}`,
  },

  {
    title: 'Reggae Boyz Open Nations League With Late Drama and a Home Defeat: Three Points From Two Games',
    slug: 'reggae-boyz-nations-league-guatemala-honduras-september-2026',
    cover: 'reggae-boyz-nations-league-guatemala-honduras.jpg',
    category: 'sports',
    tags: ['Reggae Boyz', 'Football', 'Concacaf Nations League', 'Renaldo Cephas', 'National Stadium'],
    keywords: ['Reggae Boyz', 'Jamaica vs Honduras', 'Jamaica vs Guatemala', 'Concacaf Nations League', 'Rudolph Speid'],
    summary:
      'Jamaica beat Guatemala 3-2 with a stoppage-time Renaldo Cephas winner, then lost 1-0 to ten-man Honduras four days later. Here is how both games unfolded at the National Stadium.',
    content: `<p>Two home games in five days gave Reggae Boyz supporters both ends of the experience. Jamaica opened their 2026-27 Concacaf Nations League campaign with a stoppage-time 3-2 win over Guatemala on Friday, 25 September, then lost 1-0 to Honduras on Tuesday, 29 September. Both matches were played at the National Stadium in Kingston.</p>
<p>Three points from six leaves coach Rudolph Speid's side in contention in League A, Group B, but with less margin for error than they would have wanted from two games on home soil.</p>
<h3>Jamaica 3-2 Guatemala: Cephas at the death</h3>
<p>The opener started badly. Guatemala scored inside two minutes when Óscar Santis finished low after a counter-attack, and Darwin Lom went close to a second in the 18th minute.</p>
<p>Jamaica found their way back late in the first half. Kasey Palmer pounced on an error by Jorge Aparicio and slid a low shot under goalkeeper Kenderson Navarro to level. Palmer then turned provider in the 53rd minute, playing in Rumarn Burrell, who beat the goalkeeper to the far corner to put Jamaica 2-1 ahead.</p>
<p>The lead lasted 14 minutes. Santis rounded Andre Blake and rolled the ball into an empty net for his second of the night, and the game tilted again. Substitute Renaldo Cephas shot wide in the 79th minute, and Guatemala's Olger Escobar struck the inside of the post in the 90th.</p>
<p>Then, four minutes into stoppage time, Cephas got another chance and took it, giving Jamaica a 3-2 win they had led, lost and reclaimed.</p>
<p>Jamaica started with captain Andre Blake in goal, along with Joel Latibeaudiere, Damion Lowe, Richard King, Isaac Hayden, Karoy Anderson, Palmer, Ronaldo Webster, Tyreece Campbell, Burrell and Javon East.</p>
<h3>Jamaica 0-1 Honduras: an early goal and a long night</h3>
<p>Speid had warned beforehand that Honduras would be the harder test. They had lost 3-2 to Suriname in their own opener and arrived needing a result.</p>
<p>Jamaica's night began to unravel almost immediately. Cephas, promoted to the starting line-up after his winner, went off injured in the eighth minute and was replaced by Campbell. Six minutes later Keyrol Figueroa scored from close range from a Jonathan Toro assist, and that proved to be the only goal.</p>
<p>The game grew scrappy. Latibeaudiere and Bailey Cadamarteri were booked before half-time. Speid made a double change just past the hour, sending on Courtney Clarke and East for Hayden and Palmer.</p>
<p>The opening Jamaica needed came in the 68th minute, when Honduras's Dereck Moncada was shown a red card. With more than 20 minutes to play against ten men, the Boyz had the ball and the territory but could not find a way through a compact Honduran defence. Dwayne Atkinson picked up a late yellow card as frustration grew.</p>
<p>The defeat ended a long run. Jamaica had been unbeaten in eight matches against Honduras, whose last win in the fixture came 13 years ago. The teams' previous meeting in Kingston, in the 2024 Nations League, ended 0-0.</p>
<h3>What the two games showed</h3>
<ul>
<li><strong>The attack has goals in it.</strong> Three scorers in the opener, and Palmer directly involved in two of the goals.</li>
<li><strong>Slow starts are costly.</strong> Jamaica conceded in the second minute against Guatemala and the 14th against Honduras. Across the two games they were behind for long stretches.</li>
<li><strong>Breaking down a deep defence is still a problem.</strong> Twenty-plus minutes against ten men produced no equaliser.</li>
<li><strong>Cephas's fitness matters.</strong> The match-winner on Friday lasted eight minutes on Tuesday. The extent of the injury had not been confirmed at the time of writing.</li>
</ul>
<h3>What comes next</h3>
<p>The top two teams in the group advance to the quarter-finals, where Mexico, the United States, Canada or Panama will be waiting. Jamaica and Honduras each have three points after two matches, so the Boyz's remaining group games now carry real weight.</p>
<p>The squad Speid named for this window also included Leon Bailey among his 24 players. Getting a full-strength attack on the pitch, and starting games on the front foot, will be the priorities when the group resumes.</p>
${sources([
      ['Jamaica Observer: Cephas’ injury-time strike gives Boyz dramatic 3-2 win over Guatemala', 'https://www.jamaicaobserver.com/2026/09/25/cephas-injury-time-strike-gives-boyz-dramatic-3-2-win-guatemala-nations-league/'],
      ['Jamaica Observer: Harder they come (Honduras preview)', 'https://www.jamaicaobserver.com/2026/09/28/harder-they-come/'],
      ['VAVEL: Jamaica vs Honduras match report', 'https://www.vavel.com/en-us/soccer/2026/09/28/1273154-jamaica-vs-honduras-live-score-concacaf-nations-league.html'],
      ['Jamaica Observer: Reggae Boyz squad named for opening Nations League games', 'https://www.jamaicaobserver.com/2026/09/18/reggae-boyz-squad-named-opening-nations-league-games/'],
    ])}`,
  },

  {
    title: 'From Valdomore to "Alter Ego": 1Ski OG Drops 15-Track Debut Album, Plus the Week in New Dancehall',
    slug: '1ski-og-alter-ego-debut-album-new-dancehall-releases-september-2026',
    cover: '1ski-og-alter-ego-debut-album-new-dancehall.jpg',
    category: 'entertainment',
    tags: ['1Ski OG', 'Dancehall', 'New Music', 'Album Release', 'Chronic Law'],
    keywords: ['1Ski OG Alter Ego', 'new dancehall 2026', 'dancehall album', 'Valdomore', 'new reggae releases'],
    summary:
      'Comedian-turned-deejay 1Ski OG has released his debut album Alter Ego through Against Da Grain/Epic Records. We break down the project and round up the other dancehall and reggae releases from the last week of September.',
    content: `<p>Jamaican dancehall has a new major-label debut. 1Ski OG released his first album, <em>Alter Ego</em>, on Friday, 25 September 2026 through Against Da Grain/Epic Records. The 15-track project is the fullest statement yet from an artiste many Jamaicans first knew by another name, doing a different job.</p>
<h3>Who is 1Ski OG?</h3>
<p>Before the music, there was Valdomore, the comedian and actor who built a large following through social media skits. The turn came in 2023, when his song "Dawkniss" went viral and showed that the audience would follow him into the studio. In December 2024 he signed an international record deal.</p>
<p>The road from that deal to this album was not smooth. As 13th Street Promotions noted in its coverage, some of the singles that followed the signing did not connect the way they were expected to. He kept releasing, found a lane, and arrives at his debut with real momentum. Billboard has named him one of its Caribbean Artists to Watch, and his music has picked up playlist support from Apple Music and Audiomack.</p>
<h3>What is on the album</h3>
<p>The title is the concept. <em>Alter Ego</em> is built to show different sides of the same artiste, and the tracklist divides fairly cleanly into moods:</p>
<ul>
<li><strong>Faith and reflection.</strong> The album opens with "The Lord" featuring Sortie, the single that introduced the project. It sets a tone of resilience and gratitude rather than bravado.</li>
<li><strong>Vulnerability.</strong> "Stay To Mi Self" and "Life of a Man" featuring Romieikon are the most personal records here.</li>
<li><strong>The harder edge.</strong> "Riches Forever," "Mad Dem," "Options" and "Ratatata" are aimed at the streets.</li>
<li><strong>For the dance.</strong> "Have You Ever" featuring Sortie, "Miss Independent" and "Ay Gyal" move toward romance and the dance floor.</li>
</ul>
<p>Production comes from Sartout Records, Romieikon, Vault Entertainment, Maurice Linton of ArmzHouse Records and Dxntemadeit, among others.</p>
<h3>Why it matters</h3>
<p>Two things stand out about this release beyond the songs.</p>
<p>First, the route. A decade ago the idea of a social media comedian signing to a label under the Epic umbrella and delivering a full-length dancehall album would have sounded unlikely. The path from content creator to recording artiste is now an established one, and 1Ski OG is one of the clearest Jamaican examples of it working.</p>
<p>Second, the format. Dancehall remains a singles-driven business, where a strong riddim or a viral clip can do more for a career than an album. Choosing to open a debut with a song about faith, and sequencing 15 tracks around distinct moods, is a bet that listeners will sit with a body of work. How the album performs in the coming weeks will say something about whether that bet pays off for newer acts.</p>
<h3>Also out: the week in new dancehall and reggae</h3>
<p>1Ski OG was far from the only artiste releasing music at the end of September. Here is what else arrived:</p>
<ul>
<li><strong>Chronic Law</strong> delivered two singles on 30 September, "Small Talk" and "Freedom Soon."</li>
<li><strong>Intence</strong> released "Let This Go" the same day.</li>
<li><strong>Junior Reid</strong>, the veteran roots singer, returned with "Cool Breeze Blowing."</li>
<li><strong>Sizwe C</strong> dropped "Push It Back."</li>
<li><strong>Shawn Storm</strong> released "Tun It Up" on 28 September.</li>
<li><strong>Compass</strong> put out "Town Craft."</li>
<li><strong>Shatta Wale</strong>, the Ghanaian dancehall star, released "Count Of Monte Cristo."</li>
</ul>
<p>On the charts, Rugged Boss entered the US iTunes Reggae Songs chart at number six with "Handle" on 26 September.</p>
<h3>Where to start</h3>
<p>If you only have time for three songs from <em>Alter Ego</em>, try "The Lord" for the statement of intent, "Stay To Mi Self" for the reflective side, and "Ay Gyal" for the dance. Together they give a fair picture of what the album is trying to do.</p>
<p>Have you listened yet? Tell us your standout track in the comments below.</p>
${sources([
      ['The Knockturnal: 1Ski OG releases Alter Ego, his 15-track debut album', 'https://theknockturnal.com/1ski-og-releases-alter-ego-his-15-track-debut-album/'],
      ['13th Street Promotions: 1Ski OG breaks new ground with debut album', 'https://13thstreetpromotions.com/2026/09/25/1ski-og-alter-ego/'],
      ['YardHype: 1Ski OG releases 15-track debut album Alter Ego', 'https://yardhype.com/1ski-og-releases-15-track-debut-album-alter-ego/'],
      ['Riddim World: singles and albums', 'https://riddimsworld.com/singles/'],
    ])}`,
  },

  {
    title: 'Opinion: Ego Is the Real Problem in Jamaican Music',
    slug: 'opinion-ego-is-the-real-problem-in-jamaican-music',
    cover: 'ego-real-problem-jamaican-music.jpg',
    category: 'culture',
    author: 'Lionel Francis',
    source: 'YardVybz Opinion',
    tags: ['Opinion', 'Vybz Kartel', 'Bob Marley', 'Music Industry', 'Lumatix Music'],
    keywords: ['Jamaican music industry', 'Vybz Kartel vs Bob Marley', 'dancehall business', 'Lumatix Music', 'ego in dancehall'],
    summary:
      'The Kartel versus Marley argument is a symptom. After doing business in the Jamaican music industry, the author argues that ego, not talent or money, is what holds it back, and explains why he built a platform for artists who have no gatekeeper on their side.',
    content: `<p><em>This is an opinion piece. The author is the founder of Lumatix Music, which is discussed below. The views are his own.</em></p>
<p>I got into an argument online this week about Vybz Kartel and Bob Marley. It was the usual one: who is greater, who is "real" music, who deserves the crown.</p>
<p>I gave my answer and I stand by it. But the more I thought about it afterwards, the more I saw that the argument itself is the symptom. The disease is ego. I know, because I have done business in this industry and it cost me.</p>
<h3>Where I'm coming from</h3>
<p>I grew up in Franklin Town. My father was a DJ. I studied philosophy and literature at university, and I teach literature now. Assassin lived down the road from me. I am not looking at this culture from the outside.</p>
<p>So when I say there is no "good" art and "bad" art, I am saying it as someone who reads texts for a living. Art serves different purposes. Comparing artists on style alone gets you nowhere.</p>
<h3>Marley and Kartel are doing different jobs</h3>
<p>Take "One Love". It is universal and emotional. It gave people hope and unity in hard times. I would call it escape art, and I mean that as praise. You listen to Bob to understand Jamaica's history and identity.</p>
<p>Kartel works differently. He is a realist. His songs deal with the contradictions, the psychology and the everyday life of this society. You can treat a Kartel song like a literary text: you have to unpack the metaphors, the double meanings, the cultural references. I think what he does is harder than people admit, and I think time will be kind to him. Some artists give you songs to listen to. Kartel gave Jamaica a body of work to interpret.</p>
<p>Both men can be studied seriously. Nobody loses anything if both are great. Yet we insist on one throne, and that instinct runs through the whole industry.</p>
<h3>What happened to me</h3>
<p>I am a developer. I set out to build a music platform that would benefit every artist, including the unknown ones who are just rising and have nobody opening doors for them.</p>
<p>I was building it with someone in the business. I will not name him, because the name does not matter. The pattern does.</p>
<p>He did not want to pay for the platform. He wanted to own it. He wanted to launch it under his name, make money from it, and pay the developer whenever he felt like it. The work was mine and the cost was mine. The title was to be his.</p>
<p>It took me a while to understand what I was dealing with. It was never really about the money or even about the product. He wanted to be the owner. He wanted to feel big. The platform was just somewhere to exercise his ego.</p>
<p>So I walked away. I had to change the name and start again on my own.</p>
<h3>It is not just one man</h3>
<p>I wish that were a one-off story. It is how too much of this industry runs.</p>
<p>Everybody wants to be the boss, and nobody wants to be the partner. People want the credit without the investment. They would sooner own all of something that never launches than share something that works. The young producer does not get paid. The engineer does not get credited. The rising artist is told to wait his turn by someone who is afraid of being passed.</p>
<p>Jamaica has more talent per square mile than anywhere I know. Talent was never what we lacked. We lack people willing to build something they do not get to rule.</p>
<p>The same pride that makes our artists fearless on a record makes the business impossible across a table. That confidence is a gift. It turns into ego when it stops you paying people, sharing credit, or listening.</p>
<h3>What I built instead</h3>
<p>The platform is called Lumatix Music, and it is live at <a href="https://lugmaticmusic.com" target="_blank" rel="noopener noreferrer">lugmaticmusic.com</a>.</p>
<p>It is for dancehall, reggae and afrobeats. Any artist can upload their own tracks, go live from the studio, and earn directly from fans through virtual gifts, with payouts to a bank account, mobile money or PayPal. Artists keep 95 per cent of their payout share. There are sound clashes, dance-offs and sing-offs where the fans decide the winner. There is a marketplace to book studio time or hire musicians.</p>
<p>The point is simple. An unknown artist should not need permission from a big man to be heard or to get paid. If the fans rate you, you earn.</p>
<p>I am not claiming a website can cure pride. But it can take the gatekeeper out of the room.</p>
<p>The music was never the problem. We are.</p>`,
  },
];
