
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, TrendingUp, MessageSquare, Clock, Target } from 'lucide-react';
import { ChatData } from '@/types/chat';
import ReplyTimeChart from '@/components/charts/ReplyTimeChart';
import EmojiChart from '@/components/charts/EmojiChart';
import WordChart from '@/components/charts/WordChart';
import ActivityHeatmap from '@/components/charts/ActivityHeatmap';
import FinalVerdict from '@/components/FinalVerdict';

interface DashboardProps {
  chatData: ChatData;
  onReset: () => void;
}

const Dashboard = ({ chatData, onReset }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onReset}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Upload
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  Love Detector Results
                </h1>
                <p className="text-sm text-gray-600">
                  Analyzing {chatData.totalMessages} messages between {chatData.participants.join(' & ')}
                </p>
              </div>
            </div>
            <Heart className="h-8 w-8 text-red-500 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reply-times" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Reply Times
            </TabsTrigger>
            <TabsTrigger value="emojis" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Emojis
            </TabsTrigger>
            <TabsTrigger value="words" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Words
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <FinalVerdict chatData={chatData} />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Messages</p>
                    <p className="text-2xl font-bold">{chatData.totalMessages}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Reply Time</p>
                    <p className="text-2xl font-bold">{chatData.avgReplyTime}min</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-500" />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Emojis</p>
                    <p className="text-2xl font-bold">{chatData.totalEmojis}</p>
                  </div>
                  <Heart className="h-8 w-8 text-pink-500" />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Love Score</p>
                    <p className="text-2xl font-bold text-red-500">{chatData.loveScore}%</p>
                  </div>
                  <Target className="h-8 w-8 text-red-500" />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reply-times">
            <ReplyTimeChart data={chatData.replyTimes} />
          </TabsContent>

          <TabsContent value="emojis">
            <EmojiChart data={chatData.emojiFrequency} />
          </TabsContent>

          <TabsContent value="words">
            <WordChart data={chatData.wordFrequency} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityHeatmap data={chatData.hourlyActivity} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
