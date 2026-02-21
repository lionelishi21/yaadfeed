'use client';

// Force dynamic rendering for admin cron page
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import ClientHeader from '@/components/ClientHeader';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

export default function AdminCronPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [hasSecret, setHasSecret] = useState<boolean>(false);
  const [token, setToken] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const s = await fetch('/api/admin/cron/settings', { cache: 'no-store' }).then(r => r.json());
      setSchedule(s.schedule || '');
      setSiteUrl(s.siteUrl || '');
      setHasSecret(!!s.hasSecret);
      const l = await fetch('/api/admin/cron/logs?limit=50', { cache: 'no-store' }).then(r => r.json());
      setLogs(l.logs || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const trigger = async () => {
    if (!token) {
      alert('Enter CRON secret token to trigger');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cron/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      alert(res.ok ? 'Triggered successfully' : `Failed: ${data.error || 'unknown'}`);
      await load();
    } finally {
      setLoading(false);
    }
  };

  const saveSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cron/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`Failed: ${data.error || 'unknown'}`);
      } else {
        alert('Saved');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ClientHeader />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Cron & Scraper Control</h1>

        <div className="grid gap-6">
          <div className="p-4 rounded-lg border">
            <h2 className="font-semibold mb-3">Settings</h2>
            <div className="text-sm text-gray-600 mb-2">Site URL: {siteUrl || 'unset'}</div>
            <div className="text-sm text-gray-600 mb-4">Has Secret: {hasSecret ? 'Yes' : 'No'}</div>
            <div className="flex gap-2 items-center mb-3">
              <label className="w-36 text-sm text-gray-700">Cron schedule</label>
              <input className="border rounded px-3 py-2 flex-1" value={schedule} onChange={e => setSchedule(e.target.value)} placeholder="e.g. 0 */4 * * *" />
              <Button onClick={saveSchedule} disabled={loading}>Save</Button>
            </div>
            <div className="text-xs text-gray-500">Note: Changing schedule here stores preference; updating actual Vercel cron still requires a deploy.</div>
          </div>

          <div className="p-4 rounded-lg border">
            <h2 className="font-semibold mb-3">Manual Trigger</h2>
            <div className="flex gap-2 items-center mb-3">
              <label className="w-36 text-sm text-gray-700">CRON Secret</label>
              <input className="border rounded px-3 py-2 flex-1" value={token} onChange={e => setToken(e.target.value)} placeholder="Enter CRON_SECRET" />
              <Button onClick={trigger} disabled={loading}>Trigger Now</Button>
            </div>
          </div>

          <div className="p-4 rounded-lg border">
            <h2 className="font-semibold mb-3">Recent Logs</h2>
            <div className="space-y-3 max-h-[480px] overflow-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="text-sm border rounded p-3">
                  <div className="flex justify-between mb-1">
                    <div className="font-medium">{log.type || 'run'}</div>
                    <div className="text-gray-500">{new Date(log.createdAt).toLocaleString()}</div>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(log.response || log, null, 2)}</pre>
                </div>
              ))}
              {logs.length === 0 && <div className="text-sm text-gray-500">No logs yet</div>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


