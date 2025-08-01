import { useState } from 'react';
import Characters from './pages/Characters/Characters';
import CharacterEditor from './pages/CharacterEditor/CharacterEditor';
import Shop from './pages/Shop/Shop';

// 頁面類型定義
type PageType = 
  | 'newbie' 
  | 'returnPlayer' 
  | 'characters' 
  | 'characterEditor'
  | 'shop' 
  | 'arena' 
  | 'clanBattle' 
  | 'dungeon' 
  | 'characterDevelopment';


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
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [hoveredItem, setHoveredItem] = useState<PageType | null>(null);

  // 管理員登入處理
  const handleAdminLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAdminMode(true);
        setShowLoginModal(false);
        setLoginForm({ username: '', password: '' });
        alert(`歡迎 ${data.admin.name}，管理員模式已啟用！`);
      } else {
        alert(data.error || '登入失敗');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('連線錯誤，請檢查網路連線');
    }
  };

  // 管理員登出
  const handleAdminLogout = () => {
    setIsAdminMode(false);
    setCurrentPage('characters');
  };

  // 導航項目的詳細資訊
  const getItemDetails = (key: PageType) => {
    const details = {
      newbie: { description: '新手入門指南、基礎玩法教學' },
      returnPlayer: { description: '回歸玩家快速上手指南' },
      characters: { description: '完整角色圖鑑、能力查詢' },
      shop: { description: '各商店購買優先順序、物品分析' },
      arena: { description: '競技場 / 戰鬥試煉場 / 追憶' },
      clanBattle: { description: '戰隊戰攻略、陣容推薦' },
      dungeon: { description: '深域探索、關卡攻略' },
      characterDevelopment: { description: '角色培養、裝備建議' },
      characterEditor: { description: '角色資料編輯管理' }
    };
    return details[key] || { description: '' };
  };

  // 取得導航項目 (根據管理員模式動態調整)
  const getNavItems = () => {
    const baseItems = [
      { key: 'newbie' as PageType, label: '新人', icon: '🌟' },
      { key: 'returnPlayer' as PageType, label: '回鍋建議', icon: '🔄' },
      { key: 'characters' as PageType, label: '角色圖鑑', icon: '⚔️' },
      { key: 'shop' as PageType, label: '商店', icon: '🛒' },
      { key: 'arena' as PageType, label: '競技/試煉/追憶', icon: '🏟️' },
      { key: 'clanBattle' as PageType, label: '戰隊戰', icon: '🛡️' },
      { key: 'dungeon' as PageType, label: '深域', icon: '🗿' },
      { key: 'characterDevelopment' as PageType, label: '角色養成', icon: '📈' },
    ];

    if (isAdminMode) {
      return [...baseItems, { key: 'characterEditor' as PageType, label: '角色編輯', icon: '✏️' }];
    }

    return baseItems;
  };

  // 渲染當前頁面內容
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'characters':
        return <Characters />;
      case 'characterEditor':
        return isAdminMode ? <CharacterEditor /> : <Characters />;
      case 'newbie':
        return <UnderDevelopment title="新人指南" />;
      case 'returnPlayer':
        return <UnderDevelopment title="回鍋建議" />;
      case 'shop':
        return <Shop />;
      case 'arena':
        return <UnderDevelopment title="競技/試煉/追憶攻略" />;
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
          {/* 右上角管理員區域 */}
          <div className="absolute top-4 right-4">
            {!isAdminMode ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                管理員
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600 font-medium">✓ 管理員模式</span>
                <button
                  onClick={handleAdminLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  登出
                </button>
              </div>
            )}
          </div>

          {/* 標題 */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🌸 公主連結攻略網站 🌸
            </h1>
            <p className="text-gray-600">Princess Connect! Re:Dive Guide</p>
          </div>
          
          {/* 導航按鈕 */}
          <nav className="flex flex-wrap justify-center gap-2 relative">
            {getNavItems().map((item) => (
              <div key={item.key} className="relative">
                <button
                  onClick={() => setCurrentPage(item.key)}
                  onMouseEnter={() => setHoveredItem(item.key)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`px-4 py-2 font-medium transition-all duration-200 flex items-center gap-2 relative ${
                    currentPage === item.key
                      ? 'bg-blue-500 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
                  } ${item.key === 'characterEditor' ? 'border-2 border-orange-400' : ''}`}
                  style={{ borderRadius: '8px' }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm md:text-base">{item.label}</span>
                </button>
                
                {/* Hover 提示卡片 */}
                {hoveredItem === item.key && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs z-50">
                    <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
                      <div className="font-medium mb-1">{item.label}</div>
                      <div className="text-gray-300 text-xs">
                        {getItemDetails(item.key).description}
                      </div>
                      {/* 小箭頭 */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* 管理員登入彈窗 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">管理員登入</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">帳號</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入管理員帳號"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="請輸入密碼"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAdminLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                登入
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginForm({ username: '', password: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 頁面內容 */}
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;
