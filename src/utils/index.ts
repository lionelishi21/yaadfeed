import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// Simple clsx replacement
function clsx(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
}

// Utility function for combining Tailwind classes
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(...inputs));
}


// Date formatting utilities
export const formatters = {
  date: (date: string | Date | null | undefined) => {
    if (!date) return 'No date';
    try {
      const parsedDate = typeof date === 'string' ? dayjs(date) : dayjs(date);
      return parsedDate.isValid() ? parsedDate.format('MMM DD, YYYY') : 'Invalid date';
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  },
  
  time: (date: string | Date | null | undefined) => {
    if (!date) return 'No time';
    try {
      const parsedDate = typeof date === 'string' ? dayjs(date) : dayjs(date);
      return parsedDate.isValid() ? parsedDate.format('h:mm A') : 'Invalid time';
    } catch (error) {
      console.error('Time formatting error:', error);
      return 'Invalid time';
    }
  },
  
  datetime: (date: string | Date | null | undefined) => {
    if (!date) return 'No date';
    try {
      const parsedDate = typeof date === 'string' ? dayjs(date) : dayjs(date);
      return parsedDate.isValid() ? parsedDate.format('MMM DD, YYYY h:mm A') : 'Invalid date';
    } catch (error) {
      console.error('DateTime formatting error:', error);
      return 'Invalid date';
    }
  },
  
  relative: (date: string | Date | null | undefined) => {
    if (!date) return 'No date';
    try {
      const parsedDate = typeof date === 'string' ? dayjs(date) : dayjs(date);
      return parsedDate.isValid() ? parsedDate.fromNow() : 'Invalid date';
    } catch (error) {
      console.error('Relative date formatting error:', error);
      return 'Invalid date';
    }
  },
};

// Number formatting utilities
export const numberFormat = {
  currency: (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },
  
  compact: (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
    }).format(num);
  },
  
  percentage: (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(num / 100);
  },
};

// String utilities
export const stringUtils = {
  truncate: (str: string, length: number) => {
    if (!str || str.length <= length) return str || '';
    return str.slice(0, length) + '...';
  },
  
  capitalize: (str: string | null | undefined) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  slugify: (str: string) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
  
  extractReadingTime: (content: string) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },
};

// Content sanitization utilities
export const contentUtils = {
  sanitizeText: (text: string): string => {
    if (!text) return '';
    let cleaned = text
      // Remove common RSS/WordPress tails like "The post ... appeared first on ..."
      .replace(/\bthe post\b[\s\S]*?\bappeared first on\b[\s\S]*?$/gi, '')
      // Remove trailing source parentheses like (Source: example.com)
      .replace(/\(\s*source:\s*[^\)]+\)\s*$/gim, '')
      // Remove CDATA markers and leftover brackets
      .replace(/<!\[CDATA\[|]]>/g, '')
      // Normalize Read More artifacts
      .replace(/\[\s*read more\s*\.?\s*]\s*/gi, '')
      .replace(/read more\s*\.\.\.|read more\s*»?/gi, '')
      // Collapse excessive whitespace
      .replace(/\s{3,}/g, ' ')  
      .trim();

    // Remove duplicated leading headline fragments repeated at start of body
    const firstSentence = cleaned.split(/\n|\.|!|\?/)[0]?.trim();
    if (firstSentence && cleaned.toLowerCase().startsWith((firstSentence + ' ' + firstSentence).toLowerCase())) {
      cleaned = cleaned.slice(firstSentence.length + 1);
    }

    // Remove exact duplicate lines/paragraphs next to each other
    const parts = cleaned.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    const deduped: string[] = [];
    for (const p of parts) {
      if (deduped.length === 0 || deduped[deduped.length - 1].toLowerCase() !== p.toLowerCase()) {
        deduped.push(p);
      }
    }
    cleaned = deduped.join('\n\n');

    return cleaned.trim();
  },

  normalizeExcerpt: (text: string, maxLength: number = 220): string => {
    const t = contentUtils.sanitizeText(text)
      .replace(/\s+/g, ' ')
      .trim();
    if (t.length <= maxLength) return t;
    return t.slice(0, maxLength).replace(/[,;:\s]+\S*$/, '') + '…';
  },
};

// Validation utilities
export const validators = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  url: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  phone: (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },
};

// Local storage utilities
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

// RSS feed parsing utilities
export const rssUtils = {
  parseXML: (xmlString: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const parser = new DOMParser();
      return parser.parseFromString(xmlString, 'text/xml');
    } catch {
      return null;
    }
  },
  
  extractItems: (xmlDoc: Document) => {
    const items = xmlDoc.querySelectorAll('item');
    return Array.from(items).map(item => ({
      title: item.querySelector('title')?.textContent || '',
      description: item.querySelector('description')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || '',
      category: item.querySelector('category')?.textContent || '',
      guid: item.querySelector('guid')?.textContent || '',
    }));
  },
};

// Image utilities
export const imageUtils = {
  getPlaceholder: (width: number = 400, height: number = 300, text: string = 'Image') => {
    // Use local placeholder images instead of external service
    const category = text.toLowerCase().includes('jamaica') ? 
      text.toLowerCase().replace('jamaica ', '').split(' ')[0] : 'general';
    return `/images/placeholder-${category}.jpg`;
  },
  
  optimizeUrl: (url: string, width?: number, height?: number) => {
    if (!url) return imageUtils.getPlaceholder(width, height);
    
    // For AI-generated images, return as is
    if (url.startsWith('/images/generated/')) {
      return url;
    }
    
    // For external URLs, return as is (no optimization needed)
    return url;
  },
};

// API utilities
export const apiUtils = {
  createUrl: (baseUrl: string, params: Record<string, any>) => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
    return url.toString();
  },
  
  handleResponse: async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }
    return response.json();
  },
};

// Color utilities for Jamaica theme
export const colorUtils = {
  jamaicaColors: {
    green: {
      primary: '#16a34a',
      light: '#22c55e',
      dark: '#15803d',
    },
    gold: {
      primary: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    black: {
      primary: '#0f172a',
      light: '#1e293b',
      dark: '#020617',
    },
  },
  
  getRandomJamaicaColor: () => {
    const colors = ['#16a34a', '#f59e0b', '#0f172a'];
    return colors[Math.floor(Math.random() * colors.length)];
  },
};

// Performance utilities
export const performance = {
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },
  
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  },
};

// Error handling utilities
export const errorUtils = {
  getErrorMessage: (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred';
  },
  
  logError: (error: unknown, context?: string) => {
    const message = errorUtils.getErrorMessage(error);
    console.error(`${context ? `[${context}] ` : ''}${message}`, error);
  },
};

// SEO utilities
export const seoUtils = {
  generateMetaTitle: (title: string, siteName = 'YaadFeed') => {
    return `${title} | ${siteName}`;
  },
  
  generateMetaDescription: (content: string, maxLength = 160) => {
    return stringUtils.truncate(content.replace(/<[^>]*>/g, ''), maxLength);
  },
  
  generateKeywords: (tags: string[], additional: string[] = []) => {
    return [...tags, ...additional, 'Jamaica', 'Jamaican', 'News', 'Music'].join(', ');
  },
};

export * from './slug';
