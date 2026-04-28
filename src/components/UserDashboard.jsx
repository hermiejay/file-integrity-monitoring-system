import React, { useState, useEffect } from 'react';

const UserDashboard = ({ user, setCurrentPage }) => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalAlerts: 0,
    highSeverityAlerts: 0
  });

  useEffect(() => {
    // Load user stats from localStorage
    const files = JSON.parse(localStorage.getItem('files') || '[]');
    const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');

    const userFiles = files.filter(f => f.username === user.username);
    const userAlerts = alerts.filter(a => a.username === user.username);
    const highSeverity = userAlerts.filter(a => a.action === 'modified' || a.action === 'deleted');

    setStats({
      totalFiles: userFiles.length,
      totalAlerts: userAlerts.length,
      highSeverityAlerts: highSeverity.length
    });
  }, [user.username]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.username}! 👋
          </h1>
          <p className="text-gray-600">
            Monitor your file integrity and security alerts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">My Files</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalFiles}</p>
              </div>
              <div className="text-4xl text-blue-500">📁</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">My Alerts</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.totalAlerts}</p>
              </div>
              <div className="text-4xl text-yellow-500">🔔</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">High Risk</h3>
                <p className="text-3xl font-bold text-red-600">{stats.highSeverityAlerts}</p>
              </div>
              <div className="text-4xl text-red-500">⚠️</div>
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

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {stats.totalFiles === 0 && stats.totalAlerts === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No activity yet. Start by uploading a file! 📁
              </p>
            ) : (
              <div className="text-sm text-gray-600">
                <p>• {stats.totalFiles} files uploaded</p>
                <p>• {stats.totalAlerts} alerts generated</p>
                <p>• {stats.highSeverityAlerts} high-risk detections</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;