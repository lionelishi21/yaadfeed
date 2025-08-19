import { MongoClient, Db, Collection } from 'mongodb';

// Global MongoDB connection
let client: MongoClient | null = null;
let db: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'yaadfeed';

export interface NewsItem {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl?: string;
  category: string;
  source: string;
  url: string;
  publishedAt: Date;
  author?: string;
  tags: string[];
  keywords: string[];
  isPopular: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface Poll {
  _id?: string;
  question: string;
  options: { text: string; votes: number }[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  if (client && db) {
    return { db, client };
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    db = client.db(MONGODB_DB);
    
    // Create indexes for better performance
    const newsCollection = db.collection('news_items');
    const usersCollection = db.collection('users');
    
    await Promise.all([
      // News indexes
      newsCollection.createIndex({ publishedAt: -1 }),
      newsCollection.createIndex({ category: 1 }),
      newsCollection.createIndex({ slug: 1 }, { unique: true }),
      newsCollection.createIndex({ url: 1 }, { unique: true }),
      newsCollection.createIndex({ isPopular: 1 }),
      newsCollection.createIndex({ source: 1 }),
      newsCollection.createIndex({ title: 'text', content: 'text' }),
      
      // User indexes
      usersCollection.createIndex({ email: 1 }, { unique: true }),
      usersCollection.createIndex({ role: 1 }),
      usersCollection.createIndex({ isActive: 1 })
    ]);
    
    console.log('✅ Connected to MongoDB successfully');
    return { db, client };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function getNewsCollection(): Promise<Collection<NewsItem>> {
  const { db } = await connectToDatabase();
  return db.collection<NewsItem>('news_items');
}

export async function getUsersCollection(): Promise<Collection<User>> {
  const { db } = await connectToDatabase();
  return db.collection<User>('users');
}

export async function getArtistsCollection(): Promise<Collection<any>> {
  const { db } = await connectToDatabase();
  return db.collection('artists');
}

export async function getPollsCollection(): Promise<Collection<Poll>> {
  const { db } = await connectToDatabase();
  return db.collection<Poll>('polls');
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔌 MongoDB connection closed');
  }
}

// MongoDB query helpers
export class NewsService {
  static async getAllNews(filters: {
    category?: string;
    source?: string;
    limit?: number;
    search?: string;
  } = {}): Promise<NewsItem[]> {
    const collection = await getNewsCollection();
    
    let query: any = {};
    
    if (filters.category && filters.category !== 'all') {
      query.category = filters.category;
    }
    
    if (filters.source) {
      query.source = filters.source;
    }
    
    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    
    const news = await collection
      .find(query)
      .sort({ publishedAt: -1 })
      .limit(filters.limit || 50)
      .toArray();
    
    return news;
  }
  
  static async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    const collection = await getNewsCollection();
    return await collection.findOne({ slug }) || null;
  }
  
  static async getNewsById(id: string): Promise<NewsItem | null> {
    const collection = await getNewsCollection();
    return await collection.findOne({ _id: id as any }) || null;
  }
  
  static async createNews(newsData: Omit<NewsItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<NewsItem | null> {
    const collection = await getNewsCollection();
    
    const now = new Date();
    const news: Omit<NewsItem, '_id'> = {
      ...newsData,
      createdAt: now,
      updatedAt: now
    };
    
    try {
      const result = await collection.insertOne(news as NewsItem);
      return await collection.findOne({ _id: result.insertedId }) || null;
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key error
        console.log('Article already exists:', newsData.title);
        return null;
      }
      throw error;
    }
  }
  
  static async updateViewCount(slug: string): Promise<void> {
    const collection = await getNewsCollection();
    await collection.updateOne(
      { slug },
      { 
        $inc: { viewCount: 1 },
        $set: { updatedAt: new Date() }
      }
    );
  }
  
  static async deleteOldNews(daysOld: number = 30): Promise<number> {
    const collection = await getNewsCollection();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const result = await collection.deleteMany({
      publishedAt: { $lt: cutoffDate }
    });
    
    return result.deletedCount || 0;
  }
  
  static async newsExists(title: string, url: string): Promise<boolean> {
    const collection = await getNewsCollection();
    const existing = await collection.findOne({
      $or: [
        { title },
        { url }
      ]
    });
    
    return existing !== null;
  }
  
  static async getRelatedNews(category: string, currentSlug: string, limit: number = 3): Promise<NewsItem[]> {
    const collection = await getNewsCollection();
    
    return await collection
      .find({
        category,
        slug: { $ne: currentSlug }
      })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();
  }

  // Clear all news articles from database
  static async clearAllNews(): Promise<{ success: boolean; deletedCount: number; message: string }> {
    try {
      const collection = await getNewsCollection();
      const result = await collection.deleteMany({});
      
      console.log(`🗑️ Cleared ${result.deletedCount} articles from database`);
      
      return {
        success: true,
        deletedCount: result.deletedCount || 0,
        message: `Successfully cleared ${result.deletedCount} articles from database`
      };
    } catch (error) {
      console.error('❌ Failed to clear database:', error);
      return {
        success: false,
        deletedCount: 0,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get database statistics
  static async getDatabaseStats(): Promise<{
    totalArticles: number;
    categories: { [category: string]: number };
    sources: { [source: string]: number };
    withImages: number;
    withoutImages: number;
  }> {
    try {
      const collection = await getNewsCollection();
      
      const totalArticles = await collection.countDocuments();
      
      // Count by category
      const categoryStats = await collection.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]).toArray();
      
      const categories: { [category: string]: number } = {};
      categoryStats.forEach(stat => {
        categories[stat._id || 'unknown'] = stat.count;
      });
      
      // Count by source
      const sourceStats = await collection.aggregate([
        { $group: { _id: "$source", count: { $sum: 1 } } }
      ]).toArray();
      
      const sources: { [source: string]: number } = {};
      sourceStats.forEach(stat => {
        sources[stat._id || 'unknown'] = stat.count;
      });
      
      // Count articles with/without images
      const withImages = await collection.countDocuments({ 
        imageUrl: { $exists: true, $ne: "", $type: "string" }
      });
      const withoutImages = totalArticles - withImages;
      
      return {
        totalArticles,
        categories,
        sources,
        withImages,
        withoutImages
      };
    } catch (error) {
      console.error('❌ Failed to get database stats:', error);
      return {
        totalArticles: 0,
        categories: {},
        sources: {},
        withImages: 0,
        withoutImages: 0
      };
    }
  }

  static async updateNews(slugOrId: string, updates: Partial<Omit<NewsItem, '_id' | 'createdAt'>>): Promise<NewsItem | null> {
    const collection = await getNewsCollection();
    const query = { $or: [{ slug: slugOrId }, { _id: slugOrId as any }] };
    const updateDoc: any = { $set: { ...updates, updatedAt: new Date() } };
    await collection.updateOne(query, updateDoc);
    return await collection.findOne(query) || null;
  }

  static async deleteNews(slugOrId: string): Promise<boolean> {
    const collection = await getNewsCollection();
    const query = { $or: [{ slug: slugOrId }, { _id: slugOrId as any }] };
    const result = await collection.deleteOne(query);
    return result.deletedCount === 1;
  }

  static async getAllArtists(): Promise<any[]> {
    const collection = await getArtistsCollection();
    return await collection.find({}).sort({ popularity: -1 }).toArray();
  }

  static async createArtist(artistData: any): Promise<any> {
    const collection = await getArtistsCollection();
    const now = new Date();
    const artist = {
      ...artistData,
      createdAt: artistData.createdAt || now,
      updatedAt: now
    };
    try {
      // Upsert by name to avoid duplicates
      await collection.updateOne(
        { name: artist.name },
        { $set: artist },
        { upsert: true }
      );
      console.log(`✅ Saved artist: ${artist.name}`);
      return artist;
    } catch (error) {
      console.error(`❌ Error saving artist: ${artist.name}`, error);
      throw error;
    }
  }
}

export class UserService {
  static async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User | null> {
    const collection = await getUsersCollection();
    
    const now = new Date();
    const user: Omit<User, '_id'> = {
      ...userData,
      createdAt: now,
      updatedAt: now
    };
    
    try {
      const result = await collection.insertOne(user as User);
      return await collection.findOne({ _id: result.insertedId }) || null;
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate email error
        console.log('User with this email already exists:', userData.email);
        return null;
      }
      throw error;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const collection = await getUsersCollection();
    return await collection.findOne({ email }) || null;
  }

  static async getUserById(id: string): Promise<User | null> {
    const collection = await getUsersCollection();
    return await collection.findOne({ _id: id as any }) || null;
  }

  static async updateUser(id: string, updates: Partial<Omit<User, '_id' | 'createdAt'>>): Promise<User | null> {
    const collection = await getUsersCollection();
    
    const result = await collection.findOneAndUpdate(
      { _id: id as any },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );
    
    return result || null;
  }

  static async updateLastLogin(email: string): Promise<void> {
    const collection = await getUsersCollection();
    await collection.updateOne(
      { email },
      { 
        $set: { 
          lastLogin: new Date(),
          updatedAt: new Date() 
        } 
      }
    );
  }

  static async getAllUsers(): Promise<User[]> {
    const collection = await getUsersCollection();
    return await collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  static async getAdminUsers(): Promise<User[]> {
    const collection = await getUsersCollection();
    return await collection.find({ role: 'admin' }).sort({ createdAt: -1 }).toArray();
  }

  static async deleteUser(id: string): Promise<boolean> {
    const collection = await getUsersCollection();
    const result = await collection.deleteOne({ _id: id as any });
    return result.deletedCount === 1;
  }

  static async userExists(email: string): Promise<boolean> {
    const collection = await getUsersCollection();
    const user = await collection.findOne({ email });
    return user !== null;
  }
}

export class PollService {
  static async createPoll(poll: Omit<Poll, '_id' | 'createdAt' | 'updatedAt'>): Promise<Poll | null> {
    const collection = await getPollsCollection();
    const now = new Date();
    const doc = { ...poll, createdAt: now, updatedAt: now };
    const result = await collection.insertOne(doc as Poll);
    return await collection.findOne({ _id: result.insertedId }) || null;
  }
  static async getActivePoll(): Promise<Poll | null> {
    const collection = await getPollsCollection();
    return await collection.findOne({ active: true }) || null;
  }
  static async voteOnPoll(pollId: string, optionIndex: number): Promise<Poll | null> {
    const collection = await getPollsCollection();
    const poll = await collection.findOne({ _id: pollId as any });
    if (!poll) return null;
    const updateKey = `options.${optionIndex}.votes`;
    await collection.updateOne({ _id: pollId as any }, { $inc: { [updateKey]: 1 }, $set: { updatedAt: new Date() } });
    return await collection.findOne({ _id: pollId as any }) || null;
  }
  static async getPollById(pollId: string): Promise<Poll | null> {
    const collection = await getPollsCollection();
    return await collection.findOne({ _id: pollId as any }) || null;
  }
}

export default NewsService; 