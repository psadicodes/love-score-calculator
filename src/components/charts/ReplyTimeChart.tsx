import { Card } from '@/components/ui/card';
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ReplyTimeData } from '@/types/chat';

interface ReplyTimeChartProps {
  data: ReplyTimeData[];
}

const ReplyTimeChart = ({ data }: ReplyTimeChartProps) => {
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Reply Time Analysis</h2>
        <p className="text-gray-600 mb-4">
          No reply time data available to display. This usually means the chat is one-sided or contains no back-and-forth conversation.
        </p>
      </Card>
    );
  }

  const participants = [...new Set(data.map(d => d.sender))];
  const COLORS = ['#ec4899', '#8b5cf6', '#8884d8', '#82ca9d'];

  const chartData = participants.map(p => ({
    name: p,
    data: data.filter(d => d.sender === p)
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
          <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number"
              dataKey="messageIndex" 
              name="Message Number"
              stroke="#666"
              label={{ value: 'Message Number', position: 'insideBottom', offset: -10 }}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis 
              type="number"
              dataKey="replyTime"
              name="Reply Time (min)"
              stroke="#666"
              label={{ value: 'Reply Time (minutes)', angle: -90, position: 'insideLeft', offset: -25, style: { textAnchor: 'middle' } }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: any, name: any) => {
                if (name === 'Reply Time (min)') return `${(value as number).toFixed(1)} minutes`;
                return value;
              }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }}/>
            {chartData.map((series, index) => (
              <Scatter 
                key={series.name}
                name={series.name.split(' ')[0]} 
                data={series.data} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
            {chartData.map((series, index) => (
              <Line
                key={`line-${series.name}`}
                data={series.data}
                dataKey="replyTime"
                type="monotone"
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                legendType="none"
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {data.length > 0 && (
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
      )}
    </Card>
  );
};

export default ReplyTimeChart;
