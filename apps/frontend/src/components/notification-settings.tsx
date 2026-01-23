"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, Mail, Smartphone, Save, Loader2 } from "lucide-react";

export default function NotificationSettings() {
  const { preferences, updatePreferences, loading, error } = useNotifications();

  const [localPreferences, setLocalPreferences] = useState<{
    emailNotifications: boolean;
    pushNotifications: boolean;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize local preferences when preferences are loaded
  useEffect(() => {
    if (!loading && preferences) {
      setLocalPreferences({
        emailNotifications: preferences.emailNotifications,
        pushNotifications: preferences.pushNotifications,
      });
    }
  }, [loading, preferences]);

  const handleToggle = (key: keyof NonNullable<typeof localPreferences>) => {
    setLocalPreferences((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const handleSave = async () => {
    if (!localPreferences) return;

    setSaving(true);
    try {
      const success = await updatePreferences(localPreferences);
      if (success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    localPreferences && preferences
      ? localPreferences.emailNotifications !==
          preferences.emailNotifications ||
        localPreferences.pushNotifications !== preferences.pushNotifications
      : false;

  if (loading || !localPreferences) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-[#037F44]" size={24} />
          <span className="ml-2 text-gray-600">
            Loading notification settings...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500">
          Error loading notification settings: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-[#037F44]" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Notification Settings
        </h2>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Mail className="text-gray-600" size={20} />
            <div>
              <h3 className="font-medium text-gray-800">Email Notifications</h3>
              <p className="text-sm text-gray-600">
                Receive notifications via email for important updates
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={localPreferences.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#037F44]"></div>
          </label>
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Smartphone className="text-gray-600" size={20} />
            <div>
              <h3 className="font-medium text-gray-800">Push Notifications</h3>
              <p className="text-sm text-gray-600">
                Receive real-time notifications on your device
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={localPreferences.pushNotifications}
              onChange={() => handleToggle("pushNotifications")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#037F44]"></div>
          </label>
        </div>

        {/* Notification Types */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3">
            You&apos;ll receive notifications for:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Order updates (created, accepted, shipped, completed)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Product approval status
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Wallet transactions (deposits, withdrawals, transfers)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Swap offers and bid updates
            </div>
          </div>
        </div>

        {/* Save Button */}
        {
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="flex items-center gap-2 bg-[#037F44] text-white px-6 py-2 rounded-md hover:bg-[#025c32] transition disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : saved ? (
                <span className="text-green-200">✓ Saved</span>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        }
      </div>
    </div>
  );
}
