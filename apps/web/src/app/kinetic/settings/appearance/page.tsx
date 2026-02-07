'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useState } from 'react';

import type { ReactElement } from 'react';

const themes = [
  { id: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' },
  { id: 'dark', label: 'Dark', icon: Moon, description: 'Always use dark mode' },
  { id: 'light', label: 'Light', icon: Sun, description: 'Always use light mode' },
];

const accentColors = [
  { id: 'cyan', color: '#22d3ee', label: 'Cyan' },
  { id: 'violet', color: '#8b5cf6', label: 'Violet' },
  { id: 'emerald', color: '#10b981', label: 'Emerald' },
  { id: 'amber', color: '#f59e0b', label: 'Amber' },
  { id: 'rose', color: '#f43f5e', label: 'Rose' },
];

export default function AppearanceSettings(): ReactElement {
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedAccent, setSelectedAccent] = useState('cyan');

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <section className="glass-card-elevated p-6">
        <h2 className="text-lg font-semibold mb-1">Theme</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">Select your preferred color scheme.</p>

        <div className="grid grid-cols-3 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`
                p-4 rounded-lg border text-left transition-all
                ${
                  selectedTheme === theme.id
                    ? 'border-accent bg-accent/10'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--bg-primary)]'
                }
              `}
            >
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mb-3
                  ${selectedTheme === theme.id ? 'bg-accent text-[var(--bg-primary)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'}
                `}
              >
                <theme.icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-medium mb-0.5">{theme.label}</div>
              <div className="text-xs text-[var(--text-muted)]">{theme.description}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Accent Color */}
      <section className="glass-card-elevated p-6">
        <h2 className="text-lg font-semibold mb-1">Accent Color</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Choose your primary accent color for the interface.
        </p>

        <div className="flex gap-3">
          {accentColors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedAccent(color.id)}
              title={color.label}
              className={`
                w-10 h-10 rounded-full transition-all
                ${selectedAccent === color.id ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-elevated)]' : 'hover:scale-110'}
              `}
              style={{
                backgroundColor: color.color,
              }}
            />
          ))}
        </div>
      </section>

      {/* Font Size */}
      <section className="glass-card-elevated p-6">
        <h2 className="text-lg font-semibold mb-1">Interface Scale</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Adjust the size of text and UI elements.
        </p>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--text-muted)]">Aa</span>
          <input
            type="range"
            min="80"
            max="120"
            defaultValue="100"
            className="flex-1 accent-[var(--accent)]"
          />
          <span className="text-lg text-[var(--text-muted)]">Aa</span>
        </div>
      </section>

      {/* Motion Preferences */}
      <section className="glass-card-elevated p-6">
        <h2 className="text-lg font-semibold mb-1">Motion</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Control animations and transitions in the interface.
        </p>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-medium">Reduce motion</div>
              <div className="text-xs text-[var(--text-muted)]">
                Minimize animations for accessibility
              </div>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded accent-[var(--accent)]" />
          </label>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="btn-primary px-6 py-2.5 rounded-lg text-sm">Save Preferences</button>
      </div>
    </div>
  );
}
