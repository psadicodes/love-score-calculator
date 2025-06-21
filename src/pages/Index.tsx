
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Heart, BarChart3, MessageCircle } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import { ChatData } from '@/types/chat';
import { handleChatParsing } from '@/pages/api/parse-chat';

const Index = () => {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      const data = await handleChatParsing(file);
      setChatData(data);
    } catch (error) {
      console.error('Error parsing chat:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (chatData) {
    return <Dashboard chatData={chatData} onReset={() => setChatData(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50">
      {/* Header */}
      <header className="pt-8 pb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="h-8 w-8 text-red-500 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Love Detector v2
          </h1>
          <Heart className="h-8 w-8 text-red-500 animate-pulse" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Can Math Prove They Like You? Let's Find Out.
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upload your WhatsApp chat. We'll do the rest.
          </h2>
          <p className="text-gray-600 mb-8">
            Our advanced algorithms analyze reply times, emoji usage, and conversation patterns to determine if your crush is into you. 
            It's like having a relationship scientist in your pocket! 💕
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h3 className="font-semibold mb-2">Reply Time Analysis</h3>
            <p className="text-sm text-gray-600">Track response patterns and calculate engagement levels</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-pink-500" />
            <h3 className="font-semibold mb-2">Emoji & Word Analysis</h3>
            <p className="text-sm text-gray-600">Discover hidden meanings in their favorite emojis and words</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="font-semibold mb-2">Love Probability</h3>
            <p className="text-sm text-gray-600">Get a final verdict based on mathematical analysis</p>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="p-8 mb-8 bg-white/70 backdrop-blur">
          <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="font-semibold mb-3 text-blue-800">How to export your WhatsApp chat:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Open your WhatsApp chat with your crush</li>
            <li>2. Tap the three dots (⋮) → More → Export chat</li>
            <li>3. Choose "Without Media" and save the .txt file</li>
            <li>4. Upload it here and let science work its magic! 🧪</li>
          </ol>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>Made with ❤️ for the hopelessly romantic and analytically curious</p>
      </footer>
    </div>
  );
};

export default Index;
