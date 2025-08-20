# MongoDB Debugging Guide

This guide helps you debug MongoDB connection issues in your YaadFeed application, especially in production environments.

## 🔍 Quick Diagnostics

### 1. Test MongoDB Connection
Run the connection test script to check if MongoDB is accessible:

```bash
npm run test:mongodb
```

This will:
- Test the MongoDB connection
- Show environment variables
- Display database statistics
- List collections and document counts
- Provide helpful debugging information

### 2. Check Health Endpoint
Visit the MongoDB health endpoint in your browser or via API:

```
GET /api/health/mongodb
```

This endpoint provides:
- Connection status
- Database statistics
- Collection information
- Environment variable status
- Detailed error information if connection fails

### 3. Admin Dashboard
Access the admin dashboard to see real-time MongoDB status:

```
/platform/admin/dashboard
```

The dashboard now includes a MongoDB Status component that shows:
- Connection status (🟢 Connected / 🔴 Disconnected)
- Environment information
- Collection counts
- Last update timestamp
- Refresh button for manual status updates

## 🚨 Common Production Issues

### Issue 1: MONGODB_URI Not Set
**Symptoms:**
- Connection fails immediately
- Error: "MONGODB_URI environment variable is not set"

**Solutions:**
1. Check your environment variables in production
2. Ensure MONGODB_URI is properly set in your deployment platform
3. For Vercel: Add to Environment Variables in project settings
4. For other platforms: Check your deployment configuration

### Issue 2: Network Access Denied
**Symptoms:**
- Connection timeout
- Error: "ECONNREFUSED" or "ENOTFOUND"

**Solutions:**
1. **MongoDB Atlas:**
   - Check IP whitelist in Atlas dashboard
   - Add your server's IP address to allowed list
   - Or add `0.0.0.0/0` for all IPs (less secure)

2. **Local MongoDB:**
   - Ensure MongoDB service is running
   - Check if port 27017 is accessible
   - Verify firewall settings

### Issue 3: Authentication Failed
**Symptoms:**
- Error: "Authentication failed"
- Error: "Invalid credentials"

**Solutions:**
1. Check username/password in connection string
2. Ensure user has proper permissions
3. Verify database name is correct
4. Check if user exists in the correct database

### Issue 4: Database Not Found
**Symptoms:**
- Connection succeeds but queries fail
- Error: "Database not found"

**Solutions:**
1. Verify MONGODB_DB environment variable
2. Ensure database exists
3. Check if user has access to the database

## 🔧 Enhanced Logging Features

### Connection Logging
The enhanced MongoDB connection now includes:

```typescript
// Enhanced logging with timestamps and environment info
ℹ️ [2024-01-15T10:30:00.000Z] [production] MongoDB: Initializing MongoDB connection...
ℹ️ [2024-01-15T10:30:00.000Z] [production] MongoDB: URI: mongodb+srv://user:pass@cluster...
ℹ️ [2024-01-15T10:30:00.000Z] [production] MongoDB: Database: yaadfeed
✅ [2024-01-15T10:30:01.000Z] [production] MongoDB: Connected to MongoDB server successfully!
```

### API Route Logging
News API routes now include detailed logging:

```typescript
📰 [NEWS API] Starting news fetch request...
📰 [NEWS API] Connection status: { isConnected: true, hasClient: true, ... }
📰 [NEWS API] Query parameters: { category: 'politics', limit: '10' }
📰 [NEWS API] Successfully fetched 10 articles in 150ms
```

### Error Logging
Detailed error information is logged:

```typescript
❌ [2024-01-15T10:30:00.000Z] [production] MongoDB: MongoDB connection failed: ECONNREFUSED
❌ [2024-01-15T10:30:00.000Z] [production] MongoDB: Error details: { code: 'ECONNREFUSED', ... }
⚠️ [2024-01-15T10:30:00.000Z] [production] MongoDB: Environment variables check:
⚠️ [2024-01-15T10:30:00.000Z] [production] MongoDB: - NODE_ENV: production
⚠️ [2024-01-15T10:30:00.000Z] [production] MongoDB: - MONGODB_URI: set
```

## 🛠️ Debugging Commands

### 1. Test Connection Script
```bash
# Test MongoDB connection
npm run test:mongodb

# Or run directly
node scripts/test-mongodb-connection.js
```

### 2. Check Environment Variables
```bash
# Check if environment variables are loaded
echo $MONGODB_URI
echo $MONGODB_DB
echo $NODE_ENV
```

### 3. Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:4000/api/health/mongodb

# Test news endpoint
curl http://localhost:4000/api/news
```

## 📊 Monitoring in Production

### 1. Log Monitoring
Monitor your application logs for MongoDB-related messages:
- Look for connection success/failure messages
- Monitor query performance
- Watch for authentication errors

### 2. Health Checks
Set up automated health checks:
- Monitor `/api/health/mongodb` endpoint
- Set up alerts for connection failures
- Track response times

### 3. Dashboard Monitoring
Use the admin dashboard to:
- Monitor real-time connection status
- Track collection sizes
- Monitor database performance

## 🔒 Security Considerations

### Environment Variables
- Never commit MONGODB_URI to version control
- Use environment variables for all sensitive data
- Rotate database passwords regularly

### Network Security
- Use MongoDB Atlas for production (recommended)
- Configure IP whitelist properly
- Use SSL/TLS connections
- Consider VPC peering for enhanced security

### Access Control
- Use dedicated database users with minimal permissions
- Avoid using admin accounts for application connections
- Regularly audit database access

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the logs:** Look for detailed error messages in your application logs
2. **Test connection:** Run `npm run test:mongodb` and share the output
3. **Check environment:** Verify all environment variables are set correctly
4. **Review network:** Ensure network connectivity to MongoDB
5. **Contact support:** If using MongoDB Atlas, check their status page

## 🔄 Troubleshooting Checklist

- [ ] Environment variables are set correctly
- [ ] MongoDB service is running (if local)
- [ ] Network connectivity is established
- [ ] Authentication credentials are correct
- [ ] Database exists and is accessible
- [ ] User has proper permissions
- [ ] IP address is whitelisted (if using Atlas)
- [ ] Connection string format is correct
- [ ] No firewall blocking the connection
- [ ] SSL/TLS settings are correct (if required)

---

**Remember:** The enhanced logging will help you identify the exact issue. Always check the logs first when troubleshooting MongoDB connection problems.
