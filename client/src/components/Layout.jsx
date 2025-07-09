import { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { UserButton } from '@clerk/clerk-react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  HiHome,
  HiFolder,
  HiUserCircle,
  HiCog,
  HiArrowRightOnRectangle,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: HiHome },
  { to: '/resume-ai', label: 'Resume AI', icon: HiFolder },
  { to: '/profile', label: 'Profile', icon: HiUserCircle },
  { to: '/settings', label: 'Settings', icon: HiCog },
  { to: '/sign-in', label: 'Logout', icon: HiArrowRightOnRectangle },
];

export default function Layout() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          aria-expanded={sidebarOpen}
          aria-controls="sidebar"
          className="text-gray-700 dark:text-gray-200 focus:outline-none"
        >
          <HiBars3 className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-indigo-600">Hirify</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </header>

      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <aside
          id="sidebar"
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-md p-4 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="Sidebar navigation"
        >
          {/* Mobile close button */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h1 className="text-2xl font-bold text-indigo-600">Hirify</h1>
            <button
  onClick={() => setSidebarOpen(false)}
  aria-label="Close sidebar"
  className="text-gray-700 dark:text-gray-200 focus:outline-none"
>
  <HiXMark className="h-6 w-6" />
</button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)} // close sidebar on mobile after click
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="mt-6 flex items-center gap-2 text-sm p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mx-1"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 md:ml-64">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold capitalize">Welcome to Hirify</h2>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-4 shadow min-h-[80vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}