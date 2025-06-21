
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ReplyTimeData } from '@/types/chat';

interface ReplyTimeChartProps {
  data: ReplyTimeData[];
}

const ReplyTimeChart = ({ data }: ReplyTimeChartProps) => {
  // Calculate trend line
  const trendData = data.map((item, index) => ({
    ...item,
    trend: data.slice(0, index + 1).reduce((sum, curr) => sum + curr.replyTime, 0) / (index + 1)
  }));

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Reply Time Analysis</h2>
        <p className="text-gray-600">
          Track how quickly they respond to your messages over time. 
          A downward trend means they're getting more interested! 💕
        </p>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="messageIndex" 
              stroke="#666"
              label={{ value: 'Message Number', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              stroke="#666"
              label={{ value: 'Reply Time (minutes)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)} minutes`,
                name === 'replyTime' ? 'Reply Time' : 'Average Trend'
              ]}
              labelFormatter={(label) => `Message #${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="replyTime" 
              stroke="#ec4899" 
              strokeWidth={2}
              dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
              name="Reply Time"
            />
            <Line 
              type="monotone" 
              dataKey="trend" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Trend"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-pink-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Fastest Reply</p>
          <p className="text-xl font-bold text-pink-600">
            {Math.min(...data.map(d => d.replyTime)).toFixed(1)}min
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Slowest Reply</p>
          <p className="text-xl font-bold text-purple-600">
            {Math.max(...data.map(d => d.replyTime)).toFixed(1)}min
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Average</p>
          <p className="text-xl font-bold text-red-600">
            {(data.reduce((sum, d) => sum + d.replyTime, 0) / data.length).toFixed(1)}min
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ReplyTimeChart;
