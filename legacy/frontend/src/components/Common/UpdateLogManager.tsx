import React, { useState } from 'react';
import { updateLogs, type UpdateLogItem } from '../../data/updateLogData';

interface UpdateLogManagerProps {
  onClose: () => void;
}

const UpdateLogManager: React.FC<UpdateLogManagerProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    type: 'minor' as UpdateLogItem['type'],
    title: '',
    items: [''],
    summary: ''
  });
  const [generatedCode, setGeneratedCode] = useState('');

  // 計算下一個版本號
  const getNextVersion = (type: UpdateLogItem['type']) => {
    if (updateLogs.length === 0) return 'v1.0.0';
    
    const currentVersion = updateLogs[0].version.replace('v', '');
    const versionParts = currentVersion.split('.');
    const major = parseInt(versionParts[0]) || 1;
    const minor = parseInt(versionParts[1]) || 0;
    const patch = parseInt(versionParts[2]) || 0;
    
    switch (type) {
      case 'major':
        return `v${major + 1}.0.0`;
      case 'minor':
        return `v${major}.${minor + 1}.0`;
      case 'patch':
        return `v${major}.${minor}.${patch + 1}`;
      default:
        return `v${major}.${minor + 1}.0`;
    }
  };

  // 獲取當前日期
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // 添加新的更新項目
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, '']
    }));
  };

  // 移除更新項目
  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // 更新項目內容
  const updateItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? value : item)
    }));
  };

  // 生成代碼
  const generateCode = () => {
    const nextVersion = getNextVersion(formData.type);
    const currentDate = getCurrentDate();
    
    const codeTemplate = `{
  date: '${currentDate}',
  version: '${nextVersion}',
  title: '${formData.title}',
  type: '${formData.type}',
  items: [
${formData.items.filter(item => item.trim()).map(item => `    '${item}'`).join(',\n')}
  ]${formData.summary ? `,\n  summary: '${formData.summary}'` : ''}
}`;

    setGeneratedCode(codeTemplate);
  };

  // 複製到剪貼板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('代碼已複製到剪貼板！');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 標題 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📝 新增更新日誌</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {!generatedCode ? (
            // 表單模式
            <div className="space-y-6">
              {/* 版本類型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  更新類型 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['major', 'minor', 'patch'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData(prev => ({ ...prev, type }))}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        formData.type === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{type.toUpperCase()}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {type === 'major' && '大版本更新'}
                        {type === 'minor' && '功能更新'}
                        {type === 'patch' && '修正更新'}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        將生成: {getNextVersion(type)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 標題 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  更新標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="例如：📝 角色評級更新"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 更新項目 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  更新項目 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateItem(index, e.target.value)}
                        placeholder="例如：更新 **戰隊戰評級** - 調整華音、彩羽等角色評價"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {formData.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addItem}
                    className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
                  >
                    + 添加更新項目
                  </button>
                </div>
              </div>

              {/* 摘要 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  摘要 (可選)
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="例如：🔄 根據最新版本調整角色評價與新角色資料"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 預覽信息 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">預覽信息</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>日期：</strong>{getCurrentDate()}</p>
                  <p><strong>版本：</strong>{getNextVersion(formData.type)}</p>
                  <p><strong>類型：</strong>{formData.type} ({formData.type === 'major' ? '大版本更新' : formData.type === 'minor' ? '功能更新' : '修正更新'})</p>
                </div>
              </div>

              {/* 生成按鈕 */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                >
                  取消
                </button>
                <button
                  onClick={generateCode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!formData.title || formData.items.every(item => !item.trim())}
                >
                  生成代碼
                </button>
              </div>
            </div>
          ) : (
            // 代碼顯示模式
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">📋 使用說明</h3>
                <ol className="text-sm text-yellow-700 space-y-1">
                  <li>1. 複製下方生成的代碼</li>
                  <li>2. 打開文件：<code className="bg-yellow-100 px-1 rounded">/frontend/src/data/updateLogData.ts</code></li>
                  <li>3. 在 <code className="bg-yellow-100 px-1 rounded">updateLogs</code> 數組的<strong>最前面</strong>添加這段代碼</li>
                  <li>4. 記得在代碼後面加上逗號 <code className="bg-yellow-100 px-1 rounded">,</code></li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  生成的代碼（複製到 updateLogData.ts）
                </label>
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
{generatedCode}
                  </pre>
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    📋 複製
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setGeneratedCode('')}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                >
                  重新編輯
                </button>
                <button
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                >
                  完成
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateLogManager;