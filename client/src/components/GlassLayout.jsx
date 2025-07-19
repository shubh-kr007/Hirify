// src/components/GlassLayout.jsx
import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  SparklesIcon,
  Cog6ToothIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

const nav = [
  { name: 'Dashboard', icon: HomeIcon, to: '/dashboard' },
  { name: 'Job Tracker', icon: BriefcaseIcon, to: '/jobs' },
  { name: 'Resume', icon: DocumentTextIcon, to: '/resume' },
  { name: 'Resume Assistant', icon: SparklesIcon, to: '/resume-assistant' },
  { name: 'Profile Settings', icon: UserCircleIcon, to: '/profile' },
  { name: 'Accessinn', icon: Cog6ToothIcon, to: '/accessinn' }
]

export default function GlassLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#232c47] via-[#3a466e] to-[#e8ecf7]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white/10 backdrop-blur-md border-r border-white/10 rounded-2xl m-4 flex flex-col p-4 shadow-glass">
        <div className="mb-8">
          <span className="text-2xl font-bold text-white">AI Job Tracker</span>
        </div>
        <nav className="flex-1 space-y-2">
          {nav.map(item => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/70 hover:bg-white/10'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}