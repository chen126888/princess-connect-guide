import React from 'react';
import Card from '../../components/Common/Card';

interface YoutubeChannel {
  name: string;
  link: string;
}

interface YoutubeChannelsSectionProps {
  channels: YoutubeChannel[];
}

const YoutubeChannelsSection: React.FC<YoutubeChannelsSectionProps> = ({ channels }) => {
  return (
    <Card className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">推薦參考 YouTube 頻道</h2>
      <p className="text-gray-600 mb-4">
        中文查詢：公主連結 戰隊戰<br />
        日文查詢：【プリコネR】4段階目簡単セミオート編成とフルオート編成紹介<br />
        記得確認年月有對上
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel, index) => (
          <a 
            key={index} 
            href={channel.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <h3 className="text-lg font-semibold text-blue-600 hover:underline">{channel.name}</h3>
            <p className="text-sm text-gray-500 truncate">{channel.link}</p>
          </a>
        ))}
      </div>
    </Card>
  );
};

export default YoutubeChannelsSection;
