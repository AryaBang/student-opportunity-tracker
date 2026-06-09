'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            ⚙️ Settings
          </h1>

          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Notifications
              </h2>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                  <span className="ml-3 text-gray-700">Deadline reminders</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                  <span className="ml-3 text-gray-700">New opportunities matching my interests</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                  <span className="ml-3 text-gray-700">Friend requests</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                  <span className="ml-3 text-gray-700">Weekly digest</span>
                </label>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Privacy
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Profile Visibility
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option>Public</option>
                    <option>Friends Only</option>
                    <option>Private</option>
                  </select>
                </div>

                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="ml-3 text-gray-700">Allow others to find me by email</span>
                </label>
              </div>
            </div>

            {/* Account */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Account
              </h2>
              <div className="space-y-4">
                <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition">
                  Change Password
                </button>
                <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
