import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

export function TrafficUsersSection({ data = {}, onChange }) {
  const update = (key, val) => onChange({ ...data, [key]: val });
  const breakdown = data.breakdown || [];
  const otherMetrics = data.otherMetrics || [];

  function addBreakdownRow() {
    onChange({ ...data, breakdown: [...breakdown, { channel: '', value: '', share: '' }] });
  }
  function updateBreakdownRow(i, val) {
    const next = [...breakdown]; next[i] = val;
    onChange({ ...data, breakdown: next });
  }
  function removeBreakdownRow(i) {
    onChange({ ...data, breakdown: breakdown.filter((_, idx) => idx !== i) });
  }

  function addMetric() {
    if (otherMetrics.length >= 6) return;
    onChange({ ...data, otherMetrics: [...otherMetrics, { label: '', value: '', variation: '' }] });
  }
  function updateMetric(i, val) {
    const next = [...otherMetrics]; next[i] = val;
    onChange({ ...data, otherMetrics: next });
  }
  function removeMetric(i) {
    onChange({ ...data, otherMetrics: otherMetrics.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Total sessões / tráfego" value={data.totalSessions} onChange={v => update('totalSessions', v)} placeholder="ex: 4.2 M" />
        <Input label="Variação" value={data.totalSessionsVariation} onChange={v => update('totalSessionsVariation', v)} placeholder="ex: +11%" />
        <Input label="Utilizadores únicos" value={data.totalUsers} onChange={v => update('totalUsers', v)} placeholder="ex: 285 000" />
        <Input label="Variação" value={data.totalUsersVariation} onChange={v => update('totalUsersVariation', v)} placeholder="ex: +8%" />
        <Input label="DAU / MAU" value={data.dau} onChange={v => update('dau', v)} placeholder="ex: 12 400 DAU" hint="Se aplicável" />
        <Input label="Variação DAU/MAU" value={data.dauVariation} onChange={v => update('dauVariation', v)} placeholder="ex: +5%" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ctt-gray-900">Breakdown por canal / origem</h3>
          <Button size="sm" variant="ghost" onClick={addBreakdownRow}>+ Canal</Button>
        </div>
        <div className="space-y-2">
          {breakdown.map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 items-end">
              <Input label="Canal" value={row.channel} onChange={v => updateBreakdownRow(i, { ...row, channel: v })} placeholder="ex: Orgânico" />
              <Input label="Valor" value={row.value} onChange={v => updateBreakdownRow(i, { ...row, value: v })} placeholder="ex: 1.1 M" />
              <div className="flex gap-2 items-end">
                <Input label="Quota %" value={row.share} onChange={v => updateBreakdownRow(i, { ...row, share: v })} placeholder="ex: 26%" className="flex-1" />
                <button onClick={() => removeBreakdownRow(i)} className="mb-0.5 p-2 rounded-lg hover:bg-red-50 text-ctt-gray-400 hover:text-red-500 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ctt-gray-900">Métricas adicionais</h3>
          {otherMetrics.length < 6 && (
            <Button size="sm" variant="ghost" onClick={addMetric}>+ Métrica</Button>
          )}
        </div>
        <div className="space-y-2">
          {otherMetrics.map((m, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 items-end">
              <Input label="Label" value={m.label} onChange={v => updateMetric(i, { ...m, label: v })} placeholder="ex: Tx. Conversão" />
              <Input label="Valor" value={m.value} onChange={v => updateMetric(i, { ...m, value: v })} placeholder="ex: 3.2%" />
              <div className="flex gap-2 items-end">
                <Input label="Variação" value={m.variation} onChange={v => updateMetric(i, { ...m, variation: v })} placeholder="ex: +0.5pp" className="flex-1" />
                <button onClick={() => removeMetric(i)} className="mb-0.5 p-2 rounded-lg hover:bg-red-50 text-ctt-gray-400 hover:text-red-500 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Textarea label="Notas e contexto" value={data.notes} onChange={v => update('notes', v)} placeholder="Contexto adicional, anomalias, sazonalidade..." rows={3} />
    </div>
  );
}
