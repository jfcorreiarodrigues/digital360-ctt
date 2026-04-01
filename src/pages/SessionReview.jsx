import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSession, calcCompleteness } from '../hooks/useSession';
import { getProductById } from '../constants/products';
import { Header } from '../components/layout/Header';
import { ProductBadge, SessionBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/presentation/ProgressBar';
import { Button } from '../components/ui/Button';
import { KPICard } from '../components/presentation/KPICard';
import { Select } from '../components/ui/Input';

const SESSION_STATUSES = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'in_review', label: 'Em Revisão' },
  { value: 'ready', label: 'Pronto' },
  { value: 'presented', label: 'Apresentado' },
];

export function SessionReview() {
  const { sessionId } = useParams();
  const { fetchSession, updateSession } = useSession();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSession(sessionId).then(setSession);
  }, [sessionId]);

  async function handleStatusChange(status) {
    const updated = await updateSession(sessionId, { status });
    if (updated) setSession(updated);
  }

  if (!session) return (
    <div className="flex-1 flex items-center justify-center bg-ctt-gray-50">
      <div className="text-ctt-gray-400 text-sm">A carregar...</div>
    </div>
  );

  const productEntries = (session.selectedProducts || Object.keys(session.products || {})).map(pid => ({
    id: pid,
    meta: getProductById(pid),
    data: session.products?.[pid] || { productId: pid, status: 'draft' }
  }));

  const submitted = productEntries.filter(p => p.data.status === 'submitted').length;
  const total = productEntries.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header session={session} />
      <div className="flex-1 overflow-y-auto bg-ctt-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-ctt-gray-900">{session.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-ctt-gray-400">{session.period}</span>
                    <SessionBadge status={session.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {productEntries.map(({ id, meta, data }) => {
                  const completeness = calcCompleteness(data);
                  return (
                    <div key={id} className="bg-white rounded-2xl border border-ctt-gray-100 shadow-card overflow-hidden">
                      <div className="h-1 bg-ctt-red" />
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="font-semibold text-sm text-ctt-gray-900 leading-tight">{meta?.name || id}</div>
                            <div className="text-xs text-ctt-gray-400 mt-0.5">{meta?.owner}</div>
                          </div>
                          <ProductBadge status={data.status} />
                        </div>

                        <ProgressBar value={completeness} size="sm" />

                        {data.northStar?.currentValue && (
                          <div className="mt-3 bg-ctt-gray-50 rounded-lg p-2.5">
                            <div className="text-xs text-ctt-gray-400">{data.northStar.metric}</div>
                            <div className="font-bold text-ctt-gray-900 text-sm">{data.northStar.currentValue}</div>
                            {data.northStar.variation && (
                              <div className={`text-xs font-semibold ${data.northStar.variation.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                                {data.northStar.variation}
                              </div>
                            )}
                          </div>
                        )}

                        {data.northStar?.executiveHighlight && (
                          <p className="text-xs text-ctt-gray-500 mt-2 leading-relaxed line-clamp-2">
                            {data.northStar.executiveHighlight}
                          </p>
                        )}

                        <div className="mt-3 flex gap-2">
                          <Link
                            to={`/session/${sessionId}/product/${id}`}
                            className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg bg-ctt-gray-100 hover:bg-ctt-gray-200 text-ctt-gray-700 transition-colors"
                          >
                            Editar
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar panel */}
            <div className="w-full lg:w-72 lg:flex-none space-y-4">
              {/* Status */}
              <div className="bg-white rounded-2xl border border-ctt-gray-100 shadow-card p-5">
                <h3 className="font-bold text-sm text-ctt-gray-900 mb-3">Estado da sessão</h3>
                <Select
                  value={session.status}
                  onChange={handleStatusChange}
                  options={SESSION_STATUSES}
                />
              </div>

              {/* Progress */}
              <div className="bg-white rounded-2xl border border-ctt-gray-100 shadow-card p-5">
                <h3 className="font-bold text-sm text-ctt-gray-900 mb-3">Progresso geral</h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-ctt-red">{submitted}</div>
                  <div className="text-sm text-ctt-gray-400">de {total} produtos submetidos</div>
                </div>
                <ProgressBar value={total ? Math.round((submitted / total) * 100) : 0} />
              </div>

              {/* Revenue summary */}
              {productEntries.some(p => p.data.northStar?.currentValue) && (
                <div className="bg-white rounded-2xl border border-ctt-gray-100 shadow-card p-5">
                  <h3 className="font-bold text-sm text-ctt-gray-900 mb-3">Destaques North Star</h3>
                  <div className="space-y-2">
                    {productEntries.filter(p => p.data.northStar?.currentValue).slice(0, 4).map(({ id, meta, data }) => (
                      <div key={id} className="flex items-center justify-between text-xs py-1 border-b border-ctt-gray-100 last:border-0">
                        <span className="text-ctt-gray-600 truncate flex-1">{meta?.name || id}</span>
                        <span className="font-bold text-ctt-gray-900 ml-2">{data.northStar.currentValue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <Button className="w-full justify-center" onClick={() => navigate(`/session/${sessionId}/present`)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 5-10 5V2z" fill="currentColor"/></svg>
                  Apresentar Sessão
                </Button>
                <Button variant="secondary" className="w-full justify-center" onClick={() => navigate(`/session/${sessionId}/export`)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M1 11h12v2H1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
