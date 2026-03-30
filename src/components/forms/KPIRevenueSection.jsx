import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

function KPIRow({ kpi, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-3 gap-3 items-end">
      <Input label="Label" value={kpi.label} onChange={v => onChange({ ...kpi, label: v })} placeholder="ex: Taxa Conversão" />
      <Input label="Valor" value={kpi.value} onChange={v => onChange({ ...kpi, value: v })} placeholder="ex: 3.2%" />
      <div className="flex gap-2 items-end">
        <Input label="Variação" value={kpi.variation} onChange={v => onChange({ ...kpi, variation: v })} placeholder="ex: +0.5pp" className="flex-1" />
        <button onClick={onRemove} className="mb-0.5 p-2 rounded-lg hover:bg-red-50 text-ctt-gray-400 hover:text-red-500 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );
}

export function NorthStarSection({ data = {}, onChange }) {
  const update = (key, val) => onChange({ ...data, [key]: val });
  const otherKPIs = data.otherKPIs || [];

  function addKPI() {
    onChange({ ...data, otherKPIs: [...otherKPIs, { label: '', value: '', variation: '' }] });
  }
  function updateKPI(i, val) {
    const next = [...otherKPIs]; next[i] = val;
    onChange({ ...data, otherKPIs: next });
  }
  function removeKPI(i) {
    onChange({ ...data, otherKPIs: otherKPIs.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-ctt-gray-900 mb-4">Métrica North Star</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Métrica" required value={data.metric} onChange={v => update('metric', v)} placeholder="ex: Receita Total" />
          <Input label="Label do período" value={data.periodLabel} onChange={v => update('periodLabel', v)} placeholder="ex: 2024 vs 2023" />
          <Input label="Valor atual" required value={data.currentValue} onChange={v => update('currentValue', v)} placeholder="ex: 129 551 297 €" />
          <Input label="Valor período anterior" value={data.previousValue} onChange={v => update('previousValue', v)} placeholder="ex: 121 047 898 €" />
          <Input label="Variação" value={data.variation} onChange={v => update('variation', v)} placeholder="ex: +7%" hint="Calculada automaticamente se os valores forem numéricos" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ctt-gray-900">Outros KPIs relevantes</h3>
          {otherKPIs.length < 4 && (
            <Button size="sm" variant="ghost" onClick={addKPI}>+ Adicionar KPI</Button>
          )}
        </div>
        <div className="space-y-3">
          {otherKPIs.map((kpi, i) => (
            <KPIRow key={i} kpi={kpi} onChange={v => updateKPI(i, v)} onRemove={() => removeKPI(i)} />
          ))}
          {otherKPIs.length === 0 && (
            <p className="text-xs text-ctt-gray-400 italic">Nenhum KPI adicional. Clica em + Adicionar KPI para incluir.</p>
          )}
        </div>
      </div>

      <div>
        <Textarea
          label="Destaque executivo"
          required
          value={data.executiveHighlight}
          onChange={v => update('executiveHighlight', v)}
          placeholder="1-2 frases que resumam o desempenho deste produto no período..."
          rows={3}
          hint="Este campo aparece no slide de resumo da sessão."
        />
      </div>
    </div>
  );
}

function BreakdownRow({ row, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-4 gap-2 items-end">
      <Input label="Linha de negócio" value={row.label} onChange={v => onChange({ ...row, label: v })} placeholder="ex: Customer Shipping" />
      <Input label="Valor" value={row.value} onChange={v => onChange({ ...row, value: v })} placeholder="ex: 78 M€" />
      <Input label="Quota %" value={row.share} onChange={v => onChange({ ...row, share: v })} placeholder="ex: 60%" />
      <div className="flex gap-2 items-end">
        <Input label="Variação YoY" value={row.variation} onChange={v => onChange({ ...row, variation: v })} placeholder="ex: +9%" className="flex-1" />
        <button onClick={onRemove} className="mb-0.5 p-2 rounded-lg hover:bg-red-50 text-ctt-gray-400 hover:text-red-500 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );
}

export function RevenueSection({ data = {}, onChange, productMeta }) {
  const update = (key, val) => onChange({ ...data, [key]: val });
  const breakdown = data.breakdown || (productMeta?.revenueBreakdown?.map(l => ({ label: l, value: '', share: '', variation: '' })) || []);

  function addRow() {
    onChange({ ...data, breakdown: [...breakdown, { label: '', value: '', share: '', variation: '' }] });
  }
  function updateRow(i, val) {
    const next = [...breakdown]; next[i] = val;
    onChange({ ...data, breakdown: next });
  }
  function removeRow(i) {
    onChange({ ...data, breakdown: breakdown.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Receita total" required value={data.total} onChange={v => update('total', v)} placeholder="ex: 129 551 297 €" />
        <Input label="Variação YoY" value={data.totalVariation} onChange={v => update('totalVariation', v)} placeholder="ex: +7%" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ctt-gray-900">Breakdown por linha de negócio</h3>
          <Button size="sm" variant="ghost" onClick={addRow}>+ Linha</Button>
        </div>
        <div className="space-y-2">
          {breakdown.map((row, i) => (
            <BreakdownRow key={i} row={row} onChange={v => updateRow(i, v)} onRemove={() => removeRow(i)} />
          ))}
        </div>
      </div>

      <Textarea label="Notas e contexto" value={data.notes} onChange={v => update('notes', v)} placeholder="Contexto adicional, notas sobre desvios..." rows={3} />
    </div>
  );
}
