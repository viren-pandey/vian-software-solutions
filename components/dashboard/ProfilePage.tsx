'use client'

import { useState, useCallback } from 'react'
import { api, ApiError } from '@/lib/api'
import { showToast } from '@/components/ui/Toast'
import type { User } from '@/types/api'

interface ProfilePageProps {
  user: User
  unreadCount: number
}

export function ProfilePage({ user, unreadCount }: ProfilePageProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      if (newPassword && newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error')
        setSaving(false)
        return
      }
      if (newPassword && newPassword.length < 8) {
        showToast('Password must be at least 8 characters', 'error')
        setSaving(false)
        return
      }
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          ...(newPassword ? { currentPassword, newPassword } : {}),
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new ApiError(res.status, err.error || 'Update failed')
      }
      showToast('Profile updated successfully', 'success')
      setSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Failed to update profile', 'error')
    }
    setSaving(false)
  }, [name, email, currentPassword, newPassword, confirmPassword])

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>My Profile</h1>
          <p className="subtitle">Manage your account information and security</p>
        </div>
      </div>

      <div className="dash-section-header" style={{ marginTop: 8 }}>
        <h3>Account Information</h3>
      </div>
      <div className="dash-card" style={{ marginBottom: 24, padding: 24, maxWidth: 560 }}>
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div className="field" style={{ marginBottom: 8 }}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
          <span className="dash-badge dash-badge-info" style={{ fontSize: 11 }}>{user.role}</span>
        </div>
      </div>

      <div className="dash-section-header">
        <h3>Change Password</h3>
      </div>
      <div className="dash-card" style={{ marginBottom: 24, padding: 24, maxWidth: 560 }}>
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>
        <div className="field" style={{ marginBottom: 16 }}>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 8 chars)"
            disabled={!currentPassword}
          />
        </div>
        <div className="field" style={{ marginBottom: 8 }}>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={!newPassword}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 560 }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </>
  )
}
