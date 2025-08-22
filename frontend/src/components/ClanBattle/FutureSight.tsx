import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import Card from '../Common/Card';
import FlexibleTeamLineup from '../Common/FlexibleTeamLineup';
import AddTeamsModal from './AddTeamsModal';
import EditTeamsModal from './EditTeamsModal';

interface TeamData {
  id: number;
  description: string;
  characters: {
    teams: Array<{
      name: string;
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
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 檢查管理員權限
    const token = localStorage.getItem('adminToken');
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

  const loadClanBattles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/clan-battles');
      const result = await response.json();
      
      if (response.ok) {
        setClanBattles(result.data || []);
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
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('請先登入管理員帳號');
        return;
      }

      const response = await fetch('http://localhost:3000/api/clan-battles/batch-teams', {
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
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('請先登入管理員帳號');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/clan-battles/teams/${editingTeam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: data.description,
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
    if (!confirm(`確定要刪除「${team.description}」嗎？此操作無法復原。`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('請先登入管理員帳號');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/clan-battles/teams/${team.id}`, {
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

  const testTeams = [
    {
      id: 1,
      description: '全固定隊伍',
      characters: {
        teams: [{
          name: '一刀隊',
          fixedCharacters: ['佩可', '可可蘿', '優妮(聖學祭)', '春田', '紐咕嚕'],
          flexibleOptions: []
        }]
      },
      boss_number: 1,
      clan_battle_id: 1,
      title: '全固定隊伍',
      data: {
        id: 'all-fixed',
        fixedCharacters: ['佩可', '可可蘿', '優妮(聖學祭)', '春田', '紐咕嚕']
      }
    },
    {
      id: 2,
      description: '3固定+2彈性',
      characters: {
        teams: [{
          name: '彈性隊',
          fixedCharacters: ['佩可', '可可蘿', '優妮(聖學祭)'],
          flexibleOptions: [
            ['春田', '香織', '真步'],
            ['紐咕嚕', '雪', '茜里']
          ]
        }]
      },
      boss_number: 2,
      clan_battle_id: 1,
      title: '3固定+2彈性',
      data: {
        id: '3-fixed-2-flexible',
        fixedCharacters: ['佩可', '可可蘿', '優妮(聖學祭)'],
        flexibleOptions: [
          ['春田', '香織', '真步'],
          ['紐咕嚕', '雪', '茜里']
        ]
      }
    },
    {
      id: 3,
      description: '2固定+3彈性',
      characters: {
        teams: [{
          name: '高彈性隊',
          fixedCharacters: ['佩可', '可可蘿'],
          flexibleOptions: [
            ['優妮(聖學祭)', '美美', '茜里'],
            ['春田', '香織'],
            ['紐咕嚕', '雪', '真步', '碧']
          ]
        }]
      },
      boss_number: 3,
      clan_battle_id: 1,
      title: '2固定+3彈性', 
      data: {
        id: '2-fixed-3-flexible',
        fixedCharacters: ['佩可', '可可蘿'],
        flexibleOptions: [
          ['優妮(聖學祭)', '美美', '茜里'],
          ['春田', '香織'],
          ['紐咕嚕', '雪', '真步', '碧']
        ]
      }
    },
    {
      id: 4,
      description: '1固定+4彈性',
      characters: {
        teams: [{
          name: '超彈性隊',
          fixedCharacters: ['佩可'],
          flexibleOptions: [
            ['可可蘿', '茜里'],
            ['優妮(聖學祭)', '美美'],
            ['春田', '香織', '真步'],
            ['紐咕嚕', '雪', '碧', '鈴奈']
          ]
        }]
      },
      boss_number: 4,
      clan_battle_id: 1,
      title: '1固定+4彈性',
      data: {
        id: '1-fixed-4-flexible', 
        fixedCharacters: ['佩可'],
        flexibleOptions: [
          ['可可蘿', '茜里'],
          ['優妮(聖學祭)', '美美'],
          ['春田', '香織', '真步'],
          ['紐咕嚕', '雪', '碧', '鈴奈']
        ]
      }
    },
    {
      id: 5,
      description: '固定角色含斜線選項',
      characters: {
        teams: [{
          name: '選擇隊',
          fixedCharacters: ['佩可', '可可蘿/茜里', '優妮(聖學祭)'],
          flexibleOptions: [
            ['春田', '香織'],
            ['紐咕嚕', '雪']
          ]
        }]
      },
      boss_number: 5,
      clan_battle_id: 1,
      title: '固定角色含斜線選項',
      data: {
        id: 'fixed-with-options',
        fixedCharacters: ['佩可', '可可蘿/茜里', '優妮(聖學祭)'],
        flexibleOptions: [
          ['春田', '香織'],
          ['紐咕嚕', '雪']
        ]
      }
    }
  ];

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
        <p>FlexibleTeamLineup 元件測試</p>
      </div>

      <div className="space-y-6">
        {testTeams.map((team) => (
          <div key={team.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {team.title}
              </h3>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTeam(team as any)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    <Edit size={14} />
                    編輯
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team as any)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                    刪除
                  </button>
                </div>
              )}
            </div>
            <FlexibleTeamLineup 
              teamData={team.data}
              bgColor="bg-white"
              textColor="text-gray-800"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">測試說明</h3>
        <ul className="text-blue-700 space-y-1 text-sm">
          <li>• 全固定：只顯示固定角色，無彈性選項</li>
          <li>• 3+2、2+3、1+4：不同比例的固定與彈性組合</li>
          <li>• 斜線選項：固定位置也可以有多個選擇</li>
          <li>• 彈性選項：可點擊按鈕切換不同角色</li>
        </ul>
      </div>

      <AddTeamsModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTeams}
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