import { NavLink, Outlet } from 'react-router-dom';
import { useMemo } from 'react';
import { clsx } from 'clsx';

const navItems = [
  { to: '/', label: 'Plan Builder', exact: true },
  { to: '/library', label: 'Plan Library' },
  { to: '/composer', label: 'Prompt Composer' },
  { to: '/export', label: 'Export' }
];

export function AppLayout(): JSX.Element {
  const renderedNav = useMemo(
    () =>
      navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              'px-3 py-2 rounded-full text-sm font-medium transition-colors',
              isActive ? 'bg-primary text-white shadow-lg shadow-primary/40' : 'text-slate-300 hover:bg-surface-subtle'
            )
          }
          end={item.exact}
        >
          {item.label}
        </NavLink>
      )),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-muted to-surface-subtle">
      <header className="sticky top-0 z-10 backdrop-blur border-b border-white/10 bg-surface/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-primary-light">Agent Plan Studio</p>
            <h1 className="text-lg font-semibold text-white">Orchestrate multi-platform narratives</h1>
          </div>
          <div className="hidden gap-2 md:flex">{renderedNav}</div>
        </div>
        <nav className="flex gap-2 px-4 pb-3 md:hidden">{renderedNav}</nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6">
        <Outlet />
      </main>
    </div>
  );
}
