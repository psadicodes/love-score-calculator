import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, TrendingUp, MessageSquare, Clock, Target, Camera, Bot, PieChart } from 'lucide-react';
import { ChatData } from '@/types/chat';
import ReplyTimeChart from '@/components/charts/ReplyTimeChart';
import EmojiChart from '@/components/charts/EmojiChart';
import WordChart from '@/components/charts/WordChart';
import ActivityHeatmap from '@/components/charts/ActivityHeatmap';
import FinalVerdict from '@/components/FinalVerdict';
import MessageDistributionChart from './charts/MessageDistributionChart';
import EmojiTrendChart from './charts/EmojiTrendChart';

interface DashboardProps {
  chatData: ChatData;
  onReset: () => void;
}

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: React.ElementType, color: string }) => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const Dashboard = ({ chatData, onReset }: DashboardProps) => {
  return (
    <div className="min-h-screen w-full">
      <header className="bg-white/60 backdrop-blur-lg border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-br from-pink-600 to-violet-600 bg-clip-text text-transparent">
                Analysis Report
              </h1>
              <p className="text-sm text-muted-foreground hidden md:block">
                {chatData.participants.join(' & ')}
              </p>
            </div>
            <Button variant="outline" onClick={onReset}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-[600px]">
              <TabsTrigger value="overview"><Target className="h-4 w-4 mr-2" />Overview</TabsTrigger>
              <TabsTrigger value="reply-times"><Clock className="h-4 w-4 mr-2" />Reply Times</TabsTrigger>
              <TabsTrigger value="emojis"><Heart className="h-4 w-4 mr-2" />Emojis</TabsTrigger>
              <TabsTrigger value="words"><MessageSquare className="h-4 w-4 mr-2" />Words</TabsTrigger>
              <TabsTrigger value="activity"><TrendingUp className="h-4 w-4 mr-2" />Activity</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <FinalVerdict chatData={chatData} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Messages" value={chatData.totalMessages} icon={MessageSquare} color="text-blue-500" />
              <StatCard title="Avg Reply Time" value={`${chatData.avgReplyTime} min`} icon={Clock} color="text-green-500" />
              <StatCard title="Media Count" value={chatData.mediaCount} icon={Camera} color="text-purple-500" />
              <StatCard title="Love Score" value={`${chatData.loveScore}%`} icon={Bot} color="text-pink-500" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <MessageDistributionChart data={chatData.messageCountByUser} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><PieChart className="h-5 w-5 mr-2" />Message Balance</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                    {chatData.participants.map(p => {
                      const total = chatData.totalMessages;
                      const count = chatData.messageCountByUser[p];
                      const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
                      return (
                        <div key={p}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-muted-foreground">{p.split(' ')[0]}</span>
                            <span className="text-sm font-medium">{percentage}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reply-times">
            <ReplyTimeChart data={chatData.replyTimes} />
          </TabsContent>

          <TabsContent value="emojis" className="space-y-6">
            <EmojiChart data={chatData.emojiFrequency} />
            <EmojiTrendChart data={chatData.dailyEmojiData} participants={chatData.participants} />
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
