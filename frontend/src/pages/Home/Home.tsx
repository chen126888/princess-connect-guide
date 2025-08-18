import React, { useState } from 'react';
import PageContainer from '../../components/Common/PageContainer';
import Button from '../../components/Common/Button';
import UpdateLogManager from '../../components/Common/UpdateLogManager';
import { updateLogs, getVersionBadgeStyle, getVersionLabel, type UpdateLogItem } from '../../data/updateLogData';

interface HomeProps {
  isAdminMode?: boolean;
}

const Home: React.FC<HomeProps> = ({ isAdminMode = false }) => {
  const [showUpdateLog, setShowUpdateLog] = useState(false);
  const [showUpdateLogManager, setShowUpdateLogManager] = useState(false);

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">


        {/* 網站介紹 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            這座小站的誕生
          </h2>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            <p>
              這座小站的誕生，源自本人曾經走過的彎路。因為深刻體會過方向不明的迷茫，所以希望能讓新手們有一條相對清晰的養成方向，少走一些冤枉路。
            </p>
          </div>
        </div>

        {/* 關於評價 */}
        <div className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            關於評價
          </h2>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            <p>
              本站評價主要參考了<a href="https://docs.google.com/spreadsheets/d/1L04n1Gh2bTNTFfpy4-xgIiCMQJPkwqcLyKVd-w3srMg/edit?gid=786096365#gid=786096365" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">「2025公主連結角色簡略介紹表」</a>，並結合了煌靈大的影片、GameWith日服資訊與我個人的台服經驗。
            </p>
            <p>
              這是一份充滿個人主觀的「私心評價」，主要寫給新手們參考，相信老手們心中自有定見！如果與你的看法有落差，也屬正常，畢竟每個人的角色池與解法都不同。
            </p>
            <p>
              詳細的評價標準(T0-T4)已放在「角色圖鑑」頁面的排序功能旁，方便隨時對照。
            </p>
          </div>
        </div>

        {/* 聯絡方式 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            聯絡方式
          </h2>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            <p>
              本站由個人興趣與熱情維護，完全不營利。若有任何建議或發現Bug，歡迎透過 <a href="https://home.gamer.com.tw/homeindex.php?owner=chen126888" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-bold">巴哈姆特站內信</a> 或 <a href="https://github.com/chen126888/princess-connect-guide/issues" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-bold">GitHub Issue</a> 與我聯繫，感謝你的理解！
            </p>
            <p>
              GitHub：<a href="https://github.com/chen126888/princess-connect-guide" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">https://github.com/chen126888/princess-connect-guide</a>
            </p>
            <p className="text-sm text-gray-600 text-center mt-6">
              🎮 祝您遊戲愉快！
            </p>
          </div>
        </div>

        {/* 更新日誌按鈕 */}
        <div className="text-center">
          <Button
            onClick={() => setShowUpdateLog(!showUpdateLog)}
            variant="secondary"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3"
          >
            {showUpdateLog ? '隱藏更新日誌' : '查看更新日誌'} 
            <span className="ml-2">{showUpdateLog ? '▲' : '▼'}</span>
          </Button>
        </div>

        {/* 更新日誌內容 */}
        {showUpdateLog && (
          <div className="bg-white rounded-lg p-8 shadow-md border-l-4 border-indigo-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                📋 更新日誌
              </h2>
              {isAdminMode && (
                <button
                  onClick={() => setShowUpdateLogManager(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded font-medium transition-colors"
                >
                  ➕ 新增更新日誌
                </button>
              )}
            </div>
            <div className="space-y-6">
              {updateLogs.map((log, index) => (
                <div key={log.version} className={index < updateLogs.length - 1 ? "border-b border-gray-200 pb-6" : ""}>
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                      {log.date}
                    </div>
                    <div className={`${getVersionBadgeStyle(log.type)} px-3 py-1 rounded-full text-sm`}>
                      {log.version} {getVersionLabel(log.type)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{log.title}</h3>
                  <div className="text-gray-700 space-y-2">
                    {log.items.map((item, itemIndex) => (
                      <p key={itemIndex} dangerouslySetInnerHTML={{ __html: `• ${item}` }} />
                    ))}
                  </div>
                  {log.summary && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-800 font-medium text-sm">
                        {log.summary}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      
      {/* 更新日誌管理器 */}
      {showUpdateLogManager && (
        <UpdateLogManager onClose={() => setShowUpdateLogManager(false)} />
      )}
    </PageContainer>
  );
};

export default Home;