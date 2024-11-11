'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { AiOutlineAppstoreAdd, AiOutlineAppstore } from 'react-icons/ai';
import clsx from 'clsx';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      name: 'ModulesitemAddition',
      icon: <AiOutlineAppstoreAdd className="w-6 h-6" />,
      path: '/modulesitem-addition'
    },
    {
      name: 'ModulesAddition',
      icon: <AiOutlineAppstore className="w-6 h-6" />,
      path: '/modules-addition'
    }
  ];

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white 
        hover:bg-indigo-700 transition-colors duration-200 lg:hidden focus:outline-none 
        focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      <div
        className={clsx(
          'fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40',
          isOpen ? 'w-64' : 'w-0 lg:w-20'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-200 bg-indigo-600">
            <h1 className={clsx(
              'font-bold text-xl text-white transition-all duration-300',
              !isOpen && 'lg:hidden'
            )}>
              CodeDale
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={clsx(
                  'flex items-center gap-4 p-3 rounded-lg transition-all duration-200',
                  pathname === item.path 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {item.icon}
                <span className={clsx(
                  'font-medium transition-all duration-300',
                  !isOpen && 'lg:hidden'
                )}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}