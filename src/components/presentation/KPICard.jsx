export function KPICard({ label, value, variation, variationType, period, size = 'md' }) {
  const isUp = variationType === 'up' || (variation && String(variation).startsWith('+'));
  const isDown = variationType === 'down' || (variation && String(variation).startsWith('-'));

  const varColor = isUp ? 'text-emerald-600' : isDown ? 'text-red-500' : 'text-ctt-gray-400';
  const varBg = isUp ? 'bg-emerald-50' : isDown ? 'bg-red-50' : 'bg-ctt-gray-100';

  const valueSizes = { sm: 'text-xl', md: 'text-3xl', lg: 'text-4xl' };

  return (
    <div className="bg-white rounded-xl border border-ctt-gray-100 shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden">
      <div className="w-full h-1 bg-ctt-red" />
      <div className="p-4">
        <p className="text-xs font-semibold text-ctt-gray-400 uppercase tracking-wide mb-1">{label}</p>
        <p className={`${valueSizes[size]} font-bold text-ctt-gray-900 leading-tight`}>{value || '—'}</p>
        {(variation || period) && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {variation && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${varColor} ${varBg}`}>
                {isUp && <span>↑</span>}
                {isDown && <span>↓</span>}
                {variation}
              </span>
            )}
            {period && <span className="text-xs text-ctt-gray-400">{period}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
