import React from 'react';
import Card from '../Common/Card';
import type { ArenaType, ArenaSection, ArenaItem } from '../../types/arena';
import { arenaConfigs } from '../../arenaData/arenaConfigs';

interface ArenaContentProps {
  activeType: ArenaType;
}

const PriorityBadge: React.FC<{ priority?: 'high' | 'medium' | 'low' }> = ({ priority }) => {
  if (!priority) return null;

  const configs = {
    high: { label: '重要', className: 'bg-red-100 text-red-800 border-red-200' },
    medium: { label: '建議', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    low: { label: '可選', className: 'bg-gray-100 text-gray-800 border-gray-200' }
  };

  const config = configs[priority];

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${config.className}`}>
      {config.label}
    </span>
  );
};

const ArenaItem: React.FC<{ item: ArenaItem }> = ({ item }) => (
  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
    <div className="flex items-start justify-between mb-2">
      <h5 className="font-medium text-gray-800">{item.name}</h5>
      <PriorityBadge priority={item.priority} />
    </div>
    <p className="text-sm text-gray-600">{item.description}</p>
  </div>
);

const ArenaSection: React.FC<{ section: ArenaSection }> = ({ section }) => (
  <Card className="mb-6">
    <h3 className="text-xl font-bold text-gray-800 mb-3">{section.title}</h3>
    <p className="text-gray-600 mb-4">{section.description}</p>
    
    {section.items && section.items.length > 0 && (
      <div className="space-y-3 mb-4">
        {section.items.map((item, index) => (
          <ArenaItem key={index} item={item} />
        ))}
      </div>
    )}
    
    {section.subsections && section.subsections.length > 0 && (
      <div className="space-y-4">
        {section.subsections.map((subsection, index) => (
          <div key={index} className="border-l-4 border-blue-200 pl-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">{subsection.title}</h4>
            <p className="text-gray-600 mb-3">{subsection.description}</p>
            {subsection.items && subsection.items.length > 0 && (
              <div className="space-y-2">
                {subsection.items.map((item, itemIndex) => (
                  <ArenaItem key={itemIndex} item={item} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </Card>
);

const ArenaContent: React.FC<ArenaContentProps> = ({ activeType }) => {
  const config = arenaConfigs[activeType];
  
  if (!config) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">內容載入失敗</h2>
          <p className="text-gray-600">無法找到對應的內容配置</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 標題區域 */}
      <Card>
        <div className="text-center">
          <div className="text-4xl mb-4">{config.icon}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{config.content.title}</h1>
          <p className="text-lg text-gray-600">{config.description}</p>
        </div>
      </Card>
      
      {/* 內容區域 */}
      {config.content.sections.map((section, index) => (
        <ArenaSection key={index} section={section} />
      ))}
    </div>
  );
};

export default ArenaContent;