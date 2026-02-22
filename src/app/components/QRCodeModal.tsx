import { useState } from 'react';
import QRCode from 'qrcode.react';
import { Button } from './ui/button';
import { Download, Copy, X } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeModalProps {
  cardId: string;
  cardName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ cardId, cardName, isOpen, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate the share URL
  const shareUrl = `${window.location.origin}/card/${cardId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const qrElement = document.getElementById('qr-code');
    if (qrElement) {
      const canvas = qrElement.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${cardName}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('QR code downloaded!');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Share Your Card</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* QR Code */}
          <div className="flex justify-center" id="qr-code">
            <QRCode
              value={shareUrl}
              size={200}
              level="H"
              includeMargin={true}
              backgroundColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          {/* Share Info */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Scan this QR code or share the link below to let others view your card.
            </p>
            <div className="bg-gray-100 p-3 rounded-lg break-all">
              <p className="text-xs font-mono text-gray-700">{shareUrl}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button
              onClick={handleDownloadQR}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download QR
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
