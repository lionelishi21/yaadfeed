import { NewsItem } from './mongodb';

export class FacebookService {
  /**
   * Posts a newly created article to the Facebook Page using the Graph API.
   * @param article The article that was just created.
   * @returns true if successful, false otherwise.
   */
  static async postArticle(article: NewsItem): Promise<boolean> {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    
    // Determine the base site URL for the link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yardvybz.news';

    if (!pageId || !accessToken) {
      console.warn('Facebook credentials missing. Skipping Facebook post for article:', article.title);
      return false;
    }

    try {
      const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
      
      // Format the post message
      const message = `${article.title}\n\nRead more at YardVybz!`;
      const link = `${siteUrl}/news/${article.slug}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          link: link,
          access_token: accessToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to post to Facebook:', data.error);
        return false;
      }

      console.log(`Successfully posted to Facebook: ${data.id}`);
      return true;
    } catch (error) {
      console.error('Exception while posting to Facebook:', error);
      return false;
    }
  }
}
