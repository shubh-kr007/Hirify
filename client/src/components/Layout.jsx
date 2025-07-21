import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import clsx from 'clsx';
import ThemeToggle from './ThemeToggle'; // We'll use the ThemeToggle component

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Job Tracker', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Resume Assistant', href: '/resume', icon: DocumentTextIcon },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(() => navigate('/'));
  };

  // Reusable Sidebar Content for both mobile and desktop
  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 px-6 pb-4 shadow-soft dark:border-r dark:border-gray-800">
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">AJ</span>
          </div>
          <span className="ml-3 text-xl font-bold text-gray-800 dark:text-white">
            AI Job Tracker
          </span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        isActive
                          ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600 shadow-sm dark:bg-primary-900/50 dark:text-white'
                          : 'text-gray-700 dark:text-gray-400 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white',
                        'group flex gap-x-3 rounded-l-lg p-3 text-sm leading-6 font-semibold transition-all duration-200'
                      )
                    }
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <div className="flex justify-center mb-4">
              <ThemeToggle />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {user?.imageUrl ? (
                    <img className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-700" src={user.imageUrl} alt="" />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-primary-400 dark:text-primary-500" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.fullName}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <NavLink
                  to="/profile"
                  className="flex-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-center"
                >
                  Profile
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="flex-1 bg-primary-600 text-white text-xs font-medium py-2 px-3 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white dark:bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button type="button" className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden" onClick={() => setSidebarOpen(true)}>
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg mr-3">
              <span className="text-white font-bold text-sm">AJ</span>
            </div>
            AI Job Tracker
          </div>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ThemeToggle />
          {user?.imageUrl ? (
            <img className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-700" src={user.imageUrl} alt="" />
          ) : (
            <UserCircleIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}