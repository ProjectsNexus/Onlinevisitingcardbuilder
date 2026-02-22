import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Download, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string;
  cardName: string;
}

export function QRCodeModal({ open, onOpenChange, cardId, cardName }: QRCodeModalProps) {
  const cardUrl = `${window.location.origin}/card/${cardId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `${cardName}-qrcode.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success('QR code downloaded!');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Card</DialogTitle>
          <DialogDescription>
            Scan the QR code or share the link to view this card
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center p-6 bg-white border rounded-lg">
            <QRCodeSVG
              id="qr-code-svg"
              value={cardUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Shareable Link:</p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <input
                type="text"
                value={cardUrl}
                readOnly
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleCopyLink} className="flex-1 gap-2">
              <LinkIcon size={16} />
              Copy Link
            </Button>
            <Button onClick={handleDownloadQR} variant="outline" className="flex-1 gap-2">
              <Download size={16} />
              Download QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
