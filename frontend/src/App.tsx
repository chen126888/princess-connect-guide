import { useState, useEffect } from 'react';
import Home from './pages/Home/Home';
import Characters from './pages/Characters/Characters';
import CharacterEditor from './pages/CharacterEditor/CharacterEditor';
import Shop from './pages/Shop/Shop';
import Arena from './pages/Arena/Arena';
import ClanBattle from './pages/ClanBattle/ClanBattle';
import Dungeon from './pages/Dungeon/Dungeon';
import CharacterDevelopmentPage from './pages/CharacterDevelopment/CharacterDevelopment';
import Newbie from './pages/Newbie/Newbie';
import ReturnPlayer from './pages/ReturnPlayer/ReturnPlayer';
import SuperAdminInitModal from './components/Admin/SuperAdminInitModal';
import AdminManagement from './components/Admin/AdminManagement';
import { setAuthToken, removeAuthToken, isAuthenticated, getCurrentAdmin } from './utils/auth';

// 頁面類型定義
type PageType = 
  | 'home'
  | 'newbie' 
  | 'returnPlayer' 
  | 'characters' 
  | 'characterEditor'
  | 'shop' 
  | 'arena' 
  | 'clanBattle' 
  | 'dungeon' 
  | 'characterDevelopment';



function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [hoveredItem, setHoveredItem] = useState<PageType | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<PageType>>(new Set());
  const [needsInit, setNeedsInit] = useState(false);
  const [showAdminManagement, setShowAdminManagement] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  // 檢查登入狀態和初始化
  useEffect(() => {
    const checkAuthAndInit = async () => {
      try {
        // 檢查本地 Token
        if (isAuthenticated()) {
          const admin = getCurrentAdmin();
          if (admin) {
            setIsAdminMode(true);
            setCurrentAdmin({
              ...admin,
              name: admin.name // 這裡可能需要重新獲取完整資訊
            });
          }
        }

        // 檢查是否需要初始化
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/auth/check-init`);
        const data = await response.json();
        setNeedsInit(data.needsInit);
      } catch (error) {
        console.error('Check auth and init error:', error);
      }
      setInitLoading(false);
    };

    checkAuthAndInit();
  }, []);

  // 管理員登入處理
  const handleAdminLogin = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 儲存 JWT Token 和管理員資訊
        setAuthToken(data.token, data.admin);
        
        setIsAdminMode(true);
        setCurrentAdmin(data.admin);
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
    removeAuthToken();
    setIsAdminMode(false);
    setCurrentAdmin(null);
    setCurrentPage('home');
  };

  // 初始化完成回調
  const handleInitComplete = () => {
    setNeedsInit(false);
  };

  // 處理圖片載入錯誤
  const handleImageError = (pageKey: PageType) => {
    setImageErrors(prev => new Set(prev).add(pageKey));
  };

  // 取得按鈕圖標
  const getNavIcon = (item: any) => {
    if (item.useImage && !imageErrors.has(item.key)) {
      return (
        <img 
          src="https://princess-connect-guide.onrender.com/images/icons/商店.png"
          alt={item.label}
          className="w-5 h-5 object-contain"
          onError={() => handleImageError(item.key)}
        />
      );
    }
    return <span className="text-lg">{item.icon}</span>;
  };

  // 導航項目的詳細資訊
  const getItemDetails = (key: PageType) => {
    const details = {
      home: { description: '網站首頁、功能總覽' },
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
      { key: 'home' as PageType, label: '首頁', icon: '🏠' },
      { key: 'newbie' as PageType, label: '新人', icon: '🌟' },
      { key: 'returnPlayer' as PageType, label: '回鍋建議', icon: '🔄' },
      { key: 'characters' as PageType, label: '角色圖鑑', icon: '⚔️' },
      { key: 'shop' as PageType, label: '商店', icon: '🛒', useImage: true },
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
      case 'home':
        return <Home isAdminMode={isAdminMode} />;
      case 'characters':
        return <Characters />;
      case 'characterEditor':
        return isAdminMode ? <CharacterEditor /> : <Characters />;
      case 'newbie':
        return <Newbie />;
      case 'returnPlayer':
        return <ReturnPlayer onNavigateToPage={(page) => setCurrentPage(page as PageType)} />;
      case 'shop':
        return <Shop />;
      case 'arena':
        return <Arena />;
      case 'clanBattle':
        return <ClanBattle />;
      case 'dungeon':
        return <Dungeon />;
      case 'characterDevelopment':
        return <CharacterDevelopmentPage />;
      default:
        return <Home />;
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
                <span className="text-sm text-green-600 font-medium">✓ {currentAdmin?.name || '管理員'}模式</span>
                {currentAdmin?.role === 'superadmin' && (
                  <button
                    onClick={() => setShowAdminManagement(true)}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors"
                  >
                    管理員
                  </button>
                )}
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
              🌸 公主連結新手向攻略網站 🌸
            </h1>
            <p className="text-gray-600">Princess Connect! Re:Dive Guide</p>
          </div>
          
          {/* 導航按鈕 */}
          <nav className="flex justify-center gap-1 relative overflow-x-auto">
            {getNavItems().map((item) => (
              <div key={item.key} className="relative">
                <button
                  onClick={() => setCurrentPage(item.key)}
                  onMouseEnter={() => setHoveredItem(item.key)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`px-2 py-2 font-medium transition-all duration-200 flex items-center gap-1 relative whitespace-nowrap ${
                    currentPage === item.key
                      ? 'bg-blue-500 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
                  } ${item.key === 'characterEditor' ? 'border-2 border-orange-400' : ''}`}
                  style={{ borderRadius: '8px' }}
                >
                  {getNavIcon(item)}
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

      {/* 超級管理員初始化彈窗 */}
      {needsInit && !initLoading && (
        <SuperAdminInitModal onInitComplete={handleInitComplete} />
      )}

      {/* 管理員管理彈窗 */}
      {showAdminManagement && currentAdmin?.role === 'superadmin' && (
        <AdminManagement 
          onClose={() => setShowAdminManagement(false)} 
        />
      )}

      {/* 頁面內容 */}
      <main>
        {initLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl mb-4">🌸 公主連結新手向攻略網站 🌸</div>
              <div className="text-gray-600">載入中...</div>
            </div>
          </div>
        ) : needsInit ? null : (
          renderCurrentPage()
        )}
      </main>
    </div>
  );
}

export default App;
