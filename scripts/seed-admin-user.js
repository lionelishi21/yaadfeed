#!/usr/bin/env node

/**
 * Seed Admin User Script
 * Creates a default admin user for YaadFeed platform
 * 
 * Usage: node scripts/seed-admin-user.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'yaadfeed';

// Admin user details
const ADMIN_USER = {
  email: 'admin@yaadfeed.com',
  password: 'Admin@123',
  name: 'Admin User',
  role: 'admin',
  isActive: true
};

async function createAdminUser() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(MONGODB_DB);
    const usersCollection = db.collection('users');
    
    // Check if admin user already exists
    const existingUser = await usersCollection.findOne({ email: ADMIN_USER.email });
    
    if (existingUser) {
      console.log('⚠️  Admin user already exists with email:', ADMIN_USER.email);
      console.log('   User ID:', existingUser._id);
      console.log('   Created at:', existingUser.createdAt);
      console.log('   Role:', existingUser.role);
      console.log('   Status:', existingUser.isActive ? 'Active' : 'Inactive');
      return;
    }
    
    // Hash the password
    console.log('🔐 Hashing password...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(ADMIN_USER.password, saltRounds);
    
    // Create user object
    const now = new Date();
    const adminUser = {
      ...ADMIN_USER,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now
    };
    
    // Insert admin user
    console.log('👤 Creating admin user...');
    const result = await usersCollection.insertOne(adminUser);
    
    if (result.insertedId) {
      console.log('✅ Admin user created successfully!');
      console.log('   User ID:', result.insertedId);
      console.log('   Email:', ADMIN_USER.email);
      console.log('   Password:', ADMIN_USER.password);
      console.log('   Role:', ADMIN_USER.role);
      console.log('');
      console.log('🚀 You can now login to the admin dashboard at:');
      console.log('   URL: http://localhost:4000/platform/admin');
      console.log('   Email:', ADMIN_USER.email);
      console.log('   Password:', ADMIN_USER.password);
    } else {
      console.error('❌ Failed to create admin user');
    }
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
}

// Check if running directly
if (require.main === module) {
  console.log('🌱 YaadFeed Admin User Seeder');
  console.log('===============================');
  createAdminUser();
}

module.exports = { createAdminUser, ADMIN_USER }; 