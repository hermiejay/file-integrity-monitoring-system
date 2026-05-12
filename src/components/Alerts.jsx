import React, { useState, useEffect } from 'react';

const Alerts = ({ user }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  const fetchAlerts = () => {
    setLoading(true);

    // Get alerts from localStorage
    const allAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');

    // Filter alerts based on user role
    let userAlerts;
    if (user.role === 'admin') {
      // Admin sees all alerts
      userAlerts = allAlerts;
    } else {
      // Regular users see only their alerts
      userAlerts = allAlerts.filter(alert => alert.username === user.username);
    }

    // Sort by date (newest first)
    userAlerts.sort((a, b) => new Date(b.date) - new Date(a.date));

    setAlerts(userAlerts);
    setLoading(false);
  };

  const getAlertIcon = (action) => {
    switch (action) {
      case 'uploaded': return '📤';
      case 'modified': return '⚠️';
      case 'edited': return '✏️';
      case 'deleted': return '🗑️';
      case 'moved': return '📁';
      case 'renamed': return '🏷️';
      default: return '🔔';
    }
  };

  const getAlertColor = (action) => {
    const highRiskActions = ['modified', 'deleted', 'edited', 'unauthorized_download_attempt', 'unauthorized_edit_attempt', 'unauthorized_delete_attempt', 'unauthorized_move_attempt', 'integrity_violation'];
    if (highRiskActions.includes(action)) {
      return 'bg-red-100 text-red-800';
    }

    switch (action) {
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'moved': return 'bg-purple-100 text-purple-800';
      case 'renamed': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStats = () => {
    const total = alerts.length;
    const highRisk = alerts.filter(a => ['modified', 'deleted', 'edited', 'unauthorized_download_attempt', 'unauthorized_edit_attempt', 'unauthorized_delete_attempt', 'unauthorized_move_attempt', 'integrity_violation'].includes(a.action)).length;
    return { total, highRisk };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.role === 'admin' ? '🚨 All System Alerts' : '🔔 My Alerts'}
          </h1>
          <button
            onClick={fetchAlerts}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats */}
        {stats.total > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 font-semibold mb-1">Total Alerts</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="text-4xl text-blue-500">🔔</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 font-semibold mb-1">High Risk</h3>
                  <p className="text-3xl font-bold text-red-600">{stats.highRisk}</p>
                </div>
                <div className="text-4xl text-red-500">⚠️</div>
              </div>
            </div>

            {user.role === 'admin' && (
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-600 font-semibold mb-1">Users</h3>
                    <p className="text-3xl font-bold text-green-600">
                      {JSON.parse(localStorage.getItem('users') || '[]').length}
                    </p>
                  </div>
                  <div className="text-4xl text-green-500">👥</div>
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <span className="text-4xl">⏳</span>
            </div>
            <p className="text-gray-600 text-lg mt-4">Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-green-600 mb-2">No Alerts</h2>
            <p className="text-gray-600">
              {user.role === 'admin'
                ? 'No user activity detected yet.'
                : 'All your files are secure. No alerts to show.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Action</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">File</th>
                    {user.role === 'admin' && (
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">User</th>
                    )}
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Date/Time</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {alerts.map((alert, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAlertColor(alert.action)}`}>
                          {getAlertIcon(alert.action)} {alert.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        📄 {alert.file}
                      </td>
                      {user.role === 'admin' && (
                        <td className="px-6 py-4 text-gray-600">
                          👤 {alert.username}
                        </td>
                      )}
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(alert.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          ['modified', 'deleted', 'edited', 'unauthorized_download_attempt', 'unauthorized_edit_attempt', 'unauthorized_delete_attempt', 'unauthorized_move_attempt', 'integrity_violation'].includes(alert.action)
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {['modified', 'deleted', 'edited', 'unauthorized_download_attempt', 'unauthorized_edit_attempt', 'unauthorized_delete_attempt', 'unauthorized_move_attempt', 'integrity_violation'].includes(alert.action) ? 'High Risk' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
