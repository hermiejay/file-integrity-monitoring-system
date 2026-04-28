import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ setCurrentPage }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFiles: 0,
    totalAlerts: 0,
    unauthorizedModifications: 0
  });
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showHashes, setShowHashes] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showSystemReports, setShowSystemReports] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const alertsData = JSON.parse(localStorage.getItem('alerts') || '[]');
    const filesData = JSON.parse(localStorage.getItem('sharedFiles') || '[]');

    const unauthorizedAlerts = alertsData.filter(a =>
      a.action === 'modified' || a.action === 'deleted' ||
      a.action === 'unauthorized_download_attempt' ||
      a.action === 'unauthorized_edit_attempt' ||
      a.action === 'unauthorized_delete_attempt'
    );

    setStats({
      totalUsers: usersData.length,
      totalFiles: filesData.length,
      totalAlerts: alertsData.length,
      unauthorizedModifications: unauthorizedAlerts.length
    });

    setUsers(usersData);
    setAlerts(alertsData);
    setSharedFiles(filesData);
  };

  const getUserFiles = (username) => {
    return sharedFiles.filter(file => file.uploadedBy === username);
  };

  const getUserAlerts = (username) => {
    return alerts.filter(alert => alert.username === username);
  };

  const getAlertIcon = (action) => {
    switch (action) {
      case 'uploaded': return '📤';
      case 'downloaded': return '📥';
      case 'edited': return '✏️';
      case 'deleted': return '🗑️';
      case 'modified': return '⚠️';
      case 'unauthorized_download_attempt': return '🚫📥';
      case 'unauthorized_edit_attempt': return '🚫✏️';
      case 'unauthorized_delete_attempt': return '🚫🗑️';
      case 'integrity_violation': return '🔒❌';
      default: return '🔔';
    }
  };

  const getAlertColor = (action) => {
    if (action.includes('unauthorized') || action === 'integrity_violation') {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard 👑
          </h1>
          <p className="text-gray-600">
            System-wide monitoring and user activity overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <div className="text-4xl text-blue-500">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Total Files</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalFiles}</p>
              </div>
              <div className="text-4xl text-green-500">📁</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">All Alerts</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.totalAlerts}</p>
              </div>
              <div className="text-4xl text-yellow-500">🔔</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Unauthorized</h3>
                <p className="text-3xl font-bold text-red-600">{stats.unauthorizedModifications}</p>
              </div>
              <div className="text-4xl text-red-500">⚠️</div>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Frontend Status</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Backend Status</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">localStorage</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {stats.totalAlerts > 0 ? (
                <div className="text-sm text-gray-600">
                  <p>• {stats.totalAlerts} total alerts generated</p>
                  <p>• {stats.unauthorizedModifications} unauthorized access attempts</p>
                  <p>• {stats.totalFiles} files uploaded by users</p>
                  <p>• {stats.totalUsers} registered users</p>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No activity yet. Waiting for user actions... ⏳
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setCurrentPage('scanner')}>
              <div className="text-3xl mb-2">📤</div>
              <h3 className="font-semibold text-gray-900">Upload File</h3>
              <p className="text-sm text-gray-600">Generate hash for new file</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setCurrentPage('scanner')}>
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold text-gray-900">Scan File</h3>
              <p className="text-sm text-gray-600">Check file integrity</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setCurrentPage('alerts')}>
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900">View Alerts</h3>
              <p className="text-sm text-gray-600">Check security alerts</p>
            </div>
          </div>
        </div>

        {/* All Uploaded Files */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📁 All Uploaded Files ({sharedFiles.length} total)</h2>
          
          <div className="mb-4">
            <button
              onClick={() => setShowHashes(!showHashes)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {showHashes ? 'Hide Hashes' : 'Show Full Hashes'}
            </button>
          </div>

          {sharedFiles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No files have been uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded By
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Algorithm
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    {showHashes && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Hash
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sharedFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {file.filename.split('.').pop().toUpperCase().substring(0, 3)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {file.filename}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{file.uploadedBy}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {file.algorithm.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {file.size} bytes
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(file.date).toLocaleDateString()} {new Date(file.date).toLocaleTimeString()}
                      </td>
                      {showHashes && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded break-all">
                            {file.hash}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Per-User Activity */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Per-User Activity Monitor</h2>

          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users registered yet.</p>
          ) : (
            <div className="space-y-6">
              {users.map((user) => {
                const userFiles = getUserFiles(user.username);
                const userAlerts = getUserAlerts(user.username);

                return (
                  <div key={user.username} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                      <div className="flex gap-4 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {userFiles.length} files uploaded
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {userAlerts.length} alerts
                        </span>
                      </div>
                    </div>

                    {/* User's Files */}
                    {userFiles.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Uploaded Files:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {userFiles.map((file) => (
                            <div key={file.id} className="bg-gray-50 p-3 rounded text-sm">
                              <p className="font-medium">{file.filename}</p>
                              <p className="text-gray-600">{file.algorithm.toUpperCase()} • {file.size} bytes</p>
                              <p className="text-xs text-gray-500">{new Date(file.date).toLocaleDateString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* User's Alerts */}
                    {userAlerts.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Activity Alerts:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {userAlerts.slice(-5).reverse().map((alert, index) => (
                            <div key={index} className={`flex items-center gap-3 p-2 rounded border ${getAlertColor(alert.action)}`}>
                              <span className="text-lg">{getAlertIcon(alert.action)}</span>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {alert.action.replace(/_/g, ' ').toUpperCase()}
                                  {alert.targetUser && ` (targeted ${alert.targetUser}'s file)`}
                                </p>
                                <p className="text-xs text-gray-600">
                                  File: {alert.file} • {new Date(alert.date).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {userFiles.length === 0 && userAlerts.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No activity yet for this user.</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setShowAllAlerts(!showAllAlerts)}>
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900">View All Alerts</h3>
              <p className="text-sm text-gray-600">Monitor system-wide alerts</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setShowUserManagement(!showUserManagement)}>
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-semibold text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">View registered users</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setShowSystemReports(!showSystemReports)}>
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-semibold text-gray-900">System Reports</h3>
              <p className="text-sm text-gray-600">Generate activity reports</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => {
              if (window.confirm('Are you sure you want to reset all data? This will delete all users, files, and alerts.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}>
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-semibold text-gray-900">Reset All Data</h3>
              <p className="text-sm text-gray-600">Clear all localStorage data</p>
            </div>
          </div>
        </div>

        {showAllAlerts && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 All System Alerts</h2>
            {alerts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No alerts generated yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.map((alert, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded border ${getAlertColor(alert.action)}`}>
                    <span className="text-lg">{getAlertIcon(alert.action)}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {alert.action.replace(/_/g, ' ').toUpperCase()}
                        {alert.targetUser && ` (targeted ${alert.targetUser}'s file)`}
                      </p>
                      <p className="text-xs text-gray-600">
                        User: {alert.username} • File: {alert.file} • {new Date(alert.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showUserManagement && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">👥 User Management</h2>
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users registered yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => {
                  const userFiles = getUserFiles(user.username);
                  const userAlerts = getUserAlerts(user.username);
                  return (
                    <div key={user.username} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                      <p className="text-sm text-gray-600">Role: {user.role}</p>
                      <div className="mt-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {userFiles.length} files
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs ml-2">
                          {userAlerts.length} alerts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {showSystemReports && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 System Activity Report</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{stats.totalFiles}</p>
                    <p className="text-sm text-gray-600">Total Files</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{stats.totalAlerts}</p>
                    <p className="text-sm text-gray-600">Total Alerts</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{stats.unauthorizedModifications}</p>
                    <p className="text-sm text-gray-600">Security Incidents</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">File Distribution by Algorithm</h3>
                <div className="space-y-2">
                  {['SHA-256', 'MD5'].map(algo => {
                    const count = sharedFiles.filter(f => f.algorithm === algo.toLowerCase()).length;
                    return (
                      <div key={algo} className="flex justify-between items-center">
                        <span className="text-gray-700">{algo}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm">{count} files</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity (Last 10)</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {alerts.slice(-10).reverse().map((alert, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <span className="text-lg">{getAlertIcon(alert.action)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.action.replace(/_/g, ' ').toUpperCase()}</p>
                        <p className="text-xs text-gray-600">User: {alert.username} • {new Date(alert.date).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;