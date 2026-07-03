export const ARTICLE_HIGHLIGHT_KEYWORDS = [
  // Law & Justice
  'Police', 'JCF', 'INDECOM', 'Supreme Court', 'charges', 'arrested', 'bail', 'crime', 'fraud', 'scam', 'court',
  
  // Politics & Leaders
  'Parliament', 'PNP', 'JLP', 'Andrew Holness', 'Mark Golding', 'Prime Minister', 'MP', 'Mayor',
  
  // Economy & Business
  'BOJ', 'JSE', 'inflation', 'exchange rate', 'stocks', 'investment', 'registered company', 'real estate', 'house',
  
  // Infrastructure
  'JPS', 'NWC', 'highway', 'toll', 'power outage', 'water supply',
  
  // Locations
  'Kingston', 'Montego Bay', 'Portmore', 'St. Andrew', 'Ochi', 'Ocho Rios', 'Jamaica',
  
  // Culture
  'Dancehall', 'Reggae', 'Carnival', 'Soundclash', 'artiste', 'music'
];

export const getHighlightInstructions = () => {
  return `Whenever you mention specific monetary values, specific company names, dates/times, key public figures (politicians, artists), exact locations, or statistics/percentages, wrap them in <mark class="yf-highlight"> tags to make them stand out.`;
};
