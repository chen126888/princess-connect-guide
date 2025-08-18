import React from 'react';
import Card from '../Common/Card';
import { dailyStrategyData } from '../../returnPlayerData';

const DailyStrategySection: React.FC = () => {
  const { dungeonAdvice, challengeAdvice } = dailyStrategyData;

  return (
    <Card className="mb-6">
      <h2 className="text-2xl font-bold text-amber-700 mb-4">日常與副本攻略</h2>
      
      <div className="space-y-6">
        {/* 地下城與小屋 */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">{dungeonAdvice.title}</h3>
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">{dungeonAdvice.mainTip}</p>
            {dungeonAdvice.details.map((detail, index) => (
              <p key={index} className="text-gray-600 leading-relaxed">
                {detail}
              </p>
            ))}
          </div>
        </div>

        {/* 挑戰與作業 */}
        <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">{challengeAdvice.title}</h3>
          <div className="space-y-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <p className="text-red-800 text-sm font-medium mb-1">常見問題：</p>
              <p className="text-red-700 text-sm leading-relaxed">{challengeAdvice.problem}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <p className="text-green-800 text-sm font-medium mb-1">解決方案：</p>
              <p className="text-green-700 text-sm leading-relaxed">{challengeAdvice.solution}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DailyStrategySection;