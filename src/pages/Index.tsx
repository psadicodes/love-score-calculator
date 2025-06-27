import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Upload, Heart, BarChart3, MessageCircle, GitCommit, Bot, TrendingUp } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import { ChatData } from '@/types/chat';
import { handleChatParsing } from '@/pages/api/parse-chat';

const Index = () => {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await handleChatParsing(file);
      setChatData(data);
    } catch (err) {
      console.error('Error parsing chat:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred during analysis.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (chatData) {
    return <Dashboard chatData={chatData} onReset={() => setChatData(null)} />;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#fbe2e3,transparent)]"></div>
      </div>
       <Heart className="absolute top-[10%] left-[5%] h-24 w-24 text-pink-500/10 -rotate-12 animate-pulse" />
       <MessageCircle className="absolute top-[20%] right-[10%] h-20 w-20 text-violet-500/10 rotate-12 animate-pulse delay-500" />
       <Bot className="absolute bottom-[15%] left-[15%] h-28 w-28 text-fuchsia-500/10 animate-pulse delay-1000" />
       <TrendingUp className="absolute bottom-[25%] right-[20%] h-16 w-16 text-primary/5 animate-pulse delay-700" />


      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 gap-12">

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-br from-pink-600 to-violet-600 bg-clip-text text-transparent">
              Is It Love or Just... Data?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Stop guessing and start analyzing. Upload your WhatsApp chat history and let our AI-powered analysis reveal the true potential of your connection.
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto w-full p-6 md:p-8 bg-white/40 backdrop-blur-sm border-white/20 shadow-lg">
             <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
             {error && (
                <div className="mt-4 text-center text-red-500 bg-red-100 p-3 rounded-lg">
                    <p className="font-bold">Analysis Failed</p>
                    <p className="text-sm">{error}</p>
                </div>
             )}
          </Card>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 text-pink-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Deep Analysis</h3>
              <p className="text-sm text-muted-foreground">Go beyond words. We analyze reply times, emoji usage, and conversation flow.</p>
            </div>
            
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-violet-100 text-violet-600">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">The Love Score</h3>
              <p className="text-sm text-muted-foreground">Get a data-driven percentage that represents the potential of your connection.</p>
            </div>
            
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-fuchsia-100 text-fuchsia-600">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">AI-Powered Verdict</h3>
              <p className="text-sm text-muted-foreground">Receive a final verdict from our AI, complete with an explanation.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>
          Made with ❤️ by{' '}
          <a href="https://www.instagram.com/developer_rahul_" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary transition-colors">
            Developer Rahul
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
