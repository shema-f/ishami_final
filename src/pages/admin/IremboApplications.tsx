import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye } from 'lucide-react';
import iremboLogo from '../../assets/irembo.png';
import { adminAPI } from '../../services/api';

interface IremboApplication {
  id: string;
  userId: string;
  fullName: string;
  nationalId: string;
  phone: string;
  email: string;
  language: string;
  testMode: string;
  licenseType: string;
  district: string;
  testDate: string;
  status: 'PENDING_PAYMENT' | 'PENDING' | 'APPROVED' | 'PROCESSING' | 'SUBMITTED_TO_IREMBO' | 'COMPLETED' | 'BLOCKED';
  adminNotes?: string;
  createdAt?: string;
}

export default function AdminIremboApplications() {
  const [applications, setApplications] = useState<IremboApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<IremboApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getIremboApplications(1, 50);
      const items: IremboApplication[] = (data.applications || []).map((a: any) => ({
        id: a.id,
        userId: a.userId,
        fullName: a.fullName,
        nationalId: a.nationalId,
        phone: a.phone,
        email: a.email,
        language: a.language,
        testMode: a.testMode,
        licenseType: a.licenseType || 'provisional',
        district: a.district,
        testDate: a.testDate,
        status: a.status,
        adminNotes: a.adminNotes,
        createdAt: a.createdAt,
      }));
      setApplications(items);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: string, notes: string) => {
    try {
      await adminAPI.updateIremboApplication(appId, { status: newStatus, adminNotes: notes });
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: newStatus as any, adminNotes: notes } : app
      ));
      setShowDetailModal(false);
      setSelectedApp(null);
    } catch (error) {
      console.error('Failed to update application:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING_PAYMENT: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      PENDING: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      APPROVED: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      PROCESSING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      SUBMITTED_TO_IREMBO: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      COMPLETED: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      BLOCKED: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${styles[status as keyof typeof styles]}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A3AD] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
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
          className="mb-8 flex items-center space-x-4"
        >
          <img src={iremboLogo} alt="Irembo" className="w-12 h-12 rounded-lg" />
          <div>
            <h1 className="text-gray-900 dark:text-white mb-1">Irembo Applications</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage driving test registration requests ({applications.length} total)
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {['PENDING_PAYMENT', 'PENDING', 'APPROVED', 'PROCESSING', 'SUBMITTED_TO_IREMBO', 'COMPLETED', 'BLOCKED'].map((status, index) => {
            const count = applications.filter(app => app.status === status).length;
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {status.replace(/_/g, ' ')}
                </p>
                <p className="text-2xl text-gray-900 dark:text-white">{count}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Applications Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Applicant</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Contact</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Test Details</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Submitted</th>
                  <th className="text-right py-4 px-6 text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900 dark:text-white">{app.fullName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">ID: {app.nationalId.substring(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900 dark:text-white text-sm">{app.phone}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{app.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900 dark:text-white text-sm">{app.district}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(app.testDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{app.licenseType === 'permanent' ? 'Permanent' : 'Provisional'} • {app.testMode}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowDetailModal(true);
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Detail Modal */}
        {showDetailModal && selectedApp && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-gray-900 dark:text-white mb-6">Application Details</h2>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Full Name</label>
                    <p className="text-gray-900 dark:text-white">{selectedApp.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">National ID</label>
                    <p className="text-gray-900 dark:text-white">{selectedApp.nationalId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Phone</label>
                    <p className="text-gray-900 dark:text-white">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                    <p className="text-gray-900 dark:text-white">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Language</label>
                    <p className="text-gray-900 dark:text-white">{selectedApp.language}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Test Mode</label>
                    <p className="text-gray-900 dark:text-white">{selectedApp.testMode}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">License Type</label>
                    <p className="text-gray-900 dark:text-white">{selectedApp.licenseType === 'permanent' ? 'Permanent (10,500 RWF)' : 'Provisional (5,500 RWF)'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">District</label>
                    <p className="text-gray-900 dark:text-white">{selectedApp.district}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Test Date</label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedApp.testDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Created</label>
                    <p className="text-gray-900 dark:text-white text-sm">{selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleString() : '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Current Status</label>
                    <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Update Status</label>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => setSelectedApp({ ...selectedApp, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
                  >
                    <option value="PENDING_PAYMENT">Awaiting Payment</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SUBMITTED_TO_IREMBO">Submitted to Irembo</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Admin Notes</label>
                  <textarea
                    value={selectedApp.adminNotes}
                    onChange={(e) => setSelectedApp({ ...selectedApp, adminNotes: e.target.value })}
                    rows={4}
                    placeholder="Add notes about this application..."
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleUpdateStatus(selectedApp.id, selectedApp.status, selectedApp.adminNotes || '')}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl hover:shadow-xl transition-all duration-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedApp(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
