'use client';

import { useState } from 'react';
import { Vote } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminVotesTableProps {
  votes: Vote[];
  onVotesChange: (votes: Vote[]) => void;
}

interface EditingCell {
  rowId: number;
  field: keyof Pick<Vote, 'voter_name' | 'brought_candy' | 'hate_vote' | 'love_vote'>;
}

export default function AdminVotesTable({ votes, onVotesChange }: AdminVotesTableProps) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const [savingCell, setSavingCell] = useState<string | null>(null);
  const [flashCell, setFlashCell] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCellClick = (vote: Vote, field: EditingCell['field']) => {
    setEditingCell({ rowId: vote.id, field });
    setEditValue(vote[field]);
    setError(null);
  };

  const handleCellSave = async () => {
    if (!editingCell) return;

    const vote = votes.find(v => v.id === editingCell.rowId);
    if (!vote) return;

    const updatedVote = { ...vote, [editingCell.field]: editValue.trim() };
    const cellKey = `${editingCell.rowId}-${editingCell.field}`;

    setSavingCell(cellKey);
    setError(null);

    try {
      const res = await fetch(`/api/admin/votes/${editingCell.rowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voter_name: updatedVote.voter_name,
          brought_candy: updatedVote.brought_candy,
          hate_vote: updatedVote.hate_vote,
          love_vote: updatedVote.love_vote,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update vote');
      }

      // Update local state
      onVotesChange(votes.map(v => v.id === editingCell.rowId ? updatedVote : v));

      // Show success flash
      setFlashCell(cellKey);
      setTimeout(() => setFlashCell(null), 1000);

      setEditingCell(null);
      setEditValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      // Revert on error - keep editing mode
    } finally {
      setSavingCell(null);
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this vote? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/votes/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete vote');
      }

      // Remove from local state
      onVotesChange(votes.filter(v => v.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete vote');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderCell = (
    vote: Vote,
    field: EditingCell['field'],
    value: string
  ) => {
    const cellKey = `${vote.id}-${field}`;
    const isEditing = editingCell?.rowId === vote.id && editingCell?.field === field;
    const isSaving = savingCell === cellKey;
    const isFlashing = flashCell === cellKey;

    if (isEditing) {
      return (
        <div className="flex gap-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCellSave();
              if (e.key === 'Escape') handleCellCancel();
            }}
            onBlur={handleCellSave}
            autoFocus
            className="h-8 text-sm"
          />
        </div>
      );
    }

    return (
      <div
        className={`cursor-pointer hover:bg-accent/50 px-2 py-1 rounded transition-colors ${
          isFlashing ? 'bg-green-200 dark:bg-green-900' : ''
        }`}
        onClick={() => handleCellClick(vote, field)}
      >
        {isSaving ? (
          <span className="text-muted-foreground">Saving...</span>
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  };

  if (votes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No votes yet</p>
        <p className="text-sm mt-2">Votes will appear here once submitted</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-16">ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32">Created At</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Voter Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Brought Candy</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hate Vote</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Love Vote</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote) => (
              <tr
                key={vote.id}
                className="border-t hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-muted-foreground">{vote.id}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {formatDate(vote.created_at)}
                </td>
                <td className="px-4 py-3">{renderCell(vote, 'voter_name', vote.voter_name)}</td>
                <td className="px-4 py-3">{renderCell(vote, 'brought_candy', vote.brought_candy)}</td>
                <td className="px-4 py-3">{renderCell(vote, 'hate_vote', vote.hate_vote)}</td>
                <td className="px-4 py-3">{renderCell(vote, 'love_vote', vote.love_vote)}</td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(vote.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
