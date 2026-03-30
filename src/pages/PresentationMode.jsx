import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { getProductById } from '../constants/products';
import { KPICard } from '../components/presentation/KPICard';
import { SlideCard } from '../components/presentation/SlideCard';

function buildSlides(session) {
  const slides = [];
  const products = (session.selectedProducts || Object.keys(session.products || {}))
    .map(pid => ({ id: pid, meta: getProductById(pid), data: session.products?.[pid] || {} }));

  // 0: Cover
  slides.push({ type: 'cover', session });
  // 1: Index
  slides.push({ type: 'index', session, products });
  // 2: Global revenue
  slides.push({ type: 'global', session, products });

  products.forEach(({ id, meta, data }) => {
    slides.push({ type: 'separator', id, meta, data, session });
    slides.push({ type: 'northstar', id, meta, data, session });
    slides.push({ type: 'revenue', id, meta, data, session });
    slides.push({ type: 'traffic', id, meta, data, session });
    slides.push({ type: 'product', id, meta, data, session });
    slides.push({ type: 'marketing', id, meta, data, session });
  });

  slides.push({ type: 'closing', session });
  return slides;
}

function SlideRenderer({ slide, slideNum, totalSlides }) {
  const varColor = v => !v ? '#6B7280' : String(v).startsWith('+') ? '#10B981' : String(v).startsWith('-') ? '#EF4444' : '#6B7280';
  const productName = slide.meta?.name || slide.id || '';
  const sn = slide.session?.name || '';

  if (slide.type === 'cover') {
    return (
      <SlideCard type="cover">
        <div className="text-xs font-semibold text-ctt-gray-400 uppercase tracking-widest mb-3">Estado da Arte</div>
        <h1 className="text-4xl font-bold text-ctt-gray-900 leading-tight mb-2">{slide.session.name}</h1>
        <div className="text-2xl font-bold text-ctt-red mb-4">{slide.session.period}</div>
        <div className="text-sm text-ctt-gray-400">{slide.session.audience} · {new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' })}</div>
      </SlideCard>
    );
  }

  if (slide.type === 'index') {
    return (
      <SlideCard type="content" productName="" sessionName={sn} slideNum={slideNum}>
        <h2 className="text-3xl font-bold text-ctt-red mb-6">Agenda</h2>
        <div className="grid grid-cols-2 gap-2">
          {slide.products.map(({ id, meta }, i) => (
            <div key={id} className="flex items-center gap-3 py-2 border-b border-ctt-gray-100">
              <span className="text-ctt-red font-bold text-sm w-6">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-sm text-ctt-gray-700">{meta?.name || id}</span>
            </div>
          ))}
        </div>
      </SlideCard>
    );
  }

  if (slide.type === 'global') {
    const withRevenue = slide.products.filter(p => p.data.northStar?.currentValue);
    return (
      <SlideCard type="content" productName="" sessionName={sn} slideNum={slideNum}>
        <h2 className="text-3xl font-bold text-ctt-red mb-6">Receita Digital Global</h2>
        <div className="grid grid-cols-3 gap-4">
          {withRevenue.slice(0, 6).map(({ id, meta, data }) => (
            <KPICard key={id} label={meta?.name || id} value={data.northStar.currentValue} variation={data.northStar.variation} period={data.northStar.periodLabel} />
          ))}
        </div>
      </SlideCard>
    );
  }

  if (slide.type === 'separator') {
    return (
      <SlideCard type="separator">
        <div className="text-white/60 text-sm uppercase tracking-[0.2em] mb-3">{slide.meta?.owner}</div>
        <h2 className="text-5xl font-bold text-white text-center px-8 leading-tight">{productName}</h2>
      </SlideCard>
    );
  }

  if (slide.type === 'northstar') {
    const ns = slide.data.northStar || {};
    const otherKPIs = ns.otherKPIs || [];
    return (
      <SlideCard type="content" productName={productName} sessionName={sn} slideNum={slideNum}>
        <h2 className="text-2xl font-bold text-ctt-red mb-4">KPIs Principais</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <KPICard label={ns.metric || 'North Star'} value={ns.currentValue} variation={ns.variation} period={ns.periodLabel} size="lg" />
          {otherKPIs.slice(0, 2).map((kpi, i) => (
            <KPICard key={i} label={kpi.label} value={kpi.value} variation={kpi.variation} />
          ))}
        </div>
        {ns.executiveHighlight && (
          <div className="bg-red-50 border-l-4 border-ctt-red rounded-r-xl p-4">
            <div className="text-xs font-bold text-ctt-red mb-1 uppercase tracking-wide">Destaque executivo</div>
            <p className="text-sm text-ctt-gray-700">{ns.executiveHighlight}</p>
          </div>
        )}
      </SlideCard>
    );
  }

  if (slide.type === 'revenue') {
    const rev = slide.data.revenue || {};
    return (
      <SlideCard type="content" productName={productName} sessionName={sn} slideNum={slideNum}>
        <h2 className="text-2xl font-bold text-ctt-red mb-3">Receita</h2>
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-4xl font-bold text-ctt-gray-900">{rev.total || '—'}</span>
          {rev.totalVariation && (
            <span className="text-xl font-bold" style={{ color: varColor(rev.totalVariation) }}>{rev.totalVariation}</span>
          )}
        </div>
        {rev.breakdown?.filter(r => r.label).length > 0 && (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-ctt-red">
                <th className="text-left py-2 text-ctt-red font-semibold">Linha</th>
                <th className="text-right py-2 text-ctt-red font-semibold">Valor</th>
                <th className="text-right py-2 text-ctt-red font-semibold">Quota</th>
                <th className="text-right py-2 text-ctt-red font-semibold">Var. YoY</th>
              </tr>
            </thead>
            <tbody>
              {rev.breakdown.filter(r => r.label).map((row, i) => (
                <tr key={i} className="border-b border-ctt-gray-100">
                  <td className="py-2 text-ctt-gray-700">{row.label}</td>
                  <td className="py-2 text-right font-semibold text-ctt-gray-900">{row.value}</td>
                  <td className="py-2 text-right text-ctt-gray-500">{row.share}</td>
                  <td className="py-2 text-right font-semibold" style={{ color: varColor(row.variation) }}>{row.variation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SlideCard>
    );
  }

  if (slide.type === 'traffic') {
    const t = slide.data.traffic || {};
    return (
      <SlideCard type="content" productName={productName} sessionName={sn} slideNum={slideNum}>
        <h2 className="text-2xl font-bold text-ctt-red mb-4">Tráfego & Utilizadores</h2>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <KPICard label="Total Sessões" value={t.totalSessions} variation={t.totalSessionsVariation} size="lg" />
          <KPICard label="Utilizadores Únicos" value={t.totalUsers} variation={t.totalUsersVariation} size="lg" />
        </div>
        {t.breakdown?.filter(r => r.channel).length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-ctt-gray-500 uppercase tracking-wide mb-2">Por canal</h3>
            <div className="grid grid-cols-4 gap-2">
              {t.breakdown.filter(r => r.channel).map((row, i) => (
                <div key={i} className="bg-ctt-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-ctt-gray-400">{row.channel}</div>
                  <div className="font-bold text-ctt-gray-900 text-sm">{row.value}</div>
                  <div className="text-xs text-ctt-gray-400">{row.share}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SlideCard>
    );
  }

  if (slide.type === 'product') {
    const dev = slide.data.productDev || {};
    const fwd = slide.data.lookingForward || {};
    return (
      <SlideCard type="content" productName={productName} sessionName={sn} slideNum={slideNum}>
        <h2 className="text-2xl font-bold text-ctt-red mb-4">Desenvolvimento de Produto</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-bold text-ctt-gray-500 uppercase tracking-wide mb-3">Realizado — {slide.session.period}</h3>
            <ul className="space-y-2">
              {(dev.features || []).filter(f => f.title).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span>{f.status === 'completed' ? '✅' : f.status === 'wip' ? '🔄' : '⚠️'}</span>
                  <div><span className="font-semibold text-ctt-gray-900">{f.title}</span>{f.description && <span className="text-ctt-gray-500"> — {f.description}</span>}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-ctt-gray-500 uppercase tracking-wide mb-3">Looking Forward</h3>
            <ul className="space-y-2">
              {(fwd.initiatives || []).filter(i => i.title).map((init, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span>{init.priority === 'high' ? '🔴' : init.priority === 'medium' ? '🟡' : '🟢'}</span>
                  <div><span className="font-semibold text-ctt-gray-900">{init.title}</span>{init.description && <span className="text-ctt-gray-500"> — {init.description}</span>}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SlideCard>
    );
  }

  if (slide.type === 'marketing') {
    const mkt = slide.data.marketing || {};
    return (
      <SlideCard type="content" productName={productName} sessionName={sn} slideNum={slideNum}>
        <h2 className="text-2xl font-bold text-ctt-red mb-3">Marketing & Dinamização</h2>
        {mkt.googleAlwaysOnInvestment && (
          <div className="bg-blue-50 rounded-xl p-3 mb-4 text-sm">
            <span className="font-bold text-ctt-gray-900">Google Always On: </span>
            <span className="text-ctt-gray-700">{mkt.googleAlwaysOnInvestment}€ ({mkt.googleAlwaysOnPercentOfTotal}% do total)</span>
          </div>
        )}
        {mkt.campaigns?.filter(c => c.name).length > 0 && (
          <table className="w-full text-sm border-collapse mb-3">
            <thead><tr className="border-b-2 border-ctt-red">
              <th className="text-left py-1.5 text-ctt-red font-semibold">Campanha</th>
              <th className="text-left py-1.5 text-ctt-red font-semibold">Tipo</th>
              <th className="text-left py-1.5 text-ctt-red font-semibold">Resultado</th>
            </tr></thead>
            <tbody>{mkt.campaigns.filter(c => c.name).map((c, i) => (
              <tr key={i} className="border-b border-ctt-gray-100">
                <td className="py-1.5 text-ctt-gray-700">{c.name}</td>
                <td className="py-1.5 text-ctt-gray-500">{c.type}</td>
                <td className="py-1.5 text-ctt-gray-700">{c.result}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {mkt.highlights && <p className="text-sm text-ctt-gray-600 italic">{mkt.highlights}</p>}
      </SlideCard>
    );
  }

  if (slide.type === 'closing') {
    return (
      <SlideCard type="closing">
        <div className="text-white/60 text-sm uppercase tracking-[0.3em] mb-4">Digital 360</div>
        <h2 className="text-6xl font-bold text-white mb-4">Obrigado</h2>
        <div className="text-2xl text-white/70">a todos!</div>
        <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-3">
          <div className="text-white font-black text-3xl">CTT</div>
        </div>
      </SlideCard>
    );
  }

  return null;
}

export function PresentationMode() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { fetchSession } = useSession();
  const [session, setSession] = useState(null);
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    fetchSession(sessionId).then(s => {
      if (s) {
        setSession(s);
        setSlides(buildSlides(s));
      }
    });
  }, [sessionId]);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimerSeconds(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleKey = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') setCurrent(c => Math.min(c + 1, slides.length - 1));
    if (e.key === 'ArrowLeft') setCurrent(c => Math.max(c - 1, 0));
    if (e.key === 'Escape') navigate(`/session/${sessionId}/review`);
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
  }, [slides, sessionId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }

  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const slide = slides[current];
  const productSlides = slides.filter(s => ['separator', 'northstar', 'revenue', 'traffic', 'product', 'marketing'].includes(s.type) && s.id);
  const currentProductName = slide?.meta?.name || '';
  const progress = slides.length > 1 ? (current / (slides.length - 1)) * 100 : 0;

  if (!session || slides.length === 0) return (
    <div className="flex-1 flex items-center justify-center bg-gray-900">
      <div className="text-white text-sm">A carregar apresentação...</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
        <div
          className="bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300"
          style={{ aspectRatio: '16/9', maxHeight: '100%', width: '100%', maxWidth: 'calc((100vh - 120px) * (16/9))' }}
          onClick={() => setCurrent(c => Math.min(c + 1, slides.length - 1))}
        >
          {slide && (
            <SlideRenderer slide={slide} slideNum={current + 1} totalSlides={slides.length} />
          )}
        </div>
      </div>

      {/* Controls bar */}
      <div className="bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 px-6 py-3 flex items-center gap-4 flex-none">
        {/* Progress */}
        <div className="flex-1 bg-gray-700 rounded-full h-1">
          <div className="h-1 bg-ctt-red rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Slide counter */}
        <div className="text-xs text-gray-400 tabular-nums whitespace-nowrap">
          {current + 1} / {slides.length}
        </div>

        {/* Product indicator */}
        {currentProductName && (
          <div className="text-xs text-white/70 truncate max-w-xs">{currentProductName}</div>
        )}

        {/* Timer */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimerActive(a => !a)}
            className={`text-xs px-2 py-1 rounded transition-colors ${timerActive ? 'bg-ctt-red text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {timerActive ? '⏸' : '▶'} {formatTimer(timerSeconds)}
          </button>
          {timerSeconds > 0 && (
            <button onClick={() => { setTimerSeconds(0); setTimerActive(false); }} className="text-xs text-gray-500 hover:text-gray-300">↺</button>
          )}
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrent(c => Math.max(c - 1, 0))}
            disabled={current === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button
            onClick={() => setCurrent(c => Math.min(c + 1, slides.length - 1))}
            disabled={current === slides.length - 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <button onClick={toggleFullscreen} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors" title="F">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1h4M1 1v4M11 1h-4M11 1v4M1 11h4M1 11v-4M11 11h-4M11 11v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>

        <button onClick={() => navigate(`/session/${sessionId}/review`)} className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded">
          ESC Sair
        </button>
      </div>
    </div>
  );
}
