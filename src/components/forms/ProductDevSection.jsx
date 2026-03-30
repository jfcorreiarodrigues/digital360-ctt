import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';

const FEATURE_STATUS = [
  { value: 'completed', label: '✅ Concluído' },
  { value: 'wip', label: '🔄 Em curso (WIP)' },
  { value: 'blocked', label: '⚠️ Bloqueado' },
];

const INITIATIVE_PRIORITY = [
  { value: 'high', label: '🔴 Alta' },
  { value: 'medium', label: '🟡 Média' },
  { value: 'low', label: '🟢 Baixa' },
];

function FeatureRow({ item, onChange, onRemove }) {
  return (
    <div className="bg-ctt-gray-50 rounded-xl p-4 space-y-3 border border-ctt-gray-100">
      <div className="flex gap-3">
        <Input label="Título" value={item.title} onChange={v => onChange({ ...item, title: v })} placeholder="Nome da funcionalidade" className="flex-1" />
        <Select label="Status" value={item.status} onChange={v => onChange({ ...item, status: v })} options={FEATURE_STATUS} className="w-48" />
        <button onClick={onRemove} className="mt-5 p-2 h-9 rounded-lg hover:bg-red-50 text-ctt-gray-400 hover:text-red-500 transition-colors self-end">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <Textarea label="Descrição" value={item.description} onChange={v => onChange({ ...item, description: v })} placeholder="Breve descrição do que foi entregue..." rows={2} />
    </div>
  );
}

function InitiativeRow({ item, onChange, onRemove }) {
  return (
    <div className="bg-ctt-gray-50 rounded-xl p-4 space-y-3 border border-ctt-gray-100">
      <div className="flex gap-3">
        <Input label="Título" value={item.title} onChange={v => onChange({ ...item, title: v })} placeholder="Nome da iniciativa" className="flex-1" />
        <Select label="Prioridade" value={item.priority} onChange={v => onChange({ ...item, priority: v })} options={INITIATIVE_PRIORITY} className="w-40" />
        <button onClick={onRemove} className="mt-5 p-2 h-9 rounded-lg hover:bg-red-50 text-ctt-gray-400 hover:text-red-500 transition-colors self-end">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <Textarea label="Descrição" value={item.description} onChange={v => onChange({ ...item, description: v })} placeholder="O que se pretende alcançar..." rows={2} />
    </div>
  );
}

export function ProductDevSection({ devData = {}, fwdData = {}, onDevChange, onFwdChange, period }) {
  const features = devData.features || [];
  const initiatives = fwdData.initiatives || [];

  function addFeature() {
    onDevChange({ ...devData, features: [...features, { title: '', description: '', status: 'completed' }] });
  }
  function updateFeature(i, val) {
    const next = [...features]; next[i] = val;
    onDevChange({ ...devData, features: next });
  }
  function removeFeature(i) {
    onDevChange({ ...devData, features: features.filter((_, idx) => idx !== i) });
  }

  function addInitiative() {
    onFwdChange({ ...fwdData, initiatives: [...initiatives, { title: '', description: '', priority: 'medium' }] });
  }
  function updateInitiative(i, val) {
    const next = [...initiatives]; next[i] = val;
    onFwdChange({ ...fwdData, initiatives: next });
  }
  function removeInitiative(i) {
    onFwdChange({ ...fwdData, initiatives: initiatives.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-8">
      {/* Realizado */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ctt-gray-900">
            🎯 Realizado no período {period && <span className="text-ctt-gray-400 font-normal">— {period}</span>}
          </h3>
          <Button size="sm" variant="ghost" onClick={addFeature}>+ Feature</Button>
        </div>
        <div className="space-y-3">
          {features.map((f, i) => (
            <FeatureRow key={i} item={f} onChange={v => updateFeature(i, v)} onRemove={() => removeFeature(i)} />
          ))}
          {features.length === 0 && (
            <div className="text-center py-8 bg-ctt-gray-50 rounded-xl border border-dashed border-ctt-gray-200">
              <p className="text-xs text-ctt-gray-400">Nenhuma feature adicionada</p>
              <Button size="sm" variant="ghost" onClick={addFeature} className="mt-2">+ Adicionar feature</Button>
            </div>
          )}
        </div>
        <Textarea label="Riscos e bloqueadores" value={devData.blockers} onChange={v => onDevChange({ ...devData, blockers: v })} placeholder="Descreve os principais bloqueadores ou riscos identificados..." rows={2} className="mt-3" />
      </div>

      {/* Looking Forward */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ctt-gray-900">
            🔭 Looking Forward — próximo período
          </h3>
          <Button size="sm" variant="ghost" onClick={addInitiative}>+ Iniciativa</Button>
        </div>
        <div className="space-y-3">
          {initiatives.map((init, i) => (
            <InitiativeRow key={i} item={init} onChange={v => updateInitiative(i, v)} onRemove={() => removeInitiative(i)} />
          ))}
          {initiatives.length === 0 && (
            <div className="text-center py-8 bg-ctt-gray-50 rounded-xl border border-dashed border-ctt-gray-200">
              <p className="text-xs text-ctt-gray-400">Nenhuma iniciativa adicionada</p>
              <Button size="sm" variant="ghost" onClick={addInitiative} className="mt-2">+ Adicionar iniciativa</Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Input label="Próximo período" value={fwdData.nextPeriod} onChange={v => onFwdChange({ ...fwdData, nextPeriod: v })} placeholder="ex: 1T2025" />
        </div>
        <Textarea label="Riscos antecipados" value={fwdData.risks} onChange={v => onFwdChange({ ...fwdData, risks: v })} placeholder="Riscos ou dependências para o próximo período..." rows={2} className="mt-3" />
      </div>
    </div>
  );
}
