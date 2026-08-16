import React from 'react';
import Card from '../Common/Card';
import { newbieBoostData } from '../../returnPlayerData';

const NewbieBoostSection: React.FC = () => {
  const { title, fragmentPriority, rankAdvice } = newbieBoostData;

  return (
    <Card className="mb-6">
      <h2 className="text-2xl font-bold text-amber-700 mb-4">{title}</h2>
      
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
        
        <div className="space-y-4">
          {/* 優先刷取角色碎片 */}
          <div className="bg-white p-4 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              {fragmentPriority.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">{fragmentPriority.description}</p>
          </div>

          {/* 不要急著衝 Rank */}
          <div className="bg-white p-4 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              {rankAdvice.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">{rankAdvice.description}</p>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default NewbieBoostSection;