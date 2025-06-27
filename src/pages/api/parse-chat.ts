import { ChatData, Message, EmojiData, WordData, ReplyTimeData, HourlyActivity, DailyEmojiData } from '@/types/chat';

const parseWhatsAppChat = (content: string): ChatData => {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  const messages: Message[] = [];
  
  const messagePattern = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}:\d{2})\s+([AP]M)\]\s+([^:]+):\s*(.*)$/;
  
  let participants: string[] = [];
  
  console.log('--- STARTING CHAT PARSE DEBUG ---');
  console.log('Total lines found:', lines.length);
  console.log('First 5 lines:', lines.slice(0, 5));
  
  for (const line of lines) {
    const match = line.match(messagePattern);
    console.log('Processing line:', line);
    if (match) {
      const [, date, time, ampm, sender, message] = match;
      console.log('  ✅ Line MATCHED. Parts:', { date, time, ampm, sender, message: message.substring(0, 30) + '...' });
      
      const [month, day, year] = date.split('/');
      const [hour, minute, second] = time.split(':');
      let parsedHour = parseInt(hour);
      
      if (ampm === 'PM' && parsedHour !== 12) {
        parsedHour += 12;
      } else if (ampm === 'AM' && parsedHour === 12) {
        parsedHour = 0;
      }
      
      const fullYear = year.length === 2 ? 2000 + parseInt(year) : parseInt(year);
      const timestamp = new Date(fullYear, parseInt(month) - 1, parseInt(day), parsedHour, parseInt(minute), parseInt(second));

      console.log('  ➡️ Parsed timestamp:', timestamp.toString());
      if (isNaN(timestamp.getTime())) {
        console.error('  ❌ ERROR: Invalid date created from line.', { fullYear, month: parseInt(month) - 1, day: parseInt(day), parsedHour, minute: parseInt(minute), second: parseInt(second) });
      }
      
      if (message.startsWith('‎')) {
        console.log('Skipping system message:', message);
        continue;
      }
      
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
      console.warn('  ⚠️ Line DID NOT MATCH regex.');
    }
  }
  
  console.log('--- PARSING COMPLETE ---');
  console.log('Total messages parsed:', messages.length);
  console.log('Participants found:', participants);

  if (messages.length === 0) {
    throw new Error('No valid messages found in the chat file. Please check the file format.');
  }

  if (messages.length > 0) {
    try {
      console.log('First 3 parsed messages:', JSON.parse(JSON.stringify(messages.slice(0, 3))));
    } catch (e) {
      console.error('Could not stringify messages:', e);
      console.log('First 3 parsed messages (raw):', messages.slice(0, 3));
    }
  }
  
  messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  try {
    console.log('First 3 messages AFTER SORT:', JSON.parse(JSON.stringify(messages.slice(0, 3))));
  } catch(e) {
    console.error('Could not stringify sorted messages:', e);
    console.log('First 3 sorted messages (raw):', messages.slice(0, 3));
  }

  const messagesWithReplyTimes = messages.map((msg, index) => {
    if (index === 0) return { ...msg, replyTime: 0 };
    
    const prevMsg = messages[index - 1];
    if (prevMsg.sender !== msg.sender) {
      const timeDiff = msg.timestamp.getTime() - prevMsg.timestamp.getTime();
      const replyTimeMinutes = timeDiff / (1000 * 60);
      return { ...msg, replyTime: Math.max(0, replyTimeMinutes) };
    }
    
    return { ...msg, replyTime: 0 };
  });
  
  console.log('messagesWithReplyTimes (sample):', messagesWithReplyTimes.slice(0, 5).map(m => ({ sender: m.sender, replyTime: m.replyTime })));

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
  
  const dailyEmojiMap = new Map<string, { [sender: string]: number }>();
  messages.forEach(msg => {
    const dateStr = msg.timestamp.toISOString().split('T')[0];
    const emojis = msg.message.match(emojiRegex) || [];

    if (!dailyEmojiMap.has(dateStr)) {
        const entry: { [sender: string]: number } = {};
        participants.forEach(p => entry[p] = 0);
        dailyEmojiMap.set(dateStr, entry);
    }

    if (emojis.length > 0) {
        const dailyCounts = dailyEmojiMap.get(dateStr)!;
        dailyCounts[msg.sender] += emojis.length;
    }
  });

  const dailyEmojiData: DailyEmojiData[] = Array.from(dailyEmojiMap.entries())
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const replyTimes: ReplyTimeData[] = messagesWithReplyTimes
    .map((msg, index) => ({
      messageIndex: index + 1,
      replyTime: msg.replyTime || 0,
      sender: msg.sender
    }))
    .filter(rt => rt.replyTime > 0);
  
  console.log('Final replyTimes data sent to chart:', replyTimes);

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
  
  let loveScore = 50; 
  
  // More impactful scoring
  // Reply time factor (faster replies = higher score)
  if (avgReplyTime < 2) loveScore += 25; // Very fast
  else if (avgReplyTime < 5) loveScore += 15; // Fast
  else if (avgReplyTime < 10) loveScore += 10; // Good
  else if (avgReplyTime < 30) loveScore += 5; // Okay
  else loveScore -= 15; // Slow

  // Emoji usage factor
  const emojiRatio = totalEmojis / messages.length;
  if (emojiRatio > 0.5) loveScore += 20; // Lots of emojis
  else if (emojiRatio > 0.2) loveScore += 15; // Good amount
  else if (emojiRatio > 0.1) loveScore += 10; // Some
  else if (emojiRatio > 0.05) loveScore += 5; // A few
  
  // Message balance factor
  if (messageRatio > 0.45) loveScore += 15; // Very balanced
  else if (messageRatio > 0.35) loveScore += 10; // Balanced
  else if (messageRatio > 0.25) loveScore += 5; // Slightly imbalanced
  else loveScore -= 10; // Imbalanced

  // Activity consistency factor
  const activeDays = new Set(messages.map(m => m.timestamp.toDateString())).size;
  const totalDays = Math.ceil((messages[messages.length - 1].timestamp.getTime() - messages[0].timestamp.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  const consistencyRatio = activeDays / totalDays;
  
  if (consistencyRatio > 0.8) loveScore += 15; // Very consistent
  else if (consistencyRatio > 0.5) loveScore += 10; // Consistent
  else if (consistencyRatio > 0.3) loveScore += 5; // Somewhat consistent
  
  loveScore = Math.max(0, Math.min(100, loveScore));

  const messageCountByUser: { [user: string]: number } = {};
  const wordCountByUser: { [user:string]: number } = {};
  let mediaCount = 0;
  participants.forEach(p => {
    messageCountByUser[p] = 0;
    wordCountByUser[p] = 0;
  });
  messages.forEach(msg => {
    messageCountByUser[msg.sender]++;
    const words = msg.message.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/);
    wordCountByUser[msg.sender] += words.filter(w => w.length > 0).length;
    if (msg.message.includes('<Media omitted>')) {
      mediaCount++;
    }
  });

  console.log('--- END OF DEBUG ---');
  
  return {
    messages: messagesWithReplyTimes,
    participants,
    totalMessages: messages.length,
    messageCountByUser,
    wordCountByUser,
    mediaCount,
    avgReplyTime: Math.round(avgReplyTime * 10) / 10,
    totalEmojis,
    loveScore: Math.round(loveScore),
    replyTimes,
    emojiFrequency,
    dailyEmojiData,
    wordFrequency,
    hourlyActivity,
    startDate: messages[0].timestamp,
    endDate: messages[messages.length - 1].timestamp
  };
};

export const handleChatParsing = async (file: File): Promise<ChatData> => {
  const content = await file.text();
  return parseWhatsAppChat(content);
};
