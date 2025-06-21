
import { Card } from '@/components/ui/card';
import { Heart, TrendingUp, TrendingDown, Meh } from 'lucide-react';
import { ChatData } from '@/types/chat';

interface FinalVerdictProps {
  chatData: ChatData;
}

const FinalVerdict = ({ chatData }: FinalVerdictProps) => {
  const { loveScore } = chatData;
  
  const getVerdictIcon = () => {
    if (loveScore >= 75) return <Heart className="h-16 w-16 text-red-500 animate-pulse" />;
    if (loveScore >= 50) return <TrendingUp className="h-16 w-16 text-orange-500" />;
    if (loveScore >= 25) return <Meh className="h-16 w-16 text-yellow-500" />;
    return <TrendingDown className="h-16 w-16 text-gray-500" />;
  };

  const getVerdictText = () => {
    if (loveScore >= 80) return "They're totally into you! 🥰";
    if (loveScore >= 60) return "Strong romantic potential! 💕";
    if (loveScore >= 40) return "There's definitely something there... 🤔";
    if (loveScore >= 20) return "Mixed signals detected 📱";
    return "Time to move on, friend 😅";
  };

  const getVerdictDescription = () => {
    if (loveScore >= 80) return "Quick replies, lots of emojis, and consistent engagement - all the signs are there!";
    if (loveScore >= 60) return "They're showing genuine interest with their communication patterns.";
    if (loveScore >= 40) return "Some positive indicators, but the signals are mixed.";
    if (loveScore >= 20) return "Limited engagement patterns suggest lukewarm interest.";
    return "The data suggests they might not be as invested as you are.";
  };

  const getBackgroundGradient = () => {
    if (loveScore >= 75) return "from-red-100 via-pink-100 to-purple-100";
    if (loveScore >= 50) return "from-orange-100 via-yellow-100 to-pink-100";
    if (loveScore >= 25) return "from-yellow-100 via-orange-100 to-red-100";
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
