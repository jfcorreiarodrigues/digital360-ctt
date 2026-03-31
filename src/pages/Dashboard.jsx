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

  return (
    <div className="group bg-white rounded-2xl border border-ctt-gray-100 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
      <div className="h-1 bg-ctt-red" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-ctt-gray-900 leading-snug truncate">{session.name}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs font-semibold text-ctt-gray-400">{session.period}</span>
              <AudienceBadge audience={session.audience} />
              <SessionBadge status={session.status} />
            </div>
          </div>
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
              to={`/session/${session.id}/product/${session.selectedProducts?.[0] || Object.keys(session.products || {})[0]}`}
              className="px-2.5 py-1.5 text-xs font-semibold text-ctt-gray-600 bg-ctt-gray-50 hover:bg-ctt-gray-100 rounded-lg transition-colors"
            >
              Editar
            </Link>
            <Link
              to={`/session/${session.id}/present`}
              className="px-2.5 py-1.5 text-xs font-semibold text-ctt-gray-600 bg-ctt-gray-50 hover:bg-ctt-gray-100 rounded-lg transition-colors"
            >
              Apresentar
            </Link>
            <Link
              to={`/session/${session.id}/export`}
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-ctt-red hover:bg-ctt-red-dark rounded-lg transition-colors"
            >
              Exportar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { fetchSessions, deleteSession } = useSession();
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState({ status: '', audience: '', period: '' });
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions().then(setSessions);
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
      <div className="bg-ctt-red text-white px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-white/60 text-sm uppercase tracking-widest mb-1">Plataforma</div>
          <h1 className="text-4xl font-bold mb-1">Digital 360 <span className="font-light italic">CTT</span></h1>
          <p className="text-white/70 text-sm max-w-xl">Gestão centralizada das sessões Estado da Arte. Curadoria estruturada, apresentação guiada, exports automáticos.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Controls */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              className="text-sm border border-ctt-gray-200 rounded-lg px-3 py-1.5 bg-white text-ctt-gray-700 focus:ring-2 focus:ring-ctt-red focus:outline-none">
              <option value="">Todos os status</option>
              <option value="draft">Rascunho</option>
              <option value="in_review">Em Revisão</option>
              <option value="ready">Pronto</option>
              <option value="presented">Apresentado</option>
            </select>
            <select value={filter.audience} onChange={e => setFilter(f => ({ ...f, audience: e.target.value }))}
              className="text-sm border border-ctt-gray-200 rounded-lg px-3 py-1.5 bg-white text-ctt-gray-700 focus:ring-2 focus:ring-ctt-red focus:outline-none">
              <option value="">Todas as audiências</option>
              <option value="B2C">B2C</option>
              <option value="B2B">B2B</option>
              <option value="Ambos">Ambos</option>
            </select>
            <select value={filter.period} onChange={e => setFilter(f => ({ ...f, period: e.target.value }))}
              className="text-sm border border-ctt-gray-200 rounded-lg px-3 py-1.5 bg-white text-ctt-gray-700 focus:ring-2 focus:ring-ctt-red focus:outline-none">
              <option value="">Todos os períodos</option>
              {periods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {(filter.status || filter.audience || filter.period) && (
              <button onClick={() => setFilter({ status: '', audience: '', period: '' })} className="text-xs text-ctt-gray-400 hover:text-ctt-red transition-colors">
                Limpar filtros ×
              </button>
            )}
          </div>
          <Button onClick={() => navigate('/session/new')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Nova Sessão
          </Button>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-ctt-gray-700 mb-2">Nenhuma sessão encontrada</h2>
            <p className="text-ctt-gray-400 text-sm mb-6">Cria a primeira sessão para começar</p>
            <Button onClick={() => navigate('/session/new')}>Criar primeira sessão</Button>
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
