'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ClearAllDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function ClearAllDialog({
  isOpen,
  onClose,
  onConfirm,
}: ClearAllDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (confirmText !== 'DELETE') return;

    setIsDeleting(true);
    try {
      await onConfirm();
      setConfirmText('');
      onClose();
    } catch (error) {
      console.error('Failed to delete all votes:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">⚠️ Clear All Data</DialogTitle>
          <DialogDescription className="space-y-4">
            <p className="font-semibold text-red-600">
              This will delete ALL votes permanently!
            </p>
            <p>This action cannot be undone. All vote data will be lost forever.</p>
            <p>Type <strong>DELETE</strong> below to confirm:</p>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            disabled={isDeleting}
            className="font-mono"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={confirmText !== 'DELETE' || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
