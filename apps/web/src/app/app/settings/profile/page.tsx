'use client';

import { Camera, Mail, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

import type { ReactElement } from 'react';

export default function ProfileSettings(): ReactElement {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      {/* Profile Photo Section */}
      <section className="glass-card-elevated p-6">
        <h2 className="text-lg font-semibold mb-1">Profile Photo</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Your profile photo is visible to team members.
        </p>

        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-dim to-accent flex items-center justify-center text-2xl font-semibold text-[var(--bg-primary)]">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="space-y-2">
            <button className="btn-secondary text-sm px-4 py-2 rounded-lg">Change photo</button>
            <p className="text-xs text-[var(--text-muted)]">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>
      </section>

      {/* Personal Information Section */}
      <section className="glass-card-elevated p-6">
        <h2 className="text-lg font-semibold mb-1">Personal Information</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">Update your personal details here.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-muted)]" />
              <input
                type="text"
                defaultValue={session?.user?.name || ''}
                placeholder="Enter your name"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-[var(--accent-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-muted)]" />
              <input
                type="email"
                defaultValue={session?.user?.email || ''}
                placeholder="Enter your email"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-[var(--accent-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/10 transition-all"
              />
            </div>
          </div>

          <div className="pt-4">
            <button className="btn-primary px-4 py-2.5 rounded-lg text-sm">Save Changes</button>
          </div>
        </div>
      </section>

      {/* Connected Accounts Section */}
      <section className="glass-card-elevated p-6">
        <h2 className="text-lg font-semibold mb-1">Connected Accounts</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Manage your connected third-party accounts.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-xl">
              🔗
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Google</div>
              <div className="text-xs text-green-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-current rounded-full" />
                Connected
              </div>
            </div>
            <button className="btn-secondary text-xs px-3 py-1.5 rounded-lg">Disconnect</button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-xl">
              🐙
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">GitHub</div>
              <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-current rounded-full" />
                Not connected
              </div>
            </div>
            <button className="btn-secondary text-xs px-3 py-1.5 rounded-lg">Connect</button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="border border-red-500/20 rounded-lg p-6 bg-red-500/5">
        <h2 className="text-lg font-semibold text-red-400 mb-1">Danger Zone</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Irreversible and destructive actions.
        </p>

        <button className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors">
          Delete Account
        </button>
      </section>
    </div>
  );
}
