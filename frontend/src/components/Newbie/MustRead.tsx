import React, { useState } from 'react';
import Card from '../Common/Card';
import { newbieRecommendations, newbieCautions, referenceSites, commonQuestions } from '../../newbieData';

type MustReadTab = 'recommendations' | 'cautions' | 'firstThreeDays' | 'questions' | 'references';

const MustRead: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MustReadTab>('recommendations');

  const tabs: { key: MustReadTab; label: string; icon: string }[] = [
    { key: 'recommendations', label: '新人建議', icon: '💡' },
    { key: 'cautions', label: '新人注意', icon: '⚠️' },
    { key: 'firstThreeDays', label: '新手前三天', icon: '' },
    { key: 'questions', label: '養成問題', icon: '❓' },
    { key: 'references', label: '常見參考網站', icon: '🌐' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'recommendations':
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">新人建議</h2>
            <ul className="space-y-3">
              {newbieRecommendations.map((item) => (
                <li key={item.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <p className="text-gray-700 leading-relaxed">{item.content}</p>
                </li>
              ))}
            </ul>
          </Card>
        );
      case 'cautions':
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-red-700">新人注意</h2>
            <ul className="space-y-3">
              {newbieCautions.map((item) => (
                <li key={item.id} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <p className="text-gray-700 leading-relaxed">{item.content}</p>
                </li>
              ))}
            </ul>
          </Card>
        );
      case 'firstThreeDays':
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-purple-700">新手前三天必做</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 shadow-sm">
                <ol className="space-y-3 text-gray-700 leading-relaxed">
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[1.5rem]">1.</span>
                    <span>此時有72小時Fes池，目標是挖出默涅、厄莉絲、涅妃、菲歐(按照順序)，這四隻角色。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[1.5rem]">2.</span>
                    <span>此時先推關到2-15，個人印象把五隻升到15等左右就可以推過了。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[1.5rem]">3.</span>
                    <span>3-1開始加一個老玩家好友，借滿等克總(放一隻)，自己的別放，一路推，我印象normal可以推到63-9，normal推不動後推hard，hard推不動後推veryhard。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[1.5rem]">4.</span>
                    <span>由於借角色要瑪那，瑪那會不夠，此時有劇情活動就推劇情活動normal關卡和王。若沒劇情活動就去推支線，王打得過就打。然後領任務獎勵，通常會有不少瑪那</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[1.5rem]">5.</span>
                    <span>印象大概推到normal 40-1以後，就不會有瑪那不夠的問題了。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[1.5rem]">6.</span>
                    <span>由於目標是四隻角色，如果沒課7天體力卷，體力會很快用完，建議這三天每天都可以買六次體力(會花鑽石)。三天過後還要不要買體力看個人，我小號無課是每天買三次。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-purple-600 mr-2 min-w-[1.5rem]">7.</span>
                    <span>如果主線都推完鑽石還是不夠，就去推支線。如果真的不幸4隻都保底，鑽石又不夠，就等到下次Fes再補。</span>
                  </li>
                </ol>
              </div>
            </div>
          </Card>
        );
      case 'questions':
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-orange-700">養成問題</h2>
            <div className="space-y-4">
              {commonQuestions.map((item) => (
                <div key={item.id} className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h3 className="font-bold text-orange-800 mb-2">{item.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        );
      case 'references':
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-green-600">常見參考網站</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              {referenceSites.map((site) => (
                <a 
                  key={site.id} 
                  href={site.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{site.name}</h3>
                </a>
              ))}
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex justify-center mb-6 bg-white p-2 rounded-lg shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 mx-1 ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default MustRead;