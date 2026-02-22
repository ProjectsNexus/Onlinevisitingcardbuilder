import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CreditCard, Palette, QrCode, BarChart3, Share2, Cloud } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl">CardLink</h1>
                <p className="text-xs text-gray-600">Digital Visiting Cards</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl mb-4">
            Your Digital Business Card, <span className="text-blue-600">Reimagined</span>
          </h1>
          <p className="text-xl text-gray-600">
            Create beautiful, interactive digital visiting cards with drag-and-drop editing, 
            QR codes, and cloud storage. Share your professional identity anywhere, anytime.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/signup')} className="gap-2">
              <CreditCard size={18} />
              Create Your Card Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Everything You Need</h2>
          <p className="text-gray-600 text-lg">
            Powerful features to create and share your digital identity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Palette className="text-blue-600" size={24} />
            </div>
            <h3 className="mb-2">12+ Beautiful Templates</h3>
            <p className="text-sm text-gray-600">
              Choose from professional, creative, and luxury designs. Customize colors to match your brand.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="text-green-600" size={24} />
            </div>
            <h3 className="mb-2">Drag & Drop Editor</h3>
            <p className="text-sm text-gray-600">
              Reposition elements and adjust font sizes with an intuitive visual editor. No design skills needed.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <QrCode className="text-purple-600" size={24} />
            </div>
            <h3 className="mb-2">QR Code Generation</h3>
            <p className="text-sm text-gray-600">
              Generate scannable QR codes instantly. Download and print or share digitally.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Cloud className="text-orange-600" size={24} />
            </div>
            <h3 className="mb-2">Cloud Storage</h3>
            <p className="text-sm text-gray-600">
              Your cards are safely stored in the cloud. Access from any device, anytime.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Share2 className="text-pink-600" size={24} />
            </div>
            <h3 className="mb-2">Easy Sharing</h3>
            <p className="text-sm text-gray-600">
              Share via link, QR code, or social media. Recipients can view without signing up.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="text-cyan-600" size={24} />
            </div>
            <h3 className="mb-2">Analytics Tracking</h3>
            <p className="text-sm text-gray-600">
              Track views, shares, and downloads. See how your card is performing.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
          <h2 className="text-white mb-4">Ready to Go Digital?</h2>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of professionals using CardLink for their digital visiting cards.
            Create your first card in minutes.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/signup')} className="gap-2">
            <CreditCard size={18} />
            Get Started Free
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; 2026 CardLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
