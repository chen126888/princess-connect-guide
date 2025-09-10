import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/Common/Card';
import FlexibleTeamLineup from '../../components/Common/FlexibleTeamLineup';
import AddAbyssTeamsModal from '../../components/AbyssRaid/AddAbyssTeamsModal';
import EditAbyssTeamsModal from '../../components/AbyssRaid/EditAbyssTeamsModal';
import type { TeamData } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface DatabaseAbyssTeamData {
  id: number;
  characters: {
    teams: TeamData[];
  };
  boss_position: string; // "left", "middle", "right"
  abyss_raid_id: number;
}

interface AbyssRaidData {
  id: number;
  year: number;
  month: number;
  source_url?: string;
  teams: DatabaseAbyssTeamData[];
}

const AbyssRaidFuture: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<DatabaseAbyssTeamData | null>(null);
  const [abyssRaids, setAbyssRaids] = useState<AbyssRaidData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 檢查管理員權限
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        // 檢查 token 是否有效
        JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(true);
      } catch (error) {
        console.error('Token parse error:', error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
    // 載入初始資料
    loadAbyssRaids();
  }, []);

  // 獲取深淵討伐未來視需要的5個月份（當月10號以後顯示下個月開始的5個月，否則顯示當月開始的5個月）
  const getAbyssRaidFutureSightMonths = () => {
    const months = [];
    const now = new Date();
    
    // 如果當前日期是10號或以後，從下個月開始顯示5個月
    const startOffset = now.getDate() >= 10 ? 1 : 0;
    
    for (let i = 0; i < 5; i++) {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + startOffset + i, 1);
      months.push({
        year: futureDate.getFullYear(),
        month: futureDate.getMonth() + 1,
        label: `${futureDate.getFullYear()}年${futureDate.getMonth() + 1}月`
      });
    }
    
    return months;
  };

  // 確保未來視所需的 AbyssRaid 記錄都存在
  const ensureFutureSightAbyssRaids = async () => {
    try {
      const futureSightMonths = getAbyssRaidFutureSightMonths();
      
      // 檢查並創建缺少的 AbyssRaid
      for (const month of futureSightMonths) {
        try {
          const response = await fetch(`${API_BASE_URL}/abyss-raids/${month.year}/${month.month}`);
          
          if (response.status === 404) {
            // 如果不存在，則創建
            const token = sessionStorage.getItem('authToken');
            if (token) {
              const createResponse = await fetch(`${API_BASE_URL}/abyss-raids`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  year: month.year,
                  month: month.month
                })
              });
              
              if (!createResponse.ok) {
                console.error(`創建 ${month.year}年${month.month}月深淵討伐記錄失敗`);
              }
            }
          }
        } catch (error) {
          console.error(`檢查 ${month.year}年${month.month}月深淵討伐記錄錯誤:`, error);
        }
      }
    } catch (error) {
      console.error('確保深淵討伐記錄錯誤:', error);
    }
  };

  const loadAbyssRaids = async () => {
    try {
      setLoading(true);
      
      // 先確保未來視所需的 AbyssRaid 都存在
      await ensureFutureSightAbyssRaids();
      
      // 然後載入所有深淵討伐資料
      const response = await fetch(`${API_BASE_URL}/abyss-raids`);
      const result = await response.json();
      
      if (response.ok) {
        setAbyssRaids(result);
        
        // 設定預設選擇月份（根據深淵討伐規則：10號以後選下個月，否則選當月）
        const futureSightMonths = getAbyssRaidFutureSightMonths();
        const defaultMonth = futureSightMonths[0]; // 取第一個月份作為預設
        
        setSelectedYear(defaultMonth.year);
        setSelectedMonth(defaultMonth.month);
      } else {
        console.error('載入深淵討伐資料失敗:', result.error);
      }
    } catch (error) {
      console.error('載入深淵討伐資料錯誤:', error);
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

      // 找到對應的深淵討伐記錄
      const targetRaid = abyssRaids.find(
        raid => raid.year === data.year && raid.month === data.month
      );

      if (!targetRaid) {
        alert('找不到對應的深淵討伐記錄');
        return;
      }

      // 轉換隊伍資料並新增到深淵討伐
      for (const team of data.teams) {
        const response = await fetch(`${API_BASE_URL}/abyss-raids/${targetRaid.id}/teams`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            characters: { teams: [team] },
            boss_position: getBossPosition(team.bossNumber)
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || '新增隊伍失敗');
        }
      }

      setShowAddModal(false);
      alert('隊伍新增成功！');
      // 重新載入資料
      loadAbyssRaids();
    } catch (error: any) {
      console.error('新增隊伍失敗:', error);
      alert(`新增隊伍失敗：${error.message}`);
    }
  };

  // 將 boss_number 轉換為 boss_position
  const getBossPosition = (bossNumber: number) => {
    switch (bossNumber) {
      case 1: return 'left';
      case 2: return 'middle';
      case 3: return 'right';
      default: return 'left';
    }
  };

  // 將 boss_position 轉換為顯示文字
  const getBossDisplayName = (position: string) => {
    switch (position) {
      case 'left': return '左王';
      case 'middle': return '中王';
      case 'right': return '右王';
      default: return position;
    }
  };

  const handleEditTeam = (team: DatabaseAbyssTeamData) => {
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

      const response = await fetch(`${API_BASE_URL}/abyss-raids/teams/${editingTeam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          characters: {
            teams: data.teams
          },
          boss_position: getBossPosition(data.bossNumber)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '更新隊伍失敗');
      }

      setShowEditModal(false);
      setEditingTeam(null);
      alert('隊伍更新成功！');
      // 重新載入資料
      loadAbyssRaids();
    } catch (error: any) {
      console.error('更新隊伍失敗:', error);
      alert(`更新隊伍失敗：${error.message}`);
    }
  };

  const handleDeleteTeam = async (team: DatabaseAbyssTeamData) => {
    if (!confirm(`確定要刪除這個隊伍組合嗎？此操作無法復原。`)) {
      return;
    }

    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        alert('請先登入管理員帳號');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/abyss-raids/teams/${team.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '刪除隊伍失敗');
      }

      alert('隊伍刪除成功！');
      // 重新載入資料
      loadAbyssRaids();
    } catch (error: any) {
      console.error('刪除隊伍失敗:', error);
      alert(`刪除隊伍失敗：${error.message}`);
    }
  };
  
  // 從資料庫獲取當前選擇年月的隊伍資料
  const getCurrentTeams = () => {
    if (selectedYear === null || selectedMonth === null) {
      return [];
    }
    
    const currentRaid = abyssRaids.find(
      raid => raid.year === selectedYear && raid.month === selectedMonth
    );
    
    return currentRaid?.teams || [];
  };

  // 按 Boss 位置分組隊伍
  const getTeamsByBoss = () => {
    const teams = getCurrentTeams();
    const groupedTeams: { [key: string]: DatabaseAbyssTeamData[] } = {
      left: [],
      middle: [],
      right: []
    };
    
    // 將隊伍分組到對應的王位置
    teams.forEach(team => {
      if (groupedTeams[team.boss_position]) {
        groupedTeams[team.boss_position].push(team);
      }
    });
    
    return groupedTeams;
  };

  // 獲取未來視可選的年月組合（固定5個月）
  const getAvailableMonths = () => {
    return getAbyssRaidFutureSightMonths();
  };

  // 獲取當前選擇的深淵討伐資料來源
  const getCurrentSourceUrl = () => {
    if (selectedYear === null || selectedMonth === null) {
      return null;
    }
    
    const currentRaid = abyssRaids.find(
      raid => raid.year === selectedYear && raid.month === selectedMonth
    );
    
    return currentRaid?.source_url || null;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">深淵討伐未來視</h2>
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
        <div className="text-gray-600 leading-relaxed mb-6">
          <p>提供深淵討伐推薦隊伍配置。每個人實際傷害依據各自屬性加成和角色練度而有所不同。</p>
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
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {period.label}
                {index === 0 && <span className="ml-1 text-xs">(當前)</span>}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-2 space-y-1">
            <p>※ 未來視資料來源：日服進度（領先台服約5個月）</p>
            {getCurrentSourceUrl() && (
              <p>
                資料來源：
                <a 
                  href={getCurrentSourceUrl()!} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline ml-1"
                >
                  查看攻略影片
                </a>
              </p>
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
              Object.entries(getTeamsByBoss()).map(([bossPosition, teams]) => (
                <div key={bossPosition}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {getBossDisplayName(bossPosition)}
                  </h3>
                  {teams.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-500">尚無{getBossDisplayName(bossPosition)}隊伍資料</p>
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
                                  ...singleTeam,
                                  id: `${team.id}-${index}`
                                }}
                                bgColor="bg-gray-50"
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
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">使用說明</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• 固定角色：隊伍中必須的角色</li>
              <li>• 彈性選項：可替換的角色選擇，點擊切換</li>
              <li>• 斜線選項：同一位置可選擇的多個角色</li>
              <li>• 來源連結：點擊查看詳細攻略說明</li>
            </ul>
          </div>
        )}

        <AddAbyssTeamsModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTeams}
          initialYear={selectedYear || 2025}
          initialMonth={selectedMonth || 1}
        />

        <EditAbyssTeamsModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingTeam(null);
          }}
          onSubmit={handleUpdateTeam}
          initialData={editingTeam ? {
            ...editingTeam,
            boss_number: editingTeam.boss_position === 'left' ? 1 
                      : editingTeam.boss_position === 'middle' ? 2 
                      : 3,
            characters: editingTeam.characters
          } : undefined}
        />
      </Card>
    </div>
  );
};

export default AbyssRaidFuture;