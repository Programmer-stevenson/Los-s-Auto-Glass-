'use client';

// ============================================
// ADMIN SETTINGS PAGE - /admin/settings
// ============================================

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiChevronLeft, FiSave, FiClock, FiDollarSign,
  FiPhone, FiMail, FiMapPin, FiBell, FiLock
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('business');
  
  // Business Info
  const [businessInfo, setBusinessInfo] = useState({
    name: "Los's Auto Glass",
    phone: '(385) 424-6781',
    email: 'info@lossautoglass.com',
    address: 'Utah, USA',
    website: 'lossautoglass.com'
  });

  // Business Hours
  const [businessHours, setBusinessHours] = useState({
    monday: { open: '08:00', close: '18:00', isOpen: true },
    tuesday: { open: '08:00', close: '18:00', isOpen: true },
    wednesday: { open: '08:00', close: '18:00', isOpen: true },
    thursday: { open: '08:00', close: '18:00', isOpen: true },
    friday: { open: '08:00', close: '18:00', isOpen: true },
    saturday: { open: '09:00', close: '16:00', isOpen: true },
    sunday: { open: '00:00', close: '00:00', isOpen: false }
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNewBooking: true,
    emailCancellation: true,
    smsNewBooking: true,
    smsReminders: true,
    smsContactForm: true
  });

  const handleSave = () => {
    toast.success('Settings saved');
  };

  const tabs = [
    { id: 'business', name: 'Business Info', icon: FiMapPin },
    { id: 'hours', name: 'Business Hours', icon: FiClock },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'security', name: 'Security', icon: FiLock }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600 mr-4">
              <FiChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-brand-black">Settings</h1>
              <p className="text-gray-500 text-sm">Manage your business settings</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              {/* Business Info Tab */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-brand-black">Business Information</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        value={businessInfo.name}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={businessInfo.email}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={businessInfo.address}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="text"
                        value={businessInfo.website}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Business Hours Tab */}
              {activeTab === 'hours' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-brand-black">Business Hours</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(businessHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                        <div className="w-28">
                          <span className="font-medium text-brand-black capitalize">{day}</span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={hours.isOpen}
                            onChange={(e) => setBusinessHours({
                              ...businessHours,
                              [day]: { ...hours, isOpen: e.target.checked }
                            })}
                            className="rounded text-brand-blue mr-3"
                          />
                          <span className="text-sm text-gray-500">Open</span>
                        </div>
                        {hours.isOpen && (
                          <>
                            <input
                              type="time"
                              value={hours.open}
                              onChange={(e) => setBusinessHours({
                                ...businessHours,
                                [day]: { ...hours, open: e.target.value }
                              })}
                              className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                            />
                            <span className="text-gray-400">to</span>
                            <input
                              type="time"
                              value={hours.close}
                              onChange={(e) => setBusinessHours({
                                ...businessHours,
                                [day]: { ...hours, close: e.target.value }
                              })}
                              className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                            />
                          </>
                        )}
                        {!hours.isOpen && (
                          <span className="text-gray-400 text-sm">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-brand-black">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Email Notifications</h3>
                    <div className="space-y-3 pl-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notifications.emailNewBooking}
                          onChange={(e) => setNotifications({ ...notifications, emailNewBooking: e.target.checked })}
                          className="rounded text-brand-blue mr-3"
                        />
                        <span className="text-gray-600">New booking notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notifications.emailCancellation}
                          onChange={(e) => setNotifications({ ...notifications, emailCancellation: e.target.checked })}
                          className="rounded text-brand-blue mr-3"
                        />
                        <span className="text-gray-600">Cancellation notifications</span>
                      </label>
                    </div>

                    <h3 className="font-medium text-gray-700 pt-4">SMS Notifications</h3>
                    <div className="space-y-3 pl-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notifications.smsNewBooking}
                          onChange={(e) => setNotifications({ ...notifications, smsNewBooking: e.target.checked })}
                          className="rounded text-brand-blue mr-3"
                        />
                        <span className="text-gray-600">New booking SMS alerts</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notifications.smsReminders}
                          onChange={(e) => setNotifications({ ...notifications, smsReminders: e.target.checked })}
                          className="rounded text-brand-blue mr-3"
                        />
                        <span className="text-gray-600">Send customer reminders (24hr before)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notifications.smsContactForm}
                          onChange={(e) => setNotifications({ ...notifications, smsContactForm: e.target.checked })}
                          className="rounded text-brand-blue mr-3"
                        />
                        <span className="text-gray-600">Contact form SMS alerts</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-brand-black">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Change Password
                    </button>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-4">Admin Users</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Manage who has access to the admin dashboard.
                    </p>
                    <button className="px-4 py-2 border border-brand-blue text-brand-blue rounded-lg hover:bg-blue-50 transition-colors">
                      Manage Users
                    </button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FiSave className="mr-2" /> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
