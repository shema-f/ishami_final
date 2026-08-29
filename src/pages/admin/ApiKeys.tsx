import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Key, Plus, Trash2, Eye, EyeOff, Copy, Check, BarChart3,
  Globe, Clock, Shield, AlertTriangle, RefreshCw, ExternalLink,
  Activity, TrendingUp, Zap, Search, X, ToggleLeft, ToggleRight
} from 'lucide-react';
import {
  getAllKeys, createApiKey, revokeApiKey, reactivateApiKey, deleteApiKey,
  getUsageSummary, getUsageForKey, seedDemoApiData,
  type ApiKey, type ApiUsageSummary, type ApiUsageRecord
} from '../../lib/apiKeyStore';

export default function AdminApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [summary, setSummary] = useState<ApiUsageSummary | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyWebsite, setNewKeyWebsite] = useState('');
  const [newKeyRateLimit, setNewKeyRateLimit] = useState(60);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [keyUsage, setKeyUsage] = useState<ApiUsageRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'usage'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    seedDemoApiData();
    loadData();
  }, []);

  const loadData = () => {
    setKeys(getAllKeys());
    setSummary(getUsageSummary());
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    await createApiKey(newKeyName.trim(), newKeyWebsite.trim() || undefined, newKeyRateLimit);
    setNewKeyName('');
    setNewKeyWebsite('');
    setNewKeyRateLimit(60);
    setShowCreateModal(false);
    loadData();
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleViewKeyUsage = (keyId: string) => {
    setSelectedKey(keyId);
    setKeyUsage(getUsageForKey(keyId));
    setActiveTab('usage');
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev);
      if (next.has(keyId)) next.delete(keyId);
      else next.add(keyId);
      return next;
    });
  };

  const maskKey = (key: string) => {
    return key.slice(0, 14) + '••••••••••••' + key.slice(-4);
  };

  const filteredKeys = keys.filter(k =>
    k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (k.website || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F7F9] dark:bg-[#1A1A2E] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Public API Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage API keys, monitor usage, and track analytics</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Requests</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.totalRequests || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.todayRequests || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Key className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Active Keys</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{keys.filter(k => k.isActive).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Error Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.errorRate || 0}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 w-fit">
        {(['overview', 'keys', 'usage'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'keys' ? 'API Keys' : 'Usage Logs'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requests Over Time */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Requests (Last 7 Days)</h3>
            <div className="flex items-end gap-2 h-40">
              {summary?.requestsOverTime.map((day, i) => {
                const maxCount = Math.max(...(summary?.requestsOverTime.map(d => d.count) || [1]));
                const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-400">{day.count}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="w-full bg-gradient-to-t from-violet-500 to-purple-400 rounded-t-lg min-h-[4px]"
                    />
                    <span className="text-[10px] text-gray-400">
                      {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Endpoints */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Top Endpoints</h3>
            <div className="space-y-3">
              {summary?.topEndpoints.slice(0, 6).map((ep, i) => {
                const maxCount = Math.max(...(summary?.topEndpoints.map(e => e.count) || [1]));
                const width = maxCount > 0 ? (ep.count / maxCount) * 100 : 0;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-gray-600 dark:text-gray-300 truncate max-w-[200px]">{ep.endpoint}</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{ep.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top API Keys */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Top API Keys by Usage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {summary?.topKeys.slice(0, 6).map((tk, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : i === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-600/30 dark:text-gray-300'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{tk.keyName}</p>
                      <p className="text-[10px] text-gray-400">{tk.count} requests</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'keys' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keys..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create API Key</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredKeys.map(key => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{key.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        key.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {key.isActive ? 'Active' : 'Revoked'}
                      </span>
                    </div>

                    {key.website && (
                      <div className="flex items-center gap-1 mb-2">
                        <Globe className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{key.website}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                      <code className="text-xs font-mono text-gray-600 dark:text-gray-300 flex-1 truncate">
                        {visibleKeys.has(key.id) ? key.key : maskKey(key.key)}
                      </code>
                      <button onClick={() => toggleKeyVisibility(key.id)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                        {visibleKeys.has(key.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => handleCopyKey(key.key)} className="p-1 text-gray-400 hover:text-violet-500">
                        {copiedKey === key.key ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Created {new Date(key.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{key.rateLimit} req/min</span>
                      <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{key.totalRequests} total</span>
                      {key.lastUsedAt && (
                        <span className="flex items-center gap-1"><Activity className="w-3 h-3" />Last used {new Date(key.lastUsedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleViewKeyUsage(key.id)}
                      className="p-2 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-all"
                      title="View usage"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { key.isActive ? revokeApiKey(key.id) : reactivateApiKey(key.id); loadData(); }}
                      className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                      title={key.isActive ? 'Revoke' : 'Reactivate'}
                    >
                      {key.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this API key? This cannot be undone.')) { deleteApiKey(key.id); loadData(); } }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Logs Tab */}
      {activeTab === 'usage' && (
        <div>
          {selectedKey && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Showing usage for:</span>
              <span className="text-sm font-medium text-violet-500">
                {keys.find(k => k.id === selectedKey)?.name || 'Unknown'}
              </span>
              <button onClick={() => setSelectedKey(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Endpoint</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Origin</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Response</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Time</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedKey ? keyUsage : getAllUsage()).slice(0, 50).map(record => (
                    <tr key={record.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">{record.endpoint}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 max-w-[150px] truncate">{record.origin || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          record.httpStatus === 200
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : record.httpStatus === 429
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {record.httpStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{record.responseTime}ms</td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{record.responseTime}ms</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(record.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Key Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create New API Key</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., My Website, Mobile App"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website Origin (optional)</label>
                  <input
                    type="text"
                    value={newKeyWebsite}
                    onChange={(e) => setNewKeyWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate Limit (requests/minute)</label>
                  <input
                    type="number"
                    value={newKeyRateLimit}
                    onChange={(e) => setNewKeyRateLimit(parseInt(e.target.value) || 60)}
                    min={1}
                    max={1000}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={!newKeyName.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-40"
                >
                  Create Key
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
