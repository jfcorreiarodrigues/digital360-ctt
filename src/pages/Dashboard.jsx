import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { SessionBadge, AudienceBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

function SessionCard({ session, onDelete }) {
  const updatedAtDate = session.updatedAt ? new Date(session.updatedAt) : null;
  const updatedAt = updatedAtDate && !isNaN(updatedAtDate)
    ? updatedAtDate.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const totalProducts = session.selectedProducts?.length || Object.keys(session.products || {}).length;
  const submittedProducts = Object.values(session.products || {}).filter(p => p.status === 'submitted').length;
  const firstProductId = session.selectedProducts?.[0] || Object.keys(session.products || {})[0];

  return (
    <div className="group bg-white rounded-2xl border border-ctt-gray-100 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
      <div className="h-1 bg-ctt-red" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-ctt-gray-900 leading-snug truncate">{session.name}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs font-medium text-ctt-gray-400">{session.period}</span>
              <AudienceBadge audience={session.audience} />
              <SessionBadge status={session.status} />
            </div>
          </div>
          <button
            onClick={onDelete}
            className="flex-none opacity-0 group-hover:opacity-100 p-1.5 rounded text-ctt-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            aria-label="Eliminar sessão"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h10M5.5 3.5v-2h3v2M5.5 6v5M8.5 6v5M3 3.5l.75 8.5h6.5L11 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4 py-3 border-y border-ctt-gray-100 mb-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-ctt-gray-900">{submittedProducts}</div>
            <div className="text-xs text-ctt-gray-400">submetidos</div>
          </div>
          <div className="w-px h-8 bg-ctt-gray-100" />
          <div className="text-center">
            <div className="text-2xl font-bold text-ctt-gray-900">{totalProducts}</div>
            <div className="text-xs text-ctt-gray-400">total</div>
          </div>
          <div className="flex-1">
            <div className="w-full bg-ctt-gray-100 rounded-full h-2">
              <div
                className="h-2 bg-ctt-red rounded-full transition-all duration-500"
                style={{ width: totalProducts ? `${(submittedProducts / totalProducts) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-ctt-gray-400">Atualizado {updatedAt}</span>
          <div className="flex items-center gap-1.5">
            <Link
              to={`/session/${session.id}/product/${firstProductId}`}
              className="px-2.5 py-1.5 text-xs font-medium text-white bg-ctt-red hover:bg-ctt-red-dark rounded transition-colors"
            >
              Editar
            </Link>
            <Link
              to={`/session/${session.id}/present`}
              className="px-2.5 py-1.5 text-xs font-medium text-ctt-gray-600 bg-ctt-gray-50 hover:bg-ctt-gray-100 rounded transition-colors"
            >
              Apresentar
            </Link>
            <Link
              to={`/session/${session.id}/export`}
              className="px-2.5 py-1.5 text-xs font-medium text-ctt-gray-600 bg-ctt-gray-50 hover:bg-ctt-gray-100 rounded transition-colors"
            >
              Exportar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-ctt-gray-100 shadow-card overflow-hidden animate-pulse">
      <div className="h-1 bg-ctt-gray-100" />
      <div className="p-5">
        <div className="h-4 bg-ctt-gray-100 rounded w-3/4 mb-2" />
        <div className="h-3 bg-ctt-gray-100 rounded w-1/2 mb-5" />
        <div className="flex gap-4 py-3 border-y border-ctt-gray-100 mb-3">
          <div className="h-8 w-12 bg-ctt-gray-100 rounded" />
          <div className="flex-1 h-2 bg-ctt-gray-100 rounded-full self-center" />
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-6 w-16 bg-ctt-gray-100 rounded" />
          <div className="h-6 w-16 bg-ctt-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { fetchSessions, deleteSession } = useSession();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', audience: '', period: '' });
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions().then(data => {
      setSessions(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = sessions.filter(s => {
    if (filter.status && s.status !== filter.status) return false;
    if (filter.audience && s.audience !== filter.audience) return false;
    if (filter.period && s.period !== filter.period) return false;
    return true;
  });

  const periods = [...new Set(sessions.map(s => s.period).filter(Boolean))];

  async function handleDelete() {
    await deleteSession(deleteId);
    setSessions(prev => prev.filter(s => s.id !== deleteId));
    setDeleteId(null);
  }

  return (
    <div className="flex-1 bg-ctt-gray-50 overflow-y-auto">
      {/* Hero */}
      <div className="bg-ctt-red text-white px-4 sm:px-8 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-white/60 text-sm uppercase tracking-widest mb-1">Plataforma</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">Digital 360 <span className="font-light italic">CTT</span></h1>
          <p className="text-white/70 text-sm max-w-xl">Gestão centralizada das sessões Estado da Arte. Curadoria estruturada, apresentação guiada, exports automáticos.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Controls */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              className="text-sm border border-ctt-gray-200 rounded px-3 py-1.5 bg-white text-ctt-gray-700 focus:ring-2 focus:ring-ctt-gray-400 focus:outline-none">
              <option value="">Todos os status</option>
              <option value="draft">Rascunho</option>
              <option value="in_review">Em Revisão</option>
              <option value="ready">Pronto</option>
              <option value="presented">Apresentado</option>
            </select>
            <select value={filter.audience} onChange={e => setFilter(f => ({ ...f, audience: e.target.value }))}
              className="text-sm border border-ctt-gray-200 rounded px-3 py-1.5 bg-white text-ctt-gray-700 focus:ring-2 focus:ring-ctt-gray-400 focus:outline-none">
              <option value="">Todas as audiências</option>
              <option value="B2C">B2C</option>
              <option value="B2B">B2B</option>
              <option value="Ambos">Ambos</option>
            </select>
            <select value={filter.period} onChange={e => setFilter(f => ({ ...f, period: e.target.value }))}
              className="text-sm border border-ctt-gray-200 rounded px-3 py-1.5 bg-white text-ctt-gray-700 focus:ring-2 focus:ring-ctt-gray-400 focus:outline-none">
              <option value="">Todos os períodos</option>
              {periods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {(filter.status || filter.audience || filter.period) && (
              <button onClick={() => setFilter({ status: '', audience: '', period: '' })} className="text-xs text-ctt-gray-400 hover:text-ctt-red transition-colors">
                Limpar ×
              </button>
            )}
          </div>
          <Button onClick={() => navigate('/session/new')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Nova Sessão
          </Button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 mb-4 text-ctt-gray-300">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="12" width="48" height="44" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M20 12V8a4 4 0 014-4h16a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M22 30h20M22 38h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-ctt-gray-700 mb-2">Nenhuma sessão encontrada</h2>
            <p className="text-ctt-gray-400 text-sm mb-6">
              {sessions.length > 0 ? 'Tenta ajustar os filtros' : 'Cria a primeira sessão para começar'}
            </p>
            {sessions.length === 0 && (
              <Button onClick={() => navigate('/session/new')}>Criar primeira sessão</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(s => (
              <SessionCard key={s.id} session={s} onDelete={() => setDeleteId(s.id)} />
            ))}
          </div>
        )}
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Eliminar sessão">
        <p className="text-sm text-ctt-gray-600 mb-4">Tens a certeza que queres eliminar esta sessão? Esta ação não pode ser revertida.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}
