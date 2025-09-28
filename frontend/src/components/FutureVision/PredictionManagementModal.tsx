import React, { useState, useEffect } from 'react';
import CharacterAutocomplete from '../Common/CharacterAutocomplete';
import { futurePredictionsApi } from '../../services/api';

interface FuturePrediction {
  id: number;
  character_name: string;
  prediction_type: '六星開花' | '專一' | '專二' | '新出' | '復刻';
  predicted_year: number;
  predicted_month: number;
  notes?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const PredictionManagementModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [predictions, setPredictions] = useState<FuturePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPrediction, setEditingPrediction] = useState<Partial<FuturePrediction> | null>(null);
  const [activeMonth, setActiveMonth] = useState<string>('');  // 格式: "YYYY-MM"
  const [formData, setFormData] = useState({
    character_name: '',
    prediction_type: '六星開花' as '六星開花' | '專一' | '專二' | '新出' | '復刻',
    predicted_year: new Date().getFullYear(),
    predicted_month: new Date().getMonth() + 1,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchPredictions();
    }
  }, [isOpen]);

  // 設定預設活躍月份為當前月份
  useEffect(() => {
    if (predictions.length > 0 && !activeMonth) {
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

      // 檢查當前月份是否有預測資料，如果沒有則使用最早的月份
      const availableMonths = getAvailableMonths();
      if (availableMonths.includes(currentMonth)) {
        setActiveMonth(currentMonth);
      } else if (availableMonths.length > 0) {
        setActiveMonth(availableMonths[0]);
      }
    }
  }, [predictions, activeMonth]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const data = await futurePredictionsApi.getAll();
      setPredictions(data);
    } catch (error) {
      console.error('獲取預測失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPrediction?.id) {
        await futurePredictionsApi.update(editingPrediction.id, {
          ...formData,
          notes: formData.notes || undefined
        });
      } else {
        await futurePredictionsApi.create({
          ...formData,
          notes: formData.notes || undefined
        });
      }
      
      setFormData({
        character_name: '',
        prediction_type: '六星開花',
        predicted_year: new Date().getFullYear(),
        predicted_month: new Date().getMonth() + 1,
        notes: ''
      });
      setEditingPrediction(null);
      fetchPredictions();
    } catch (error) {
      console.error('儲存失敗:', error);
      alert('儲存失敗，請稍後再試');
    }
  };

  const handleEdit = (prediction: FuturePrediction) => {
    setEditingPrediction(prediction);
    setFormData({
      character_name: prediction.character_name,
      prediction_type: prediction.prediction_type,
      predicted_year: prediction.predicted_year,
      predicted_month: prediction.predicted_month,
      notes: prediction.notes || ''
    });
  };

  // 獲取所有可用月份
  const getAvailableMonths = (): string[] => {
    const months = new Set<string>();
    predictions.forEach(p => {
      const monthKey = `${p.predicted_year}-${p.predicted_month.toString().padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort();
  };

  // 根據當前選中月份篩選預測
  const getFilteredPredictions = (): FuturePrediction[] => {
    if (!activeMonth) return [];
    const [year, month] = activeMonth.split('-');
    return predictions.filter(p =>
      p.predicted_year === parseInt(year) &&
      p.predicted_month === parseInt(month)
    ).sort((a, b) => {
      // 按 notes 中的數字排序（時間順序）
      const orderA = extractOrderFromNotes(a.notes);
      const orderB = extractOrderFromNotes(b.notes);
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.character_name.localeCompare(b.character_name);
    });
  };

  // 提取 notes 中的數字用於排序
  const extractOrderFromNotes = (notes?: string): number => {
    if (!notes) return 999;
    const trimmedNotes = notes.trim();
    if (/^\d+$/.test(trimmedNotes)) {
      return parseInt(trimmedNotes, 10);
    }
    const match = notes.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 999;
  };

  // 當切換月份時，同步更新新增表單的年月
  const handleMonthChange = (monthKey: string) => {
    setActiveMonth(monthKey);
    const [year, month] = monthKey.split('-');
    setFormData(prev => ({
      ...prev,
      predicted_year: parseInt(year),
      predicted_month: parseInt(month)
    }));
  };

  // 格式化月份顯示
  const formatMonth = (monthKey: string): string => {
    const [year, month] = monthKey.split('-');
    return `${year}年${parseInt(month)}月`;
  };

  const handleDelete = async (id: number) => {
    if (confirm('確定要刪除這個預測嗎？')) {
      try {
        await futurePredictionsApi.delete(id);
        fetchPredictions();
      } catch (error) {
        console.error('刪除失敗:', error);
        alert('刪除失敗，請稍後再試');
      }
    }
  };

  const handleSave = () => {
    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 標題 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">未來視預測管理</h2>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              儲存變更
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              關閉
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* 月份標籤頁 */}
          {predictions.length > 0 && (
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-4 overflow-x-auto">
                {getAvailableMonths().map((monthKey) => (
                  <button
                    key={monthKey}
                    onClick={() => handleMonthChange(monthKey)}
                    className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeMonth === monthKey
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {formatMonth(monthKey)}
                    <span className="ml-1 text-xs text-gray-400">
                      ({predictions.filter(p => {
                        const [year, month] = monthKey.split('-');
                        return p.predicted_year === parseInt(year) && p.predicted_month === parseInt(month);
                      }).length})
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 新增/編輯表單 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {editingPrediction ? '編輯預測' : `新增預測${activeMonth ? ` - ${formatMonth(activeMonth)}` : ''}`}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    角色名稱 *
                  </label>
                  <CharacterAutocomplete
                    value={formData.character_name}
                    onChange={(e) => setFormData({ ...formData, character_name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="輸入角色名稱"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    預測類型 *
                  </label>
                  <select
                    value={formData.prediction_type}
                    onChange={(e) => setFormData({ ...formData, prediction_type: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="六星開花">六星開花</option>
                    <option value="專一">專武1</option>
                    <option value="專二">專武2</option>
                    <option value="新出">新角色</option>
                    <option value="復刻">復刻</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      預計年份 *
                    </label>
                    <input
                      type="number"
                      value={formData.predicted_year}
                      onChange={(e) => setFormData({ ...formData, predicted_year: parseInt(e.target.value) })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      min="2020"
                      max="2030"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      預計月份 *
                    </label>
                    <input
                      type="number"
                      value={formData.predicted_month}
                      onChange={(e) => setFormData({ ...formData, predicted_month: parseInt(e.target.value) })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    時間順序
                  </label>
                  <input
                    type="number"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="輸入數字代表時間順序（如：1, 2, 3...）"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    輸入數字控制同月份內的排序（數字越小排越前面）
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    {editingPrediction ? '更新' : '新增'}
                  </button>
                  {editingPrediction && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPrediction(null);
                        setFormData({
                          character_name: '',
                          prediction_type: '六星開花',
                          predicted_year: new Date().getFullYear(),
                          predicted_month: new Date().getMonth() + 1,
                          notes: ''
                        });
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                    >
                      取消編輯
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* 預測列表 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {activeMonth ? `${formatMonth(activeMonth)}預測` : '現有預測'}
              </h3>

              {loading ? (
                <div className="text-center py-8 text-gray-500">載入中...</div>
              ) : predictions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">暫無預測資料</div>
              ) : getFilteredPredictions().length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {activeMonth ? `${formatMonth(activeMonth)}暫無預測資料` : '請選擇月份'}
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getFilteredPredictions().map(prediction => (
                      <div
                        key={prediction.id}
                        className="bg-gray-50 p-3 rounded border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800">
                            {prediction.character_name}
                          </h4>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(prediction)}
                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                            >
                              編輯
                            </button>
                            <button
                              onClick={() => handleDelete(prediction.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                            >
                              刪除
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                            {prediction.prediction_type}
                          </span>
                          <span>
                            {prediction.predicted_year}年{prediction.predicted_month}月
                          </span>
                        </div>
                        {prediction.notes && (
                          <p className="text-xs text-gray-500 mt-1">{prediction.notes}</p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionManagementModal;