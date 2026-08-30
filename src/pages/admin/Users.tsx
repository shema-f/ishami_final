import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Edit, Trash2, Crown, Ban, CheckCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  isPro: boolean;
  accessTier: 'free' | 'quiz' | 'full';
  role: string;
  loginStreak: number;
  badges: string[];
  createdAt?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'newsletter'>('users');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, subscribersData] = await Promise.all([
        adminAPI.getUsers(1, 50),
        adminAPI.getNewsletterSubscribers(1, 50)
      ]);

      const items: User[] = (usersData.users || []).map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        isPro: !!u.isPro,
        accessTier: u.accessTier || 'free',
        role: u.role || 'user',
        loginStreak: Number(u.loginStreak || 0),
        badges: Array.isArray(u.badges) ? u.badges : [],
        createdAt: u.createdAt,
      }));
      setUsers(items);

      if (subscribersData && subscribersData.subscribers) {
        setSubscribers(subscribersData.subscribers);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      await adminAPI.updateUser(selectedUser.id, selectedUser);
      
      console.log('Updating user:', selectedUser);
      
      // Update local state
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      
      console.log('Deleting user:', userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A3AD] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-gray-900 dark:text-white mb-2">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all platform users
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-[#00A3AD] text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'newsletter'
                ? 'bg-[#00A3AD] text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Newsletter Subscribers
          </button>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
            />
          </div>
        </motion.div>

        {/* Users Table */}
        {activeTab === 'users' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">User</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Streak</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Joined</th>
                  <th className="text-right py-4 px-6 text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900 dark:text-white flex items-center space-x-2">
                          <span>{user.username}</span>
                          {user.role === 'admin' && (
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded">
                              Admin
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {user.accessTier === 'full' ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm">
                          <Crown className="w-4 h-4" />
                          <span>Full</span>
                        </span>
                      ) : user.accessTier === 'quiz' ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Quiz</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900 dark:text-white">{user.loginStreak} days</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Email</th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-6">
                        <span className="text-gray-900 dark:text-white">{sub.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No newsletter subscribers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-gray-900 dark:text-white mb-6">Edit User</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={selectedUser.username}
                    onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedUser.isPro}
                      onChange={(e) => setSelectedUser({ ...selectedUser, isPro: e.target.checked })}
                      className="w-5 h-5 text-[#00A3AD] border-gray-300 rounded focus:ring-[#00A3AD]"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Pro User</span>
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl hover:shadow-xl transition-all duration-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
