'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Shirt,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Products', href: '/products', icon: Package },
];

function isActive(pathname, href) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

const panelClasses = 'flex h-full flex-col bg-gradient-to-b from-navy-700 to-navy-900';

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
        <Shirt className="h-5 w-5 text-white" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold tracking-wide text-white">Atlas reteke</p>
        <p className="text-xs font-medium text-navy-200">Wholesale CRM</p>
      </div>
    </div>
  );
}

function NavLinks({ pathname, layoutId, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium"
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-white/10"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Icon
              className={`relative h-[18px] w-[18px] transition-colors ${
                active ? 'text-white' : 'text-navy-300 group-hover:text-white'
              }`}
            />
            <span
              className={`relative transition-colors ${
                active ? 'text-white' : 'text-navy-100 group-hover:text-white'
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 md:block">
        <div className={panelClasses}>
          <div className="px-5 py-6">
            <Brand />
          </div>
          <div className="px-3">
            <NavLinks pathname={pathname} layoutId="active-nav-desktop" />
          </div>
          <div className="mt-auto px-5 py-5">
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <p className="text-xs font-semibold text-white">Sales Team</p>
              <p className="text-xs text-navy-200">Signed in · Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-gradient-to-r from-navy-700 to-navy-800 px-4 md:hidden">
        <Brand />
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-lg text-white ring-1 ring-white/20 active:scale-95"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            >
              <div className={panelClasses}>
                <div className="flex items-center justify-between px-5 py-6">
                  <Brand />
                  <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setOpen(false)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-white ring-1 ring-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="px-3">
                  <NavLinks
                    pathname={pathname}
                    layoutId="active-nav-mobile"
                    onNavigate={() => setOpen(false)}
                  />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
