'use client';

import Link      from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { post }    from '@/utils/api';

const navItems = [
  { label: 'Overview',  href: '/admin/dashboard',          section: 'main'    },
  { label: 'Teams',     href: '/admin/dashboard/teams',     section: 'main'    },
  { label: 'Results',   href: '/admin/dashboard/results',   section: 'main'    },
  { label: 'Gallery',   href: '/admin/dashboard/gallery',   section: 'content' },
  { label: 'News',      href: '/admin/dashboard/news',      section: 'content' },
  { label: 'Templates', href: '/admin/dashboard/templates', section: 'content' }
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try { await post('/api/auth/logout'); } catch {}
    logout();
    router.push('/admin/login');
  };

  return (
    <aside className="w-[200px] flex-shrink-0 flex flex-col"
      style={{ background: 'linear-gradient(180deg, #0F4C81 0%, #1A6BAD 100%)' }}>

      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center mb-2">
          <span className="text-white text-sm font-medium">SF</span>
        </div>
        <div className="text-white text-[13px] font-medium">SSF Festival</div>
        <div className="text-white/40 text-[10px] mt-0.5">Admin Panel · 2026</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3">
        <div className="text-[9px] text-white/35 uppercase tracking-widest px-2 py-2 mt-1">
          Main
        </div>

        {navItems.filter(i => i.section === 'main').map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-[12px] transition-all
                ${isActive
                  ? 'bg-white text-[#0F4C81] font-medium'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                ${isActive ? 'bg-[#0F4C81]' : 'bg-current opacity-50'}`} />
              {item.label}
            </Link>
          );
        })}

        <div className="text-[9px] text-white/35 uppercase tracking-widest px-2 py-2 mt-3">
          Content
        </div>

        {navItems.filter(i => i.section === 'content').map(item => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-[12px] transition-all
                ${isActive
                  ? 'bg-white text-[#0F4C81] font-medium'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                ${isActive ? 'bg-[#0F4C81]' : 'bg-current opacity-50'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-white/10">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/40
            text-[11px] hover:bg-white/06 hover:text-red-400 transition-all text-left">
          <span className="w-1.5 h-1.5 rounded-sm bg-current opacity-50" />
          Logout
        </button>
      </div>
    </aside>
  );
}