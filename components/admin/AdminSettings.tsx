'use client'

import { useState } from 'react'
import type { User } from '@/types/api'
import { Settings, Shield, Bell } from 'lucide-react'

interface AdminSettingsProps {
  user: User
}

export function AdminSettings({ user }: AdminSettingsProps) {
  const [siteName, setSiteName] = useState('VIA Studio')
  const [siteDescription, setSiteDescription] = useState('Web development & digital solutions')
  const [adminEmail, setAdminEmail] = useState(user.email)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <div className="dash-welcome">
        <div>
          <h2>Settings</h2>
          <p>Manage your application preferences and configuration.</p>
        </div>
      </div>

      <div className="dash-section-header">
        <h3><Settings size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />General Settings</h3>
      </div>
      <div className="dash-card" style={{ marginBottom: 24, padding: 20 }}>
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Site Name</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Enter site name"
          />
        </div>
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Site Description</label>
          <textarea
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            placeholder="Enter site description"
            rows={3}
          />
        </div>
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Admin Contact Email</label>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </div>
      </div>

      <div className="dash-section-header">
        <h3><Shield size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />Security Settings</h3>
      </div>
      <div className="dash-card" style={{ marginBottom: 24, padding: 20 }}>
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Current Password</label>
          <input type="password" placeholder="Leave blank to keep current" />
        </div>
        <div className="field" style={{ marginBottom: 16 }}>
          <label>New Password</label>
          <input type="password" placeholder="Enter new password" />
        </div>
        <div className="field" style={{ marginBottom: 8 }}>
          <label>Confirm New Password</label>
          <input type="password" placeholder="Confirm new password" />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
          Password must be at least 8 characters long.
        </p>
      </div>

      <div className="dash-section-header">
        <h3><Bell size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />Notification Preferences</h3>
      </div>
      <div className="dash-card" style={{ marginBottom: 24, padding: 20 }}>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="checkbox"
            id="push-notif"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          <label htmlFor="push-notif" style={{ cursor: 'pointer', fontSize: 14 }}>
            Enable Push Notifications
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="checkbox"
            id="email-notif"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          <label htmlFor="email-notif" style={{ cursor: 'pointer', fontSize: 14 }}>
            Enable Email Notifications
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
        {saved && <span style={{ fontSize: 13, color: '#10B981' }}>Settings saved successfully.</span>}
      </div>
    </>
  )
}
