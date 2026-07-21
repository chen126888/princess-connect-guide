import React, { useState } from 'react';
import Card from '../Common/Card';
import TeamLineup from '../Common/TeamLineup';

type TeamTab = 'pve' | 'pvp';

const TeamFormation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TeamTab>('pve');

  const tabs = [
    { key: 'pve' as TeamTab, label: '推圖/活動' },
    { key: 'pvp' as TeamTab, label: '競技場' }
  ];

  const renderPveContent = () => (
    <Card>
      <h2 className="text-2xl font-bold mb-4 text-amber-700">推圖/活動組隊建議</h2>
      
      <div className="space-y-6">
        {/* 注意事項 */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium">
            ⚠️ 以下都非最佳解，僅給新手初期一個組隊方向。
          </p>
        </div>

        {/* 基礎組隊 - 2FES角色 */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🌟 基礎組隊（FES池抽出厄莉絲和默涅）</h3>
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              <strong className="text-gray-800">假設條件：</strong>新手FES池只抽出厄莉絲和默涅
            </p>
            <p className="text-gray-700 mb-2">
              <strong className="text-gray-800">推薦隊伍：</strong>可以以這兩隻為主，組出推圖隊伍
            </p>
          </div>
          
          <div className="mb-3">
            <h4 className="font-semibold text-gray-800 mb-3">推薦陣容：</h4>
            <TeamLineup 
              characterNames={['厄莉絲', '凱留', '妹弓', '可可蘿', '默涅']}
              bgColor="bg-purple-50"
              textColor="text-purple-800"
            />
          </div>
        </div>

        {/* 基礎組隊 - 4FES角色 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🌟 基礎組隊（FES池抽出四隻）</h3>
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              <strong className="text-gray-800">假設條件：</strong>FES抽出厄莉絲、菲歐、涅妃、默涅四隻
            </p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">推薦陣容：</h4>
            <TeamLineup 
              characterNames={['厄莉絲', '菲歐', '妹弓', '涅妃', '默涅']}
              bgColor="bg-blue-50"
              textColor="text-blue-800"
            />
            <p className="text-gray-600 text-sm mt-3">
              <strong>原因：</strong>厄莉絲、菲歐、涅妃、默涅，這四隻未來一定會用到，沒意外還可以用很久的角色；妹弓是練了絕對不虧的角色，所以先放進來。
            </p>
          </div>
        </div>

        {/* 完美組隊 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">⭐ 後續完美解</h3>
          
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">完美陣容：</h4>
            <TeamLineup 
              characterNames={['厄莉絲', '愛梅斯', '霞', '帆希(新年)/似似花', '默涅']}
              bgColor="bg-green-50"
              textColor="text-green-800"
            />
            <div className="space-y-2 text-sm text-gray-600 mt-3">
              <p>
                <strong>原因：</strong>此隊不論推圖、滿等後深域道中都會用到，練了不虧。
              </p>
              <p>
                當然愛梅斯和似似花在煌靈大大的影片中，優先順序沒那麼高了，但個人認為，抄作業上還是很好用，至少抽其中一隻，另一隻用借的。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderPvpContent = () => (
    <Card>
      <h2 className="text-2xl font-bold mb-4 text-amber-700">競技場組隊建議</h2>
      
      <div className="space-y-6">
        {/* 注意事項 */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium">
            ⚠️ 以下都非最佳解，僅給新手初期一個組隊方向。
          </p>
        </div>

        {/* 基礎競技場組隊 */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">初期競技場組隊</h3>
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              <strong className="text-gray-800">適用時機：</strong>等玩到100多等，應該慢慢可以有一些六星，優先組出競技場的隊伍
            </p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">推薦陣容：</h4>
            <TeamLineup 
              characterNames={['凱留','妹弓', '雪', '步未', '宮子']}
              bgColor="bg-red-50"
              textColor="text-red-800"
            />
            <div className="space-y-2 text-sm text-gray-600 mt-3">
              <p>
                <strong>原因：</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>凱留：可以在地下城商店換</li>
                <li>妹弓：可以在競技場商店換</li>
                <li>宮子：可以在公主競技場商店換</li>
                <li>步未：可以在地下城商店換</li>
                <li>雪：用打的</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </Card>
  );

  return (
    <div>
      {/* 導航按鈕 */}
      <Card className="mb-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* 內容區域 */}
      {activeTab === 'pve' ? renderPveContent() : renderPvpContent()}
    </div>
  );
};

export default TeamFormation;