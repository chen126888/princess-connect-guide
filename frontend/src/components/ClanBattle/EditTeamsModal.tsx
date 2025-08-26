import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { TeamData } from '../../types';

interface EditTeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    sourceUrl?: string;
    bossNumber: number;
    teams: TeamData[];
  }) => void;
  initialData?: {
    id: number;
    characters: {
      teams: Array<{
        fixedCharacters: string[];
        flexibleOptions?: string[][];
      }>;
    };
    source_url?: string;
    boss_number: number;
  };
}

const EditTeamsModal: React.FC<EditTeamsModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [bossNumber, setBossNumber] = useState(1);
  const [sourceUrl, setSourceUrl] = useState('');
  const [teams, setTeams] = useState<TeamData[]>([
    {fixedCharacters: [], flexibleOptions: [] }
  ]);

  // 載入初始資料
  useEffect(() => {
    if (initialData && isOpen) {
      setBossNumber(initialData.boss_number);
      setSourceUrl(initialData.source_url || '');
      setTeams(initialData.characters.teams.length > 0 ? initialData.characters.teams.map(team => ({
        fixedCharacters: team.fixedCharacters,
        flexibleOptions: team.flexibleOptions || [],
        damageInfo: (team as any).damageInfo || { fullAuto: [], semiAuto: [] }
      })) : [
        {
          fixedCharacters: [], 
          flexibleOptions: [],
          damageInfo: { fullAuto: [], semiAuto: [] }
        }
      ]);
    }
  }, [initialData, isOpen]);

  const addTeam = () => {
    setTeams([...teams, { 
      fixedCharacters: [], 
      flexibleOptions: [],
      damageInfo: { fullAuto: [], semiAuto: [] }
    }]);
  };

  const removeTeam = (index: number) => {
    if (teams.length > 1) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };


  const addFixedCharacter = (teamIndex: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex].fixedCharacters.push('');
    setTeams(newTeams);
  };

  const updateFixedCharacter = (teamIndex: number, charIndex: number, value: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].fixedCharacters[charIndex] = value;
    setTeams(newTeams);
  };

  const removeFixedCharacter = (teamIndex: number, charIndex: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex].fixedCharacters.splice(charIndex, 1);
    setTeams(newTeams);
  };

  const addFlexibleGroup = (teamIndex: number) => {
    const newTeams = [...teams];
    if (!newTeams[teamIndex].flexibleOptions) {
      newTeams[teamIndex].flexibleOptions = [];
    }
    newTeams[teamIndex].flexibleOptions!.push(['']);
    setTeams(newTeams);
  };

  const updateFlexibleOption = (teamIndex: number, groupIndex: number, optionIndex: number, value: string) => {
    const newTeams = [...teams];
    if (newTeams[teamIndex].flexibleOptions) {
      newTeams[teamIndex].flexibleOptions![groupIndex][optionIndex] = value;
    }
    setTeams(newTeams);
  };

  const addFlexibleOption = (teamIndex: number, groupIndex: number) => {
    const newTeams = [...teams];
    if (newTeams[teamIndex].flexibleOptions) {
      newTeams[teamIndex].flexibleOptions![groupIndex].push('');
    }
    setTeams(newTeams);
  };

  const removeFlexibleGroup = (teamIndex: number, groupIndex: number) => {
    const newTeams = [...teams];
    if (newTeams[teamIndex].flexibleOptions) {
      newTeams[teamIndex].flexibleOptions!.splice(groupIndex, 1);
    }
    setTeams(newTeams);
  };

  const removeFlexibleOption = (teamIndex: number, groupIndex: number, optionIndex: number) => {
    const newTeams = [...teams];
    if (newTeams[teamIndex].flexibleOptions && newTeams[teamIndex].flexibleOptions![groupIndex].length > 1) {
      newTeams[teamIndex].flexibleOptions![groupIndex].splice(optionIndex, 1);
    }
    setTeams(newTeams);
  };

  // 傷害資訊相關函數
  const updateDamageInfo = (teamIndex: number, type: 'fullAuto' | 'semiAuto', combinationIndex: number, value: string) => {
    const newTeams = [...teams];
    if (!newTeams[teamIndex].damageInfo) {
      newTeams[teamIndex].damageInfo = { fullAuto: [], semiAuto: [] };
    }
    
    // 確保陣列長度足夠
    const combinationCount = Math.max(1, newTeams[teamIndex].flexibleOptions?.length || 1);
    while (newTeams[teamIndex].damageInfo![type]!.length < combinationCount) {
      newTeams[teamIndex].damageInfo![type]!.push(null);
    }
    
    newTeams[teamIndex].damageInfo![type]![combinationIndex] = value.trim() || null;
    setTeams(newTeams);
  };

  // 獲取組合數量
  const getCombinationCount = (team: TeamData): number => {
    return Math.max(1, team.flexibleOptions?.length || 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validTeams = teams.filter(team => 
      (team.fixedCharacters.some(char => char.trim()) || (team.flexibleOptions?.length || 0) > 0)
    );

    if (validTeams.length === 0) {
      alert('請至少新增一支有效的隊伍');
      return;
    }

    onSubmit({
      bossNumber,
      sourceUrl: sourceUrl.trim() || undefined,
      teams: validTeams
    });
  };

  const resetForm = () => {
    setBossNumber(1);
    setSourceUrl('');
    setTeams([{
      fixedCharacters: [], 
      flexibleOptions: [],
      damageInfo: { fullAuto: [], semiAuto: [] }
    }]);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">編輯隊伍推薦</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Boss編號
              </label>
              <select
                value={bossNumber}
                onChange={(e) => setBossNumber(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}王</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                來源網址
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
          </div>


          {/* 隊伍列表 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">隊伍組成</h3>
              <button
                type="button"
                onClick={addTeam}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Plus size={16} />
                新增隊伍
              </button>
            </div>

            {teams.map((team, teamIndex) => (
              <div key={teamIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-800">隊伍 {teamIndex + 1}</h4>
                  {teams.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeam(teamIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">

                  {/* 固定角色 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">固定角色</label>
                      <button
                        type="button"
                        onClick={() => addFixedCharacter(teamIndex)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        + 新增
                      </button>
                    </div>
                    <div className="space-y-2">
                      {team.fixedCharacters.map((char, charIndex) => (
                        <div key={charIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={char}
                            onChange={(e) => updateFixedCharacter(teamIndex, charIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="角色名稱"
                          />
                          <button
                            type="button"
                            onClick={() => removeFixedCharacter(teamIndex, charIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 彈性選項 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">彈性選項組</label>
                      <button
                        type="button"
                        onClick={() => addFlexibleGroup(teamIndex)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        + 新增組
                      </button>
                    </div>
                    <div className="space-y-3">
                      {team.flexibleOptions?.map((group, groupIndex) => (
                        <div key={groupIndex} className="border border-gray-100 rounded p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">選項組 {groupIndex + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeFlexibleGroup(teamIndex, groupIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="space-y-2">
                            {group.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateFlexibleOption(teamIndex, groupIndex, optionIndex, e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="角色名稱"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeFlexibleOption(teamIndex, groupIndex, optionIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addFlexibleOption(teamIndex, groupIndex)}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              + 新增選項
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 傷害資訊 */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">傷害資訊</h5>
                    <div className="space-y-2">
                      {Array.from({ length: getCombinationCount(team) }, (_, combIndex) => (
                        <div key={combIndex} className="bg-gray-50 rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              {getCombinationCount(team) > 1 ? `組合 ${combIndex + 1}` : '隊伍傷害'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">全自動</label>
                              <input
                                type="text"
                                value={team.damageInfo?.fullAuto?.[combIndex] || ''}
                                onChange={(e) => updateDamageInfo(teamIndex, 'fullAuto', combIndex, e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="例：1000萬"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">半自動</label>
                              <input
                                type="text"
                                value={team.damageInfo?.semiAuto?.[combIndex] || ''}
                                onChange={(e) => updateDamageInfo(teamIndex, 'semiAuto', combIndex, e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="例：1200萬"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 提交按鈕 */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              更新隊伍
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeamsModal;