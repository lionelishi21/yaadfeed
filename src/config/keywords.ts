export const ARTICLE_HIGHLIGHT_KEYWORDS = [
  // Law & Justice
  'Police', 'JCF', 'INDECOM', 'Supreme Court', 'charges', 'arrested', 'bail', 'crime', 'fraud', 'scam', 'court',
  
  // Politics & Leaders
  'Parliament', 'PNP', 'JLP', 'Andrew Holness', 'Mark Golding', 'Prime Minister', 'MP', 'Mayor',
  
  // Economy & Business
  'BOJ', 'JSE', 'inflation', 'exchange rate', 'stocks', 'investment', 'company', 'registered company', 'real estate', 'house', 'money', 'value', 'business',
  
  // Infrastructure
  'JPS', 'NWC', 'highway', 'toll', 'power outage', 'water supply',
  
  // Locations
  'Kingston', 'Montego Bay', 'Portmore', 'St. Andrew', 'Ochi', 'Ocho Rios', 'Parish', 'Country', 'Jamaica',
  
  // Culture
  'Dancehall', 'Reggae', 'Carnival', 'Soundclash', 'artiste', 'music'
];

export const getHighlightInstructions = () => {
  return `Whenever you mention specific monetary values, specific company names, country names (like Jamaica), or terms related to Jamaican law, politics, economy, infrastructure, and culture (e.g., Police, PNP, JLP, Kingston, BOJ, crime, real estate), wrap them in <mark class="yf-highlight"> tags to make them stand out.`;
};
