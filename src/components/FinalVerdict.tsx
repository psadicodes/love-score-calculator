import { Card } from '@/components/ui/card';
import { Heart, TrendingUp, TrendingDown, Meh, Sparkles } from 'lucide-react';
import { ChatData } from '@/types/chat';

interface FinalVerdictProps {
  chatData: ChatData;
}

const FinalVerdict = ({ chatData }: FinalVerdictProps) => {
  const { loveScore, avgReplyTime, participants, messageCountByUser } = chatData;
  
  const getVerdictIcon = () => {
    if (loveScore >= 90) return <Sparkles className="h-16 w-16 text-yellow-400 animate-pulse" />;
    if (loveScore >= 75) return <Heart className="h-16 w-16 text-red-500 animate-pulse" />;
    if (loveScore >= 50) return <TrendingUp className="h-16 w-16 text-orange-500" />;
    if (loveScore >= 25) return <Meh className="h-16 w-16 text-yellow-500" />;
    return <TrendingDown className="h-16 w-16 text-gray-500" />;
  };

  const getVerdictText = () => {
    if (loveScore >= 90) return "It's a perfect match! ✨";
    if (loveScore >= 75) return "Sparks are flying! 🔥";
    if (loveScore >= 60) return "Strong romantic potential! 💕";
    if (loveScore >= 40) return "There's something there... 🤔";
    if (loveScore >= 20) return "Mixed signals detected 📱";
    return "Maybe just friends 😅";
  };

  const getVerdictDescription = () => {
    if (loveScore >= 90) return `With an average reply time of ${avgReplyTime} minutes and a near-perfect balance of messages, the data points to a deep, mutual connection. This is what digital romance dreams are made of!`;
    if (loveScore >= 75) return "Quick replies, balanced conversation, and consistent engagement. All signs point to a strong, budding romance!";
    if (loveScore >= 60) return "You're both showing genuine interest with your communication patterns. The vibes are definitely positive.";
    if (loveScore >= 40) return "Some positive indicators, but the signals are mixed. It might be worth a deeper look.";
    if (loveScore >= 20) return "The engagement patterns are a bit lukewarm. Proceed with friendly caution.";
    const [p1, p2] = participants;
    const p1Count = messageCountByUser[p1] || 0;
    const p2Count = messageCountByUser[p2] || 0;
    const moreActiveUser = p1Count > p2Count ? p1.split(' ')[0] : p2.split(' ')[0];
    return `The data suggests one person (${moreActiveUser}) might be more invested. It might be time to move on.`;
  };

  const getBackgroundGradient = () => {
    if (loveScore >= 90) return "from-yellow-100 via-pink-100 to-red-100";
    if (loveScore >= 75) return "from-red-100 via-pink-100 to-purple-100";
    if (loveScore >= 50) return "from-orange-100 via-yellow-100 to-pink-100";
    if (loveScore >= 25) return "from-yellow-100 via-gray-100 to-blue-100";
    return "from-gray-100 via-blue-100 to-purple-100";
  };

  return (
    <Card className={`p-8 text-center bg-gradient-to-br ${getBackgroundGradient()} border-2`}>
      <div className="mb-6">
        {getVerdictIcon()}
      </div>
      
      <div className="mb-4">
        <h2 className="text-3xl font-bold mb-2">Final Verdict</h2>
        <div className="text-6xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          {loveScore}%
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {getVerdictText()}
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {getVerdictDescription()}
        </p>
      </div>
      
      <div className="bg-white/50 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-gray-700 italic">
          "Love is not just about the numbers, but the numbers don't lie either! 📊💕"
        </p>
      </div>
    </Card>
  );
};

export default FinalVerdict;
