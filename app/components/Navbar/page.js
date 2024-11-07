"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Award,Home } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="text-[20px] font-bold animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">Job Alchemy</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink href="/home" icon={<Award className="w-5 h-5" />} text="CV Summary" active={pathname === '/'} />
            <NavLink href="/resume" icon={<FileText className="w-5 h-5" />} text="Resume Builder" active={pathname === '/resume'} />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, icon, text, active }) => (
  <Link href={href} className="relative">
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      active ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
    }`}>
      {icon}
      <span>{text}</span>
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </div>
  </Link>
);

export default Navbar;
