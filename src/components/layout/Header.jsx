import { Link, useLocation } from 'react-router-dom';

export function Header({ session, onMenuClick }) {
  const location = useLocation();

  const crumbs = [];
  if (session) {
    crumbs.push({ label: session.name || 'Sessão', href: `/session/${session.id}/review` });
  }

  return (
    <header className="bg-ctt-red text-white flex-none shadow-ctt">
      <div className="flex items-center justify-between px-4 sm:px-6 h-14">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger — only shown when onMenuClick is provided */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded hover:bg-white/20 transition-colors"
              aria-label="Abrir menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          {/* Logo CTT */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-white/20 rounded px-2 py-1">
              <span className="font-black text-xl tracking-wider">CTT</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-base leading-none">Digital 360</div>
              <div className="text-white/60 text-[10px] uppercase tracking-widest">Estado da Arte</div>
            </div>
          </Link>

          {/* Breadcrumb */}
          {crumbs.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-white/70">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {crumbs.map((c, i) => (
                <Link key={i} to={c.href} className="hover:text-white transition-colors truncate max-w-xs">{c.label}</Link>
              ))}
            </div>
          )}
        </div>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/session/new"
            className="ml-2 px-3 py-1.5 bg-white text-ctt-red rounded text-sm font-medium hover:bg-ctt-gray-100 transition-colors"
          >
            <span className="hidden sm:inline">+ Nova Sessão</span>
            <span className="sm:hidden">+</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
