import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-3">🔒 FIMS</h3>
            <p className="text-blue-100">
              File Integrity Monitoring System - Protect your data from unauthorized modifications.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Features</h3>
            <ul className="text-blue-100 space-y-2">
              <li>• SHA-256 Hash Generation</li>
              <li>• Real-time Modification Detection</li>
              <li>• Alert Notifications</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Technology</h3>
            <ul className="text-blue-100 space-y-2">
              <li>• React + Vite</li>
              <li>• Tailwind CSS</li>
              <li>• Flask Backend</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-700 pt-6 text-center text-blue-100">
          <p>&copy; 2026 File Integrity Monitoring System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
