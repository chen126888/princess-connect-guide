import React from 'react';
import PageContainer from '../../components/Common/PageContainer';
import Card from '../../components/Common/Card';
import { dungeonConfigs } from '../../dungeonData/dungeonConfigs';

const Dungeon: React.FC = () => {
  const config = dungeonConfigs;

  const renderTextWithIcons = (text: string) => {
    let processedText = text;

    const iconMap: { [key: string]: string[] } = {
      '星素水晶球': ['星素水晶球(火)', '星素水晶球(水)'],
      '星素碎片': ['星素碎片'],
      '大師碎片': ['大師碎片'],
      // '轉蛋': ['轉蛋'], // Removed as per user's request
      '專精卷': ['專精卷'], // Added as per user's request
    };

    for (const key in iconMap) {
      const iconNames = iconMap[key];
      const imgTags = iconNames.map(iconName => `<img src="http://localhost:3000/images/shop_icon/${iconName}.png" alt="${iconName}" class="inline-block w-5 h-5 mx-1 align-middle" />`).join('');
      processedText = processedText.replace(new RegExp(key, 'g'), `${key}${imgTags}`);
    }

    // Replace newlines with <br /> for HTML rendering
    processedText = processedText.replace(/\n/g, '<br />');

    return { __html: processedText };
  };

  return (

    <PageContainer>
      
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">深域簡介</h2>
        <div className="text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
          {config.introduction}
        </div>
      </Card>

      {config.enhancementIntroduction && (
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">強化介紹</h2>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={renderTextWithIcons(config.enhancementIntroduction)}>
          </div>
        </Card>
      )}

      {config.excelLinks && config.excelLinks.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">參考 Excel 連結</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.excelLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-blue-600 hover:underline">{link.name}</h3>
                <p className="text-sm text-gray-500 truncate">{link.url}</p>
              </a>
            ))}
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default Dungeon;
