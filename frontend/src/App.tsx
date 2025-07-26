import { useState } from 'react';
import Characters from './pages/Characters/Characters';

// 頁面類型定義
type PageType = 
  | 'newbie' 
  | 'returnPlayer' 
  | 'characters' 
  | 'shop' 
  | 'arena' 
  | 'clanBattle' 
  | 'dungeon' 
  | 'characterDevelopment';

// 導航項目配置
const navItems = [
  { key: 'newbie' as PageType, label: '新人', icon: '🌟' },
  { key: 'returnPlayer' as PageType, label: '回鍋玩家建議', icon: '🔄' },
  { key: 'characters' as PageType, label: '角色圖鑑', icon: '⚔️' },
  { key: 'shop' as PageType, label: '商店攻略', icon: '🛒' },
  { key: 'arena' as PageType, label: '競技場', icon: '🏟️' },
  { key: 'clanBattle' as PageType, label: '戰隊戰', icon: '🛡️' },
  { key: 'dungeon' as PageType, label: '深域', icon: '🗿' },
  { key: 'characterDevelopment' as PageType, label: '角色養成', icon: '📈' },
];

// 開發中佔位組件
const UnderDevelopment = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-white py-8">
    <div className="text-center">
      <div className="text-8xl mb-8">🚧</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-xl text-gray-600 mb-8">此功能正在開發中，敬請期待！</p>
      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-auto" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <p className="text-gray-700 leading-relaxed">
          我們正在努力為您準備最好的遊戲攻略內容，
          請關注更新資訊，謝謝您的耐心等候！
        </p>
      </div>
    </div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('characters');

  // 渲染當前頁面內容
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'characters':
        return <Characters />;
      case 'newbie':
        return <UnderDevelopment title="新人指南" />;
      case 'returnPlayer':
        return <UnderDevelopment title="回鍋玩家建議" />;
      case 'shop':
        return <UnderDevelopment title="商店攻略" />;
      case 'arena':
        return <UnderDevelopment title="競技場攻略" />;
      case 'clanBattle':
        return <UnderDevelopment title="戰隊戰攻略" />;
      case 'dungeon':
        return <UnderDevelopment title="深域攻略" />;
      case 'characterDevelopment':
        return <UnderDevelopment title="角色養成指南" />;
      default:
        return <Characters />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header 導航 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          {/* 標題 */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🌸 公主連結攻略網站 🌸
            </h1>
            <p className="text-gray-600">Princess Connect! Re:Dive Guide</p>
          </div>
          
          {/* 導航按鈕 */}
          <nav className="flex flex-wrap justify-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                className={`px-4 py-2 font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentPage === item.key
                    ? 'bg-blue-500 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
                }`}
                style={{ borderRadius: '8px' }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm md:text-base">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 頁面內容 */}
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;
