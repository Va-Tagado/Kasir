'use client';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function ReceiptPreview({ data, onClose }: { data: any; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ content: () => ref.current });

  const downloadPdf = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('ApexPOS - Struk Pembelian', 10, 15);
    doc.setFontSize(10);
    let y = 25;
    data.items?.forEach((item: any) => {
      doc.text(`${item.name} x${item.qty} - Rp ${(item.price * item.qty).toLocaleString()}`, 10, y);
      y += 6;
    });
    doc.text(`Total: Rp ${data.total.toLocaleString()}`, 10, y + 4);
    doc.save(`struk-${Date.now()}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        {/* Pratinjau struk */}
        <div ref={ref} className="p-4 border text-xs space-y-1">
          <h2 className="text-center font-bold">ApexPOS</h2>
          <p className="text-center">{new Date().toLocaleString()}</p>
          <hr />
          {data.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between">
              <span>{item.name} x{item.qty}</span>
              <span>Rp {(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <hr />
          <div className="flex justify-between font-bold"><span>Total</span><span>Rp {data.total.toLocaleString()}</span></div>
          {data.payments?.map((p: any, i: number) => (
            <div key={i} className="flex justify-between text-gray-500"><span>{p.method}</span><span>Rp {p.amount.toLocaleString()}</span></div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">Cetak</button>
          <button onClick={downloadPdf} className="flex-1 border py-2 rounded-lg">Unduh PDF</button>
          <button onClick={onClose} className="px-4 border py-2 rounded-lg">Tutup</button>
        </div>
      </div>
    </div>
  );
}
