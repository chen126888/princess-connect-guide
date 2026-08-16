import React, { useState } from 'react';
import Card from '../Common/Card';
import { systemSections, starUpTable } from '../../newbieData';

type CharacterSystemTab = 'system' | 'starUp';

const CharacterSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CharacterSystemTab>('system');

  const tabs = [
    { key: 'system' as CharacterSystemTab, label: '角色系統' },
    { key: 'starUp' as CharacterSystemTab, label: '升星消耗' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'system':
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-amber-700">角色系統詳解</h2>
            <div className="space-y-4">
              {systemSections.map((section) => (
                <div key={section.id}>
                  <h3 className="font-semibold text-xl text-gray-800">{section.title}</h3>
                  <p className="text-gray-600 mt-1">{section.description}</p>
                </div>
              ))}
            </div>
          </Card>
        );
      case 'starUp':
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-amber-700">角色升星一覽表</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">星級</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所需碎片/材料</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {starUpTable.map((row) => (
                    <tr key={row.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.from} ★ → {row.to} ★</td>
                      <td className="px-6 py-4 whitespace-normal text-gray-700">{row.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

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
      {renderContent()}
    </div>
  );
};

export default CharacterSystem;