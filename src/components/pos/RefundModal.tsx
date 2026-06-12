'use client';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function RefundModal({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold">Retur / Refund</h3>
          <button onClick={onClose}><FiX /></button>
        </div>
        <div className="p-4">
          <label className="block text-sm mb-1">Alasan retur</label>
          <textarea className="w-full p-2 border rounded dark:bg-gray-800" rows={3} value={reason} onChange={e => setReason(e.target.value)} />
        </div>
        <div className="p-4 border-t flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 border rounded-lg">Batal</button>
          <button onClick={() => onSubmit(reason)} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Proses Retur</button>
        </div>
      </div>
    </div>
  );
}
