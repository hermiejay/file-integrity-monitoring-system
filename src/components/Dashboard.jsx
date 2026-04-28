import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            File Integrity Monitoring System
          </h1>
          <p className="text-xl text-gray-700">
            Monitor and detect unauthorized file modifications in real-time
          </p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-l-4 border-blue-900">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">What is FIMS?</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            The File Integrity Monitoring System (FIMS) is a security tool designed to detect and alert
            you about unauthorized changes to your files. By comparing file hashes before and after,
            FIMS ensures the integrity and authenticity of your critical data. This system helps protect
            against malware, unauthorized access, and data tampering.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Total Files Scanned */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-900 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-semibold mb-2">Total Files Scanned</h3>
                <p className="text-4xl font-bold text-blue-900">1,240</p>
              </div>
              <div className="text-5xl text-blue-900 opacity-20">📁</div>
            </div>
          </div>

          {/* Modified Files Detected */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-semibold mb-2">Modified Files Detected</h3>
                <p className="text-4xl font-bold text-orange-500">12</p>
              </div>
              <div className="text-5xl text-orange-500 opacity-20">⚠️</div>
            </div>
          </div>

          {/* Alerts Generated */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-red-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 font-semibold mb-2">Alerts Generated</h3>
                <p className="text-4xl font-bold text-red-500">18</p>
              </div>
              <div className="text-5xl text-red-500 opacity-20">🔔</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-900 text-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">🔍 File Scanner</h3>
            <p className="text-blue-100">
              Upload files and generate SHA-256 hashes to verify file integrity. Compare hashes
              to detect any unauthorized modifications instantly.
            </p>
          </div>
          <div className="bg-blue-900 text-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">🚨 Alert System</h3>
            <p className="text-blue-100">
              Receive instant notifications when suspicious file changes are detected. Review
              detailed alert logs with timestamps and file information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
