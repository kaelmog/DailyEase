'use client';

import { useEffect, useState } from 'react';
import { Copy, MessageSquare } from 'lucide-react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import { generateSalesReportMessage, generateLeftoversReportMessage } from '@/utils/reports';

export default function ReviewModal({
  open,
  setOpen,
  reportType,
  item,
  salesData,
  productSummary,
  product_categories,
  leftoversByCategory,
}) {
  const [reportText, setReportText] = useState('Loading report...');

  useEffect(() => {
    if (!open) return;

    async function fetchReport() {
      try {
        let text = '';

        if (reportType === 'sales') {
          text = generateSalesReportMessage(item.date, salesData, productSummary);
        }

        const categoryName = product_categories.map((item) => item.name);

        if (reportType === 'leftovers') {
          text = generateLeftoversReportMessage(
            item.date,
            product_categories,
            categoryName,
            leftoversByCategory
          );
        }

        setReportText(text);
      } catch (err) {
        setReportText('⚠️ Failed to generate report: ' + err.message);
      }
    }

    fetchReport();
  }, [open, reportType, salesData, item, productSummary, product_categories, leftoversByCategory]);

  const handleCopy = async () => {
    try {
      if (typeof window === 'undefined') return;

      if (!navigator.clipboard) {
        const textarea = document.createElement('textarea');
        textarea.value = reportText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        alert('Pesan berhasil disalin ke clipboard!');
        return;
      }

      await navigator.clipboard.writeText(reportText);
      alert('Pesan berhasil disalin ke clipboard!');
    } catch (err) {
      console.error('Clipboard error:', err);

      const textarea = document.createElement('textarea');
      textarea.value = reportText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      alert('Pesan berhasil disalin ke clipboard!');
    }
  };

  const handleShare = () => {
    const text = encodeURIComponent(reportText);

    const mobileURL = `whatsapp://send?text=${text}`;

    const webURL = `https://api.whatsapp.com/send?text=${text}`;

    window.location.href = mobileURL;

    setTimeout(() => {
      window.open(webURL, '_blank');
    }, 500);
  };

  return (
    <Modal
      title={reportType === 'sales' ? 'Review Sales Report' : 'Review Leftovers Report'}
      open={open}
      onClose={() => setOpen(false)}
    >
      <pre className="text-sm text-left text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
        {reportText}
      </pre>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <Button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-500 text-white font-medium rounded-lg h-10 sm:text-sm"
        >
          <Copy size={16} /> Salin
        </Button>

        <Button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 active:bg-green-500 text-white font-medium rounded-lg h-10 sm:text-sm"
        >
          <MessageSquare size={16} /> WA
        </Button>
      </div>
    </Modal>
  );
}
