export function ProgressBar({ value = 0, showLabel = true, size = 'md' }) {
  const pct = Math.min(100, Math.max(0, value));
  const h = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  let barColor;
  if (pct === 100) barColor = 'bg-emerald-500';
  else if (pct >= 66) barColor = 'bg-amber-400';
  else if (pct >= 33) barColor = 'bg-amber-300';
  else barColor = 'bg-ctt-gray-200';

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-ctt-gray-100 rounded-full overflow-hidden ${h}`}>
        <div
          className={`${h} ${barColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-ctt-gray-600 w-10 text-right tabular-nums">{pct}%</span>
      )}
    </div>
  );
}
