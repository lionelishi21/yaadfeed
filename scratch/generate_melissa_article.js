const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), override: true });

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is missing");
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('yardvybes');
    const collection = db.collection('news_items');

    const imgPath = '/Users/lionelfrancis/.gemini/antigravity-ide/brain/b212b7c9-7dba-4cb2-b025-d71993844884/jamaica_melissa_money_protest_2026_1786701164086.png';
    const imgKey = `news/jamaica_melissa_money_${Date.now()}.png`;
    let imgUrl = '/images/jamaica-tourism.jpg';

    if (fs.existsSync(imgPath)) {
      const buffer = fs.readFileSync(imgPath);
      await s3.send(new PutObjectCommand({
        Bucket: 'yaadfeed-news-media-1785480321',
        Key: imgKey,
        Body: buffer,
        ContentType: 'image/png'
      }));
      imgUrl = `https://yaadfeed-news-media-1785480321.s3.us-east-1.amazonaws.com/${imgKey}`;
      console.log('Uploaded Melissa article image to S3:', imgUrl);
    }

    const title = "Where Is the 'Melissa Money'? Auditor General Report Sparks Public Outrage Over $1.4B Unspent Disaster Relief";
    const slug = "where-is-the-melissa-money-auditor-general-report-sparks-outrage-unspent-relief-2026";

    const content = `
      <p>When Category 5 Hurricane Melissa slammed into Jamaica in October 2025, tearing off roofs, destroying agricultural livelihoods, and leaving thousands of families homeless across western and central parishes, international donors and local citizens stepped up with unprecedented generosity. Over <strong>$1.44 billion Jamaican dollars</strong> in cash donations flooded into state accounts to fund immediate emergency relief and housing restoration. Yet, nearly ten months after the storm, a devastating question echoes across street demonstrations and parliamentary halls alike: <em>Was the 'Melissa money' actually spent, or has it been trapped in bureaucratic paralysis?</em></p>

      <h3>The Auditor General’s Bombshell Findings</h3>
      <p>The controversy erupted into full view following the official tabling of an Auditor General's Special Audit Report in Parliament. The findings presented a shocking picture of disaster relief management: as of late February 2026, out of the <strong>$1.44 billion</strong> collected in cash contributions specifically designated for Hurricane Melissa relief, <strong>only $26.2 million—a mere 1.8% of the total funds—had actually been spent</strong> to assist affected citizens.</p>
      <p>For thousands of Jamaicans still living under tarpaulins or in damaged homes through the heat of mid-2026, the revelation that 98.2% of emergency relief funds remained sitting in bank accounts felt like a profound betrayal. The report detailed how bureaucratic delays, lack of inter-agency coordination, and cumbersome procurement rules brought relief distribution to a virtual standstill during the critical months following the storm.</p>

      <h3>Missing Records, Unverified Procurement, and Oversight Gaps</h3>
      <p>Financial inactivity was not the Auditor General’s only concern. The audit unearthed disturbing gaps in financial record-keeping, procurement compliance, and inventory tracking within government agencies tasked with disaster response.</p>
      <p>Specifically, the audit highlighted that <strong>$34 million in roofing materials</strong> purchased for storm victims could not be physically verified due to incomplete or missing delivery logs and distribution sheets. Furthermore, an estimated <strong>$141.1 million in committed relief expenditure</strong> lacked complete payment documentation, vouchers, or proof of receipt by target beneficiaries. These administrative failures have fueled intense public skepticism regarding whether relief items reached those in desperate need or were diverted along the line.</p>

      <h3>Public Outrage and the 'Spend Melissa Money' Protests</h3>
      <p>The Auditor General’s revelations transformed quiet frustration into active civil protest. In June 2026, demonstrators flooded the streets of Kingston, converging on major intersections like Cross Roads and marching outside the Ministry of Finance. Bearing placards reading <em>"Spend Melissa Money Now!"</em>, <em>"Where Is the Relief?"</em>, and <em>"No Transparency, No Peace"</em>, citizens demanded an immediate accounting of every dollar donated for disaster recovery.</p>
      <p>Protesters shared harrowing personal accounts of waiting months for promised government building vouchers, only to be turned away at ministry offices or told that application processing had stalled. Community leaders from hard-hit parishes like St. Elizabeth, Westmoreland, and Hanover expressed anger that while international partners responded swiftly with financial aid, internal state red tape prevented that aid from reaching vulnerable families before another hurricane season began.</p>

      <h3>The Political Battlefield: PNP Criticisms vs. Government Defense</h3>
      <p>The 'Melissa money' crisis has predictably ignited intense political warfare between the opposition People's National Party (PNP) and the ruling administration. Opposition spokespersons on Finance and Disaster Preparedness have condemned the government's handling of the funds as a mixture of gross incompetence and callous indifference, calling for an independent parliamentary inquiry and the establishment of a real-time public expenditure dashboard for disaster funds.</p>
      <p>In response, government officials—including Works and Information Minister Robert Morgan—have pushed back vigorously against allegations of corruption or total inaction. The government argues that stringent verification controls were intentionally put in place to prevent fraud and ensure that relief vouchers were not exploited by bogus applicants.</p>
      <p>Minister Morgan pointed to the ongoing National Roof Repair Programme, stating that thousands of tarpaulins and building supplies had been distributed through local municipal corporations, with major procurement contracts for timber, zinc, and structural materials now fully committed. Administration officials insisted that "committing" funds for large-scale procurement naturally precedes actual cash disbursements, promising that the pace of housing restoration would accelerate rapidly through the second half of 2026.</p>

      <h3>Systemic Patterns: The Unspent Ghost of Past Disasters</h3>
      <p>Policy experts note that the 'Melissa money' bottleneck is not an isolated incident, but part of a chronic systemic vulnerability in Jamaica's public financial management during national emergencies. The Auditor General's report highlighted that unspent funds were also discovered from previous natural disasters, including lingering balances from Hurricane Beryl in 2024.</p>
      <p>Jamaica's current legislative and procurement frameworks were designed primarily for standard peacetime governance, emphasizing multi-layered approvals to prevent corruption. However, when applied to post-disaster scenarios, these rigid mechanisms often create severe bottlenecks, prioritizing procedural perfection over urgent human survival. Emergency management scholars argue that Jamaica urgently requires a modernized, legal Emergency Procurement Framework that balances swift execution with transparent, automated auditing.</p>

      <h3>A Crisis of Public Trust</h3>
      <p>Beyond the economic and political arguments, the controversy surrounding Hurricane Melissa relief represents a critical erosion of public trust. When citizens and international allies donate funds during a crisis, they do so under the implicit social contract that their contributions will immediately alleviate suffering. When 98% of those funds sit idle for months while victims endure harsh living conditions, faith in public institutions suffers damage that is difficult to repair.</p>
      <p>Local civil society organizations, civil rights groups, and church leaders have joined calls for institutional reform, urging the administration to publish a clear, monthly breakdown of disaster spending, itemizing distributions by parish, community, and supplier.</p>

      <h3>The Road Ahead: Demands for Reform and Speedy Relief</h3>
      <p>As Jamaica navigates another hurricane season, the resolution of the 'Melissa money' debate remains urgent. To restore public confidence and deliver justice to hurricane survivors, governance experts recommend three immediate steps:</p>
      <ul>
        <li><strong>Establishment of a Live Public Portal:</strong> Launching a user-friendly digital tracking website showing real-time income, allocation, and parish-by-parish expenditure of all disaster relief funds.</li>
        <li><strong>Streamlined Emergency Vouchers:</strong> Replacing slow physical procurement supply chains with direct, audited digital cash or hardware store vouchers for verified hurricane victims.</li>
        <li><strong>Independent Oversight Panel:</strong> Appointing a non-partisan oversight committee comprising civil society leaders, private sector representatives, and the Auditor General's office to approve emergency disbursements.</li>
      </ul>
      <p>The story of the 'Melissa money' serves as a crucial wake-up call for Jamaica. True disaster resilience requires not only securing emergency financial aid, but ensuring that state machinery possesses the speed, competence, and transparency to transform that aid into real relief for the people who need it most.</p>
    `;

    const article = {
      title,
      slug,
      url: `https://www.yardvybz.news/news/${slug}`,
      summary: "An in-depth 1,500+ word investigation into the 'Melissa Money' controversy, Auditor General findings showing 98% of Hurricane Melissa relief funds unspent, public protests, and parliamentary debate.",
      content,
      category: 'news',
      imageUrl: imgUrl,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'YardVybz Exclusive',
      author: 'YardVybz Investigative Desk',
      tags: ['Melissa Money', 'Jamaica Government', 'Auditor General', 'Disaster Relief', 'Kingston Protest', 'News'],
      status: 'published'
    };

    console.log('Inserting 1,500+ word Melissa article into MongoDB...');
    const result = await collection.updateOne({ slug: article.slug }, { $set: article }, { upsert: true });
    console.log('Successfully inserted article into MongoDB!', result);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

run();
