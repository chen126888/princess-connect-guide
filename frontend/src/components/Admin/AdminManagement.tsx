import React, { useState, useEffect } from 'react';
import { getCurrentAdmin } from '../../utils/auth';
import { adminApi } from '../../services/api';

interface Admin {
  id: string;
  username: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface AdminManagementProps {
  onClose: () => void;
}

const AdminManagement: React.FC<AdminManagementProps> = ({ onClose }) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [resetForm, setResetForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // 載入管理員列表
  const loadAdmins = async () => {
    try {
      const data = await adminApi.getAdmins();
      // 後端直接返回管理員陣列，而非 { admins: [...] } 格式
      setAdmins(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Load admins error:', error);
      const errorMsg = error.response?.data?.error || '載入管理員列表失敗';
      alert(errorMsg);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  // 創建管理員
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createForm.username || !createForm.password) {
      alert('帳號和密碼為必填項目');
      return;
    }

    if (createForm.password !== createForm.confirmPassword) {
      alert('密碼確認不一致');
      return;
    }

    if (createForm.password.length < 6) {
      alert('密碼長度至少需要 6 個字元');
      return;
    }

    try {
      const data = await adminApi.createAdmin({
        username: createForm.username,
        password: createForm.password,
        name: createForm.name || createForm.username
      });

      if (data.success) {
        alert('管理員創建成功！');
        setShowCreateModal(false);
        setCreateForm({ username: '', password: '', confirmPassword: '', name: '' });
        loadAdmins();
      } else {
        alert(data.error || '創建失敗');
      }
    } catch (error: any) {
      console.error('Create admin error:', error);
      const errorMsg = error.response?.data?.error || '創建管理員失敗';
      alert(errorMsg);
    }
  };

  // 重置密碼
  const handleResetPassword = async (adminId: string) => {
    if (!resetForm.newPassword) {
      alert('請輸入新密碼');
      return;
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      alert('密碼確認不一致');
      return;
    }

    if (resetForm.newPassword.length < 6) {
      alert('密碼長度至少需要 6 個字元');
      return;
    }

    try {
      const data = await adminApi.resetPassword(adminId, resetForm.newPassword);

      if (data.success) {
        alert('密碼重置成功！');
        setShowResetModal(null);
        setResetForm({ newPassword: '', confirmPassword: '' });
      } else {
        alert(data.error || '重置失敗');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      const errorMsg = error.response?.data?.error || '重置密碼失敗';
      alert(errorMsg);
    }
  };

  // 切換管理員狀態
  const toggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    const currentAdmin = getCurrentAdmin();
    if (adminId === currentAdmin?.id && currentStatus) {
      alert('不能停用自己的帳號');
      return;
    }

    const action = currentStatus ? '停用' : '啟用';
    if (!confirm(`確定要${action}這個管理員嗎？`)) return;

    try {
      const data = await adminApi.toggleAdmin(adminId, !currentStatus);

      if (data.success) {
        alert(`${action}成功！`);
        loadAdmins();
      } else {
        alert(data.error || `${action}失敗`);
      }
    } catch (error: any) {
      console.error('Toggle admin error:', error);
      const errorMsg = error.response?.data?.error || `${action}管理員失敗`;
      alert(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">👥 管理員管理</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
              >
                ➕ 新增管理員
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          {/* 管理員列表 */}
          <div className="space-y-4">
            {admins.length === 0 ? (
              <div className="text-center text-gray-500 py-8">暫無管理員資料</div>
            ) : (
              admins.map((admin) => (
                <div key={admin.id} className={`bg-gray-50 rounded-lg p-4 flex items-center justify-between ${!admin.isActive ? 'opacity-60' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-800">{admin.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        admin.role === 'superadmin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {admin.role === 'superadmin' ? '超級管理員' : '一般管理員'}
                      </span>
                      {admin.id === getCurrentAdmin()?.id && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          (目前登入)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      帳號：{admin.username} • 
                      狀態：{admin.isActive ? '啟用' : '停用'} • 
                      創建：{new Date(admin.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {admin.id !== getCurrentAdmin()?.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowResetModal(admin.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        重置密碼
                      </button>
                      <button
                        onClick={() => toggleAdminStatus(admin.id, admin.isActive)}
                        className={`px-3 py-1 rounded text-sm ${
                          admin.isActive
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {admin.isActive ? '停用' : '啟用'}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 創建管理員彈窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">➕ 新增管理員</h3>
              
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    帳號 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createForm.username}
                    onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="請輸入管理員帳號"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    顯示名稱
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="選填，預設使用帳號"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    密碼 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="至少 6 個字元"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    確認密碼 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={createForm.confirmPassword}
                    onChange={(e) => setCreateForm({...createForm, confirmPassword: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="請再次輸入密碼"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    創建
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 重置密碼彈窗 */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔑 重置密碼</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    新密碼 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={resetForm.newPassword}
                    onChange={(e) => setResetForm({...resetForm, newPassword: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="至少 6 個字元"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    確認密碼 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={resetForm.confirmPassword}
                    onChange={(e) => setResetForm({...resetForm, confirmPassword: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="請再次輸入密碼"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowResetModal(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => handleResetPassword(showResetModal)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;