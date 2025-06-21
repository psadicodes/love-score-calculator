import { ChatData, Message, EmojiData, WordData, ReplyTimeData, HourlyActivity } from '@/types/chat';

const parseWhatsAppChat = (content: string): ChatData => {
  const lines = content.split('\n').filter(line => line.trim());
  const messages: Message[] = [];
  
  // Updated WhatsApp message regex pattern to handle your format: [08/06/25, 10:47:07 PM]
  const messagePattern = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}:\d{2})\s+([AP]M)\]\s+([^:]+):\s*(.*)$/;
  
  let participants: string[] = [];
  
  console.log('Parsing chat with', lines.length, 'lines');
  
  for (const line of lines) {
    const match = line.match(messagePattern);
    if (match) {
      const [, date, time, ampm, sender, message] = match;
      
      console.log('Matched line:', { date, time, ampm, sender, message: message.substring(0, 50) });
      
      // Parse date and time - handle both 2-digit and 4-digit years
      const [day, month, year] = date.split('/');
      const [hour, minute, second] = time.split(':');
      let parsedHour = parseInt(hour);
      
      // Convert to 24-hour format
      if (ampm === 'PM' && parsedHour !== 12) {
        parsedHour += 12;
      } else if (ampm === 'AM' && parsedHour === 12) {
        parsedHour = 0;
      }
      
      // Handle 2-digit years (assume 20xx)
      const fullYear = year.length === 2 ? 2000 + parseInt(year) : parseInt(year);
      
      const timestamp = new Date(fullYear, parseInt(month) - 1, parseInt(day), parsedHour, parseInt(minute), parseInt(second));
      
      // Skip system messages
      if (message.startsWith('‎')) {
        console.log('Skipping system message:', message);
        continue;
      }
      
      // Clean sender name
      const cleanSender = sender.trim();
      if (!participants.includes(cleanSender)) {
        participants.push(cleanSender);
      }
      
      messages.push({
        timestamp,
        sender: cleanSender,
        message: message.trim()
      });
    } else {
      console.log('No match for line:', line);
    }
  }
  
  console.log('Parsed', messages.length, 'messages from', participants);
  
  // Add safety check for empty messages
  if (messages.length === 0) {
    throw new Error('No valid messages found in the chat file. Please check the file format.');
  }
  
  // Sort messages by timestamp to ensure proper order
  messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  // Calculate reply times
  const messagesWithReplyTimes = messages.map((msg, index) => {
    if (index === 0) return { ...msg, replyTime: 0 };
    
    const prevMsg = messages[index - 1];
    if (prevMsg.sender !== msg.sender) {
      const timeDiff = msg.timestamp.getTime() - prevMsg.timestamp.getTime();
      const replyTimeMinutes = timeDiff / (1000 * 60); // Convert to minutes
      return { ...msg, replyTime: Math.max(0, replyTimeMinutes) };
    }
    
    return { ...msg, replyTime: 0 };
  });
  
  // Analyze emojis
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const emojiMap = new Map<string, { count: number; sender: string }>();
  
  messages.forEach(msg => {
    const emojis = msg.message.match(emojiRegex) || [];
    emojis.forEach(emoji => {
      const key = `${emoji}-${msg.sender}`;
      if (emojiMap.has(key)) {
        emojiMap.get(key)!.count++;
      } else {
        emojiMap.set(key, { count: 1, sender: msg.sender });
      }
    });
  });
  
  const emojiFrequency: EmojiData[] = Array.from(emojiMap.entries()).map(([key, data]) => ({
    emoji: key.split('-')[0],
    count: data.count,
    sender: data.sender
  }));
  
  // Analyze words
  const wordMap = new Map<string, { count: number; sender: string }>();
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'a', 'an', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
  
  messages.forEach(msg => {
    const words = msg.message.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    words.forEach(word => {
      const key = `${word}-${msg.sender}`;
      if (wordMap.has(key)) {
        wordMap.get(key)!.count++;
      } else {
        wordMap.set(key, { count: 1, sender: msg.sender });
      }
    });
  });
  
  const wordFrequency: WordData[] = Array.from(wordMap.entries()).map(([key, data]) => ({
    word: key.split('-')[0],
    count: data.count,
    sender: data.sender
  }));
  
  // Create reply time data for chart
  const replyTimes: ReplyTimeData[] = messagesWithReplyTimes
    .filter(msg => msg.replyTime && msg.replyTime > 0)
    .map((msg, index) => ({
      messageIndex: index + 1,
      replyTime: msg.replyTime || 0,
      sender: msg.sender
    }));
  
  // Create hourly activity data
  const hourlyMap = new Map<string, number>();
  messages.forEach(msg => {
    const hour = msg.timestamp.getHours();
    const key = `${hour}-${msg.sender}`;
    hourlyMap.set(key, (hourlyMap.get(key) || 0) + 1);
  });
  
  const hourlyActivity: HourlyActivity[] = Array.from(hourlyMap.entries()).map(([key, count]) => {
    const [hour, sender] = key.split('-');
    return {
      hour: parseInt(hour),
      count,
      sender
    };
  });
  
  // Calculate love score based on various factors
  const avgReplyTime = replyTimes.length > 0 
    ? replyTimes.reduce((sum, rt) => sum + rt.replyTime, 0) / replyTimes.length 
    : 0;
  
  const totalEmojis = emojiFrequency.reduce((sum, e) => sum + e.count, 0);
  const messageRatio = participants.length === 2 
    ? Math.min(
        messages.filter(m => m.sender === participants[0]).length / messages.length,
        messages.filter(m => m.sender === participants[1]).length / messages.length
      ) 
    : 0.5;
  
  // Love score calculation (0-100)
  let loveScore = 50; // Base score
  
  // Reply time factor (faster replies = higher score)
  if (avgReplyTime < 5) loveScore += 20;
  else if (avgReplyTime < 15) loveScore += 10;
  else if (avgReplyTime < 60) loveScore += 5;
  else loveScore -= 10;
  
  // Emoji usage factor
  const emojiRatio = totalEmojis / messages.length;
  if (emojiRatio > 0.3) loveScore += 15;
  else if (emojiRatio > 0.1) loveScore += 10;
  else if (emojiRatio > 0.05) loveScore += 5;
  
  // Message balance factor
  if (messageRatio > 0.4) loveScore += 10;
  else if (messageRatio > 0.3) loveScore += 5;
  else loveScore -= 5;
  
  // Activity consistency factor
  const activeDays = new Set(messages.map(m => m.timestamp.toDateString())).size;
  const totalDays = Math.ceil((messages[messages.length - 1].timestamp.getTime() - messages[0].timestamp.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  const consistencyRatio = activeDays / totalDays;
  
  if (consistencyRatio > 0.5) loveScore += 10;
  else if (consistencyRatio > 0.3) loveScore += 5;
  
  loveScore = Math.max(0, Math.min(100, loveScore));
  
  return {
    messages: messagesWithReplyTimes,
    participants,
    totalMessages: messages.length,
    avgReplyTime: Math.round(avgReplyTime * 10) / 10,
    totalEmojis,
    loveScore: Math.round(loveScore),
    replyTimes,
    emojiFrequency,
    wordFrequency,
    hourlyActivity,
    startDate: messages[0].timestamp,
    endDate: messages[messages.length - 1].timestamp
  };
};

// Mock fetch handler for client-side processing
export const handleChatParsing = async (file: File): Promise<ChatData> => {
  const content = await file.text();
  return parseWhatsAppChat(content);
};
