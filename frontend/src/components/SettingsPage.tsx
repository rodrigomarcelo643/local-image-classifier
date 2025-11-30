import { useState } from "react";
import { authToasts } from "../utils/toast";
import SkeletonLoader from "./SkeletonLoader";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    theme: "light",
    language: "en"
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSelect = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      authToasts.success("Settings saved successfully!");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Application Settings</h2>
          <p className="opacity-90">Customize your experience</p>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications for training updates</p>
            </div>
            <button
              onClick={() => handleToggle('notifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Auto Save</h3>
              <p className="text-sm text-gray-500">Automatically save your work</p>
            </div>
            <button
              onClick={() => handleToggle('autoSave')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSave ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Theme */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Theme</h3>
            <div className="space-y-2">
              {['light', 'dark', 'auto'].map((theme) => (
                <label key={theme} className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={settings.theme === theme}
                    onChange={(e) => handleSelect('theme', e.target.value)}
                    className="mr-3 text-green-600 focus:ring-green-500"
                  />
                  <span className="capitalize text-gray-700">{theme}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Language</h3>
            <select
              value={settings.language}
              onChange={(e) => handleSelect('language', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          {/* Data Management */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Data Management</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Export Training Data
              </button>
              <button className="w-full text-left px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                Clear Cache
              </button>
              <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Delete All Data
              </button>
            </div>
          </div>

          {/* Save Button */}
          {loading ? (
            <SkeletonLoader variant="button" className="w-full" />
          ) : (
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
            >
              Save Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
}