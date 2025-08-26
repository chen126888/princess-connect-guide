import React, { useState, useEffect } from 'react';
import Card from '../../components/Common/Card';
import CharacterAvatar from '../../components/Common/CharacterAvatar';
import { futurePredictionsApi } from '../../services/api';
import { isAuthenticated } from '../../utils/auth';
import { useCharacters } from '../../hooks/useCharacters';
import PredictionManagementModal from '../../components/FutureVision/PredictionManagementModal';

interface FuturePrediction {
  id: number;
  character_name: string;
  prediction_type: '六星開花' | '專一' | '專二' | '新出';
  predicted_year: number;
  predicted_month: number;
  notes?: string;
}

const CharacterPredictions: React.FC = () => {
  const [predictions, setPredictions] = useState<FuturePrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showManagementModal, setShowManagementModal] = useState(false);
  const { characters } = useCharacters();

  const predictionTypes = [
    { value: 'all', label: '全部' },
    { value: '六星開花', label: '六星開花' },
    { value: '專一', label: '專用裝備一' },
    { value: '專二', label: '專用裝備二' },
    { value: '新出', label: '新角色' }
  ];

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const data = await futurePredictionsApi.getAll();
      setPredictions(data);
    } catch (error) {
      console.error('獲取預測資料失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = selectedType === 'all' 
    ? predictions 
    : predictions.filter(p => p.prediction_type === selectedType);

  const groupedByMonth = filteredPredictions.reduce((acc, prediction) => {
    const key = `${prediction.predicted_year}-${prediction.predicted_month.toString().padStart(2, '0')}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(prediction);
    return acc;
  }, {} as Record<string, FuturePrediction[]>);

  // 提取 notes 中的數字用於排序
  const extractOrderFromNotes = (notes?: string): number => {
    if (!notes) return 999; // 沒有 notes 的項目排在最後
    const trimmedNotes = notes.trim();
    // 檢查是否只是純數字
    if (/^\d+$/.test(trimmedNotes)) {
      return parseInt(trimmedNotes, 10);
    }
    // 如果不是純數字，嘗試匹配開頭的數字
    const match = notes.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 999;
  };

  // 對每個月份內的預測按照 notes 中的數字排序
  Object.keys(groupedByMonth).forEach(monthKey => {
    groupedByMonth[monthKey].sort((a, b) => {
      const orderA = extractOrderFromNotes(a.notes);
      const orderB = extractOrderFromNotes(b.notes);
      if (orderA !== orderB) {
        return orderA - orderB; // 按數字升序排序
      }
      // 如果數字相同，按角色名稱排序
      return a.character_name.localeCompare(b.character_name);
    });
  });

  const formatMonth = (year: number, month: number) => {
    return `${year}年${month}月`;
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (type) {
      case '六星開花': return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-300`;
      case '專一': return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-300`;
      case '專二': return `${baseClasses} bg-purple-100 text-purple-800 border border-purple-300`;
      case '新出': return `${baseClasses} bg-green-100 text-green-800 border border-green-300`;
      default: return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-300`;
    }
  };

  // 根據角色名稱找到對應的角色資料
  const findCharacterByName = (characterName: string) => {
    return characters.find(char => 
      char.角色名稱 === characterName || char.暱稱 === characterName
    ) || null;
  };

  // 格式化 notes 顯示（隱藏純數字，保留其他內容）
  const formatNotesForDisplay = (notes?: string): string => {
    if (!notes) return '';
    const trimmedNotes = notes.trim();
    // 如果是純數字，不顯示
    if (/^\d+$/.test(trimmedNotes)) {
      return '';
    }
    // 如果不是純數字，移除開頭的數字和可能的分隔符
    return notes.replace(/^\d+[\s\.\:\-]*/, '').trim();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 管理員按鈕和類型篩選器 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {predictionTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedType === type.value
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* 管理員按鈕 */}
        {isAuthenticated() && (
          <button
            onClick={() => setShowManagementModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            管理預測
          </button>
        )}
      </div>

      {/* 預測列表 */}
      {Object.keys(groupedByMonth).length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {selectedType === 'all' ? '暫無預測資料' : `暫無「${selectedType}」相關預測`}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByMonth)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([monthKey, monthPredictions]) => {
              const [year, month] = monthKey.split('-');
              return (
                <Card key={monthKey} className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {formatMonth(parseInt(year), parseInt(month))}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {monthPredictions.map(prediction => {
                      const character = findCharacterByName(prediction.character_name);
                      return (
                        <div
                          key={prediction.id}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <CharacterAvatar
                              character={character}
                              characterName={prediction.character_name}
                              size="medium"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-800 font-medium truncate">
                                {prediction.character_name}
                              </h3>
                              <span className={getTypeBadge(prediction.prediction_type)}>
                                {prediction.prediction_type}
                              </span>
                            </div>
                          </div>
                          
                          {prediction.notes && formatNotesForDisplay(prediction.notes) && (
                            <p className="text-gray-600 text-sm mt-2">
                              {formatNotesForDisplay(prediction.notes)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      {/* 管理模態窗口 */}
      <PredictionManagementModal
        isOpen={showManagementModal}
        onClose={() => setShowManagementModal(false)}
        onSave={() => {
          fetchPredictions();
        }}
      />
    </div>
  );
};

export default CharacterPredictions;