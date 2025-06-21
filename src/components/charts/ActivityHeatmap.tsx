
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlyActivity } from '@/types/chat';

interface ActivityHeatmapProps {
  data: HourlyActivity[];
}

const ActivityHeatmap = ({ data }: ActivityHeatmapProps) => {
  // Group data by hour and aggregate
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourData = data.filter(d => d.hour === hour);
    return {
      hour,
      totalMessages: hourData.reduce((sum, d) => sum + d.count, 0),
      timeLabel: `${hour.toString().padStart(2, '0')}:00`
    };
  });

  const maxMessages = Math.max(...hourlyData.map(d => d.totalMessages));

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Activity Heatmap</h2>
        <p className="text-gray-600">
          When are you both most active? Peak hours might reveal their free time and priorities.
        </p>
      </div>
      
      <div className="h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timeLabel" 
              stroke="#666"
              interval={1}
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              label={{ value: 'Messages', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} messages`, 'Total']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Bar 
              dataKey="totalMessages" 
              fill="#ec4899"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-pink-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Most Active Hour</p>
          <p className="text-xl font-bold text-pink-600">
            {hourlyData.reduce((max, curr) => 
              curr.totalMessages > max.total ? { hour: curr.timeLabel, total: curr.totalMessages } : max, 
              { hour: '00:00', total: 0 }
            ).hour}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Peak Messages</p>
          <p className="text-xl font-bold text-purple-600">{maxMessages}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Late Night Chats</p>
          <p className="text-xl font-bold text-red-600">
            {hourlyData.filter(d => d.hour >= 22 || d.hour <= 2).reduce((sum, d) => sum + d.totalMessages, 0)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ActivityHeatmap;
