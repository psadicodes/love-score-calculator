
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { EmojiData } from '@/types/chat';

interface EmojiChartProps {
  data: EmojiData[];
}

const EmojiChart = ({ data }: EmojiChartProps) => {
  const colors = ['#ec4899', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
  
  const topEmojis = data
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item, index) => ({
      ...item,
      color: colors[index % colors.length]
    }));

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Emoji Analysis</h2>
        <p className="text-gray-600">
          What do their emoji choices reveal? Hearts and fire emojis are good signs! 🔥❤️
        </p>
      </div>
      
      <div className="h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topEmojis} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#666" />
            <YAxis 
              type="category" 
              dataKey="emoji" 
              stroke="#666"
              width={60}
              fontSize={24}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} times`, 'Used']}
              labelFormatter={(emoji) => `${emoji}`}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {topEmojis.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {topEmojis.slice(0, 5).map((emoji, index) => (
          <div key={emoji.emoji} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">{emoji.emoji}</div>
            <div className="text-sm text-gray-600">Used {emoji.count} times</div>
            <div className="text-xs text-gray-500">by {emoji.sender}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmojiChart;
