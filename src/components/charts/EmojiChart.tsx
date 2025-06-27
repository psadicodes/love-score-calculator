import { Card } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { EmojiData } from '@/types/chat';

interface EmojiChartProps {
  data: EmojiData[];
}

const EmojiChart = ({ data }: EmojiChartProps) => {
  const SENDER_COLORS: { [key: string]: string } = {
    [data[0]?.sender]: '#ec4899',
    [data[1]?.sender]: '#8b5cf6'
  };

  const topEmojisData = data
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const participants = [...new Set(topEmojisData.map(d => d.sender))];

  const chartData = participants.map(p => ({
    name: p,
    data: topEmojisData.filter(d => d.sender === p)
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
          <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="count"
              name="Usage Count"
              stroke="#666"
              label={{ value: 'Usage Count', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="category" 
              dataKey="emoji" 
              stroke="#666"
              width={80}
              fontSize={18}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: any, name: string) => {
                if (name === 'Usage Count') return `${value} times`;
                return value;
              }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }}/>
            {chartData.map(series => (
              <Scatter 
                key={series.name}
                name={series.name.split(' ')[0]} 
                data={series.data} 
                fill={SENDER_COLORS[series.name] || '#8884d8'} 
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {topEmojisData.slice(0, 5).map((emoji) => (
          <div key={`${emoji.emoji}-${emoji.sender}`} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">{emoji.emoji}</div>
            <div className="text-sm text-gray-600">Used {emoji.count} times</div>
            <div className="text-xs text-gray-500">by {emoji.sender.split(' ')[0]}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmojiChart;
