'use client';

import { useState, useEffect } from 'react';
import { Vote } from '@/lib/supabase';
import StatsCards from '@/components/admin/StatsCards';
import AdminVotesTable from '@/components/admin/AdminVotesTable';
import ClearAllDialog from '@/components/admin/ClearAllDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function AdminPage() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchVotes = async () => {
    try {
      setError(null);
      const res = await fetch('/api/admin/votes');
      if (!res.ok) {
        throw new Error('Failed to fetch votes');
      }
      const data = await res.json();
      setVotes(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load votes');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    const res = await fetch('/api/admin/votes?confirm=true', {
      method: 'DELETE',
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to clear votes');
    }

    await fetchVotes(); // Refresh the list
  };

  // Auto-refresh every 10 seconds
  useEffect(() => {
    fetchVotes();
    const interval = setInterval(fetchVotes, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Trash or Treasure - Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Manage all votes and view statistics
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last refreshed: {lastRefresh.toLocaleTimeString()} (auto-refresh every 10s)
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="mb-8">
          <StatsCards votes={votes} />
        </div>

        <Separator className="my-8" />

        {/* Table Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">All Votes</h2>
          <Button
            variant="outline"
            onClick={() => fetchVotes()}
            className="ml-auto"
          >
            🔄 Refresh Now
          </Button>
        </div>

        {/* Votes Table */}
        <div className="mb-8">
          <AdminVotesTable votes={votes} onVotesChange={setVotes} />
        </div>

        <Separator className="my-8" />

        {/* Clear All Button */}
        <div className="flex justify-center py-8">
          <Button
            variant="destructive"
            size="lg"
            onClick={() => setClearDialogOpen(true)}
            disabled={votes.length === 0}
          >
            🔴 Clear All Data
          </Button>
        </div>

        {/* Clear All Dialog */}
        <ClearAllDialog
          isOpen={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
          onConfirm={handleClearAll}
        />
      </div>
    </div>
  );
}
