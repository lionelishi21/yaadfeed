'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';

interface ConnectionStatus {
  isConnected: boolean;
  hasClient: boolean;
  hasDb: boolean;
  uri: string;
  database: string;
}

interface TestResult {
  success: boolean;
  error?: string;
  details?: any;
}

interface MongoDBStatus {
  timestamp: string;
  environment: string;
  connection: {
    status: ConnectionStatus;
    test: TestResult;
  };
  database: {
    stats: any;
    collections: any;
  };
  environment_variables: {
    NODE_ENV: string;
    MONGODB_URI: string;
    MONGODB_DB: string;
  };
}

export default function MongoDBStatus() {
  const [status, setStatus] = useState<MongoDBStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/health/mongodb');
      const data = await response.json();
      
      if (response.ok) {
        setStatus(data);
      } else {
        setError(data.error || 'Failed to fetch MongoDB status');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (isConnected: boolean) => {
    return isConnected ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isConnected: boolean) => {
    return isConnected ? '🟢' : '🔴';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Checking MongoDB status...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-2">
          <span className="text-red-600">❌</span>
          <span className="text-red-600">Error: {error}</span>
        </div>
        <button 
          onClick={fetchStatus}
          className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card className="p-6">
        <span>No status data available</span>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">MongoDB Status</h3>
          <div className="flex items-center space-x-2">
            <span>{getStatusIcon(status.connection.test.success)}</span>
            <span className={getStatusColor(status.connection.test.success)}>
              {status.connection.test.success ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Connection Details</h4>
            <div className="space-y-1">
              <div>Environment: {status.environment}</div>
              <div>Database: {status.connection.status.database}</div>
              <div>URI: {status.connection.status.uri}</div>
              <div>Client: {status.connection.status.hasClient ? '✅' : '❌'}</div>
              <div>Database: {status.connection.status.hasDb ? '✅' : '❌'}</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Environment Variables</h4>
            <div className="space-y-1">
              <div>NODE_ENV: {status.environment_variables.NODE_ENV}</div>
              <div>MONGODB_URI: {status.environment_variables.MONGODB_URI}</div>
              <div>MONGODB_DB: {status.environment_variables.MONGODB_DB}</div>
            </div>
          </div>
        </div>

        {status.connection.test.error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <h4 className="font-medium text-red-800 mb-1">Connection Error</h4>
            <p className="text-red-700 text-sm">{status.connection.test.error}</p>
          </div>
        )}

        {status.database.collections && (
          <div>
            <h4 className="font-medium mb-2">Collections</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {Object.entries(status.database.collections).map(([name, count]) => (
                <div key={name} className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">{name}</div>
                  <div className="text-gray-600">{count} documents</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Last updated: {new Date(status.timestamp).toLocaleString()}
        </div>

        <button 
          onClick={fetchStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Refresh Status
        </button>
      </div>
    </Card>
  );
}
