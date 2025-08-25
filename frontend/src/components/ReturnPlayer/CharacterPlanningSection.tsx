import React from 'react';
import Card from '../Common/Card';
import { characterPlanningData } from '../../returnPlayerData';

interface CharacterPlanningSectionProps {
  onNavigateToCharacterDevelopment?: () => void;
}

const CharacterPlanningSection: React.FC<CharacterPlanningSectionProps> = ({
  onNavigateToCharacterDevelopment
}) => {
  const { sixStarAdvice, teamBuildingStrategy, gachaTeamStrategy, eventStrategy, nonSixStarStrategy, resourceManagement } = characterPlanningData;

  return (
    <Card className="mb-6">
      <h2 className="text-2xl font-bold text-amber-700 mb-4">角色與資源規劃</h2>
      
      <div className="space-y-6">
        {/* 六星角色確認 */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">{sixStarAdvice.title}</h3>
          <p className="text-gray-700 mb-3 leading-relaxed">{sixStarAdvice.description}</p>
          <button
            onClick={() => onNavigateToCharacterDevelopment?.()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            {sixStarAdvice.actionText}
          </button>
        </div>

        {/* 刷取非六星常用角色策略 */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">{nonSixStarStrategy.title}</h3>
          <p className="text-gray-700 leading-relaxed">{nonSixStarStrategy.description}</p>
        </div>

        {/* 未來視抽角與戰隊戰策略 */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">{teamBuildingStrategy.title}</h3>
          <p className="text-gray-700 mb-3 leading-relaxed">{teamBuildingStrategy.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-green-700 font-medium">目前相對平民的隊伍：</span>
            {teamBuildingStrategy.recommendedTeams.map((team, index) => (
              <span
                key={index}
                className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {team}
              </span>
            ))}
          </div>
        </div>

        {/* 抽角&組隊注意 */}
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">{gachaTeamStrategy.title}</h3>
          <p className="text-gray-700 leading-relaxed">{gachaTeamStrategy.description}</p>
        </div>

        {/* 跟隨加倍活動策略 */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">{eventStrategy.title}</h3>
          <p className="text-gray-700 leading-relaxed">{eventStrategy.description}</p>
        </div>

        {/* 資源管理建議 */}
        <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
          <h3 className="text-lg font-semibold text-pink-800 mb-2">{resourceManagement.title}</h3>
          <p className="text-gray-700 leading-relaxed">{resourceManagement.description}</p>
        </div>
      </div>
    </Card>
  );
};

export default CharacterPlanningSection;