#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * 
 * This script tests the MongoDB connection and provides detailed debugging information.
 * Run this script to check if your MongoDB connection is working properly.
 * 
 * Usage:
 *   node scripts/test-mongodb-connection.js
 *   npm run test:mongodb
 */

const { MongoClient } = require('mongodb');

// Load environment variables
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'yaadfeed';

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const emoji = {
    info: 'ℹ️',
    error: '❌',
    warn: '⚠️',
    success: '✅'
  };
  
  console.log(`${emoji[level]} [${timestamp}] ${message}`);
}

async function testMongoDBConnection() {
  log('Starting MongoDB connection test...', 'info');
  log(`Environment: ${process.env.NODE_ENV || 'development'}`, 'info');
  log(`MongoDB URI: ${MONGODB_URI ? `${MONGODB_URI.substring(0, 30)}...` : 'not set'}`, 'info');
  log(`Database: ${MONGODB_DB}`, 'info');
  
  let client = null;
  
  try {
    // Check if MONGODB_URI is set
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    log('Creating MongoDB client...', 'info');
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    
    log('Connecting to MongoDB server...', 'info');
    await client.connect();
    log('Connected to MongoDB server successfully!', 'success');
    
    log('Accessing database...', 'info');
    const db = client.db(MONGODB_DB);
    
    log('Testing database ping...', 'info');
    await db.admin().ping();
    log('Database ping successful!', 'success');
    
    log('Getting database stats...', 'info');
    const stats = await db.stats();
    log(`Database: ${stats.db}`, 'success');
    log(`Collections: ${stats.collections}`, 'success');
    log(`Data size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`, 'success');
    
    log('Listing collections...', 'info');
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      log('No collections found in database', 'warn');
    } else {
      log(`Found ${collections.length} collections:`, 'success');
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        log(`  - ${collection.name}: ${count} documents`, 'info');
      }
    }
    
    // Test specific collections that should exist
    const expectedCollections = ['news_items', 'users', 'artists', 'polls'];
    for (const collectionName of expectedCollections) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        log(`Collection '${collectionName}': ${count} documents`, 'success');
      } catch (error) {
        log(`Collection '${collectionName}': Error - ${error.message}`, 'error');
      }
    }
    
    log('MongoDB connection test completed successfully!', 'success');
    return true;
    
  } catch (error) {
    log(`MongoDB connection test failed: ${error.message}`, 'error');
    log(`Error details: ${JSON.stringify(error, null, 2)}`, 'error');
    
    // Provide helpful debugging information
    log('Debugging information:', 'warn');
    log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`, 'warn');
    log(`- MONGODB_URI: ${MONGODB_URI ? 'set' : 'not set'}`, 'warn');
    log(`- MONGODB_DB: ${MONGODB_DB}`, 'warn');
    
    if (MONGODB_URI && MONGODB_URI.includes('localhost')) {
      log('⚠️  You are using localhost. Make sure MongoDB is running locally.', 'warn');
      log('   To start MongoDB locally: brew services start mongodb-community', 'warn');
    }
    
    if (MONGODB_URI && MONGODB_URI.includes('mongodb.net')) {
      log('⚠️  You are using MongoDB Atlas. Check your network access and credentials.', 'warn');
    }
    
    return false;
    
  } finally {
    if (client) {
      log('Closing MongoDB connection...', 'info');
      await client.close();
      log('Connection closed', 'success');
    }
  }
}

// Run the test
if (require.main === module) {
  testMongoDBConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      log(`Unexpected error: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = { testMongoDBConnection };
