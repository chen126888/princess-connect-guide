import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import Card from '../Common/Card';
import FlexibleTeamLineup from '../Common/FlexibleTeamLineup';
import AddTeamsModal from './AddTeamsModal';
import EditTeamsModal from './EditTeamsModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface TeamData {
  id: number;
  characters: {
    teams: Array<{
      fixedCharacters: string[];
      flexibleOptions?: string[][];
    }>;
  };
  source_url?: string;
  boss_number: number;
  clan_battle_id: number;
}

interface ClanBattleData {
  id: number;
  year: number;
  month: number;
  teams: TeamData[];
}

const FutureSight: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamData | null>(null);
  const [clanBattles, setClanBattles] = useState<ClanBattleData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 檢查管理員權限
    const token = sessionStorage.getItem('authToken');
    console.log('Token:', token);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        setIsAdmin(true);
        console.log('Set isAdmin to true');
      } catch (error) {
        console.error('Token parse error:', error);
        setIsAdmin(false);
      }
    } else {
      console.log('No token found');
      setIsAdmin(false);
    }
    // 載入初始資料
    loadClanBattles();
  }, []);

  // 獲取未來視需要的5個月份（當前月份 + 未來4個月）
  const getFutureSightMonths = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 5; i++) {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({
        year: futureDate.getFullYear(),
        month: futureDate.getMonth() + 1,
        label: `${futureDate.getFullYear()}年${futureDate.getMonth() + 1}月`
      });
    }
    
    return months;
  };

  // 確保未來視所需的 ClanBattle 記錄都存在
  const ensureFutureSightClanBattles = async () => {
    try {
      const futureSightMonths = getFutureSightMonths();
      
      // 批次檢查並創建缺少的 ClanBattle
      const response = await fetch(`${API_BASE_URL}/clan-battles/ensure-future-sight`, { // <--- 已修正
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          months: futureSightMonths.map(m => ({ year: m.year, month: m.month }))
        })
      });
      
      const result = await response.json();
      if (!response.ok) {
        console.error('確保 ClanBattle 記錄失敗:', result.error);
      }
    } catch (error) {
      console.error('確保 ClanBattle 記錄錯誤:', error);
    }
  };

  const loadClanBattles = async () => {
    try {
      setLoading(true);
      
      // 先確保未來視所需的 ClanBattle 都存在
      await ensureFutureSightClanBattles();
      
      // 然後載入所有戰隊戰資料
      const response = await fetch(`${API_BASE_URL}/clan-battles`); // <--- 已修正
      const result = await response.json();
      
      if (response.ok) {
        const battles = result.data || [];
        setClanBattles(battles);
        
        // 設定預設選擇當前月份
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        setSelectedYear(currentYear);
        setSelectedMonth(currentMonth);
      } else {
        console.error('載入戰隊戰資料失敗:', result.error);
      }
    } catch (error) {
      console.error('載入戰隊戰資料錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeams = async (data: any) => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        alert('請先登入管理員帳號');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/clan-battles/batch-teams`, { // <--- 已修正
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '新增隊伍失敗');
      }

      console.log('新增隊伍成功:', result);
      setShowAddModal(false);
      alert('隊伍新增成功！');
      // 重新載入資料
      loadClanBattles();
    } catch (error: any) {
      console.error('新增隊伍失敗:', error);
      alert(`新增隊伍失敗：${error.message}`);
    }
  };

  const handleEditTeam = (team: TeamData) => {
    setEditingTeam(team);
    setShowEditModal(true);
  };

  const handleUpdateTeam = async (data: any) => {
    if (!editingTeam) return;

    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        alert('請先登入管理員帳號');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/clan-battles/teams/${editingTeam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          characters: {
            teams: data.teams
          },
          source_url: data.sourceUrl,
          boss_number: data.bossNumber
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '更新隊伍失敗');
      }

      console.log('更新隊伍成功:', result);
      setShowEditModal(false);
      setEditingTeam(null);
      alert('隊伍更新成功！');
      // 重新載入資料
      loadClanBattles();
    } catch (error: any) {
      console.error('更新隊伍失敗:', error);
      alert(`更新隊伍失敗：${error.message}`);
    }
  };

  const handleDeleteTeam = async (team: TeamData) => {
    if (!confirm(`確定要刪除這個隊伍組合嗎？此操作無法復原。`)) {
      return;
    }

    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        alert('請先登入管理員帳號');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/clan-battles/teams/${team.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '刪除隊伍失敗');
      }

      console.log('刪除隊伍成功:', result);
      alert('隊伍刪除成功！');
      // 重新載入資料
      loadClanBattles();
    } catch (error: any) {
      console.error('刪除隊伍失敗:', error);
      alert(`刪除隊伍失敗：${error.message}`);
    }
  };

  // ... (剩下的程式碼與您提供的一致，所以省略)
  
  // 從資料庫獲取當前選擇年月的隊伍資料
  const getCurrentTeams = () => {
    if (selectedYear === null || selectedMonth === null) {
      return [];
    }
    
    const currentBattle = clanBattles.find(
      battle => battle.year === selectedYear && battle.month === selectedMonth
    );
    
    return currentBattle?.teams || [];
  };

  // 按 Boss 編號分組隊伍
  const getTeamsByBoss = () => {
    const teams = getCurrentTeams();
    const groupedTeams: { [key: number]: TeamData[] } = {};
    
    // 初始化 1-5 王的分組
    for (let i = 1; i <= 5; i++) {
      groupedTeams[i] = [];
    }
    
    // 將隊伍分組到對應的王
    teams.forEach(team => {
      if (team.boss_number >= 1 && team.boss_number <= 5) {
        groupedTeams[team.boss_number].push(team);
      }
    });
    
    return groupedTeams;
  };

  // 獲取未來視可選的年月組合（固定5個月）
  const getAvailableMonths = () => {
    return getFutureSightMonths();
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">戰隊戰未來視</h2>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
            新增隊伍
          </button>
        )}
      </div>
      <div className="text-gray-700 leading-relaxed mb-6">
        <p>戰隊戰未來視 - 隊伍編成資料</p>
      </div>

      {/* 未來視年月選擇按鈕 */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">選擇未來視期間：</h3>
        <div className="flex flex-wrap gap-2">
          {getAvailableMonths().map((period, index) => (
            <button
              key={`${period.year}-${period.month}`}
              onClick={() => {
                setSelectedYear(period.year);
                setSelectedMonth(period.month);
              }}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedYear === period.year && selectedMonth === period.month
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {period.label}
              {index === 0 && <span className="ml-1 text-xs">(當前)</span>}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-500 mt-2 space-y-1">
          <p>※ 未來視資料來源：日服進度（領先台服約5個月），參考YT えるる作業</p>
          {selectedYear && selectedMonth && getCurrentTeams().length > 0 && (
            <div>
              {(() => {
                const firstTeamWithUrl = getCurrentTeams().find(team => team.source_url);
                if (firstTeamWithUrl?.source_url) {
                  return (
                    <p>
                      資料來源：
                      <a 
                        href={firstTeamWithUrl.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline ml-1"
                      >
                        查看攻略影片
                      </a>
                    </p>
                  );
                }
                return null;
              })()}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">載入中...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {getCurrentTeams().length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {selectedYear && selectedMonth 
                  ? `${selectedYear}年${selectedMonth}月目前沒有隊伍資料`
                  : '目前沒有隊伍資料'
                }
              </p>
              {isAdmin && (
                <p className="text-sm text-gray-400">點擊上方「新增隊伍」按鈕來新增第一個隊伍</p>
              )}
            </div>
          ) : (
            Object.entries(getTeamsByBoss()).map(([bossNumber, teams]) => (
              <div key={bossNumber}>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {bossNumber}王
                </h3>
                {teams.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">尚無{bossNumber}王隊伍資料</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teams.map((team) => (
                      <div key={team.id}>
                        {isAdmin && (
                          <div className="flex justify-end gap-2 mb-3">
                            <button
                              onClick={() => handleEditTeam(team)}
                              className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                              <Edit size={14} />
                              編輯
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(team)}
                              className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                              刪除
                            </button>
                          </div>
                        )}
                        {team.characters?.teams?.map((singleTeam, index) => (
                          <div key={index} className="mb-4">
                            <FlexibleTeamLineup 
                              teamData={{
                                id: `${team.id}-${index}`,
                                fixedCharacters: singleTeam.fixedCharacters || [],
                                flexibleOptions: singleTeam.flexibleOptions || []
                              }}
                              bgColor="bg-white"
                              textColor="text-gray-800"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {getCurrentTeams().length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">使用說明</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• 固定角色：隊伍中必須的角色</li>
            <li>• 彈性選項：可替換的角色選擇，點擊切換</li>
            <li>• 斜線選項：同一位置可選擇的多個角色</li>
            <li>• 來源連結：點擊查看詳細攻略說明</li>
          </ul>
        </div>
      )}

      <AddTeamsModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTeams}
        initialYear={selectedYear || 2025}
        initialMonth={selectedMonth || 1}
      />

      <EditTeamsModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTeam(null);
        }}
        onSubmit={handleUpdateTeam}
        initialData={editingTeam}
      />
    </Card>
  );
};

export default FutureSight;