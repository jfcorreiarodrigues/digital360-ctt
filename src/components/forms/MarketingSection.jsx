import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';

const CAMPAIGN_TYPES = [
  { value: 'email', label: '📧 Email' },
  { value: 'google', label: '🔍 Google' },
  { value: 'meta', label: '📘 Meta' },
  { value: 'organic', label: '🌿 Orgânico' },
  { value: 'event', label: '🎪 Evento' },
  { value: 'other', label: '🔧 Outro' },
];

const CAMPAIGN_STATUS = [
  { value: 'completed', label: 'Concluída' },
  { value: 'ongoing', label: 'Em curso' },
  { value: 'planned', label: 'Planeada' },
];

function CampaignRow({ campaign, onChange, onRemove }) {
  return (
    <div className="bg-ctt-gray-50 rounded-xl p-4 border border-ctt-gray-100">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Input label="Nome da campanha" value={campaign.name} onChange={v => onChange({ ...campaign, name: v })} placeholder="ex: Black Friday B2B" />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Tipo" value={campaign.type} onChange={v => onChange({ ...campaign, type: v })} options={CAMPAIGN_TYPES} placeholder="Tipo..." />
          <Select label="Status" value={campaign.status} onChange={v => onChange({ ...campaign, status: v })} options={CAMPAIGN_STATUS} placeholder="Status..." />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Data / Período" value={campaign.date} onChange={v => onChange({ ...campaign, date: v })} placeholder="ex: Nov 2024" />
        <div className="flex gap-2 items-end">
          <Input label="Resultado" value={campaign.result} onChange={v => onChange({ ...campaign, result: v })} placeholder="ex: +22% CTR vs target" className="flex-1" />
          <button onClick={onRemove} className="mb-0.5 p-2 rounded-lg hover:bg-red-50 text-ctt-gray-400 hover:text-red-500 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function ListItem({ item, onChange, onRemove, fields }) {
  return (
    <div className="flex gap-3 items-end">
      {fields.map(f => (
        <Input key={f.key} label={f.label} value={item[f.key]} onChange={v => onChange({ ...item, [f.key]: v })} placeholder={f.placeholder} className={f.flex ? 'flex-1' : 'w-40'} />
      ))}
      <button onClick={onRemove} className="mb-0.5 p-2 rounded-lg hover:bg-red-50 text-ctt-gray-400 hover:text-red-500 transition-colors">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

export function MarketingSection({ data = {}, onChange }) {
  const update = (key, val) => onChange({ ...data, [key]: val });
  const campaigns = data.campaigns || [];
  const automations = data.automations || [];
  const events = data.events || [];

  function addCampaign() {
    onChange({ ...data, campaigns: [...campaigns, { name: '', type: '', date: '', result: '', status: 'completed' }] });
  }
  function updateCampaign(i, val) { const n = [...campaigns]; n[i] = val; onChange({ ...data, campaigns: n }); }
  function removeCampaign(i) { onChange({ ...data, campaigns: campaigns.filter((_, idx) => idx !== i) }); }

  function addAutomation() {
    onChange({ ...data, automations: [...automations, { title: '', description: '', status: 'active' }] });
  }
  function updateAutomation(i, val) { const n = [...automations]; n[i] = val; onChange({ ...data, automations: n }); }
  function removeAutomation(i) { onChange({ ...data, automations: automations.filter((_, idx) => idx !== i) }); }

  function addEvent() {
    onChange({ ...data, events: [...events, { event: '', date: '', result: '' }] });
  }
  function updateEvent(i, val) { const n = [...events]; n[i] = val; onChange({ ...data, events: n }); }
  function removeEvent(i) { onChange({ ...data, events: events.filter((_, idx) => idx !== i) }); }

  return (
    <div className="space-y-6">
      {/* Google Always On */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h3 className="text-sm font-bold text-ctt-gray-900 mb-3">Google Always On</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Investimento (€)" value={data.googleAlwaysOnInvestment} onChange={v => update('googleAlwaysOnInvestment', v)} placeholder="ex: 180 000" />
          <Input label="% do total" value={data.googleAlwaysOnPercentOfTotal} onChange={v => update('googleAlwaysOnPercentOfTotal', v)} placeholder="ex: 62" />
        </div>
      </div>

      {/* Conversion metrics */}
      <div>
        <h3 className="text-sm font-bold text-ctt-gray-900 mb-3">Métricas de conversão</h3>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Nº Leads" value={data.leads} onChange={v => update('leads', v)} placeholder="ex: 1 240" />
          <Input label="Taxa de conversão" value={data.conversionRate} onChange={v => update('conversionRate', v)} placeholder="ex: 4.2%" />
          <Input label="Contratos / Vendas fechados" value={data.closedDeals} onChange={v => update('closedDeals', v)} placeholder="ex: 52" />
        </div>
      </div>

      {/* Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ctt-gray-900">Campanhas & atividades</h3>
          <Button size="sm" variant="ghost" onClick={addCampaign}>+ Campanha</Button>
        </div>
        <div className="space-y-3">
          {campaigns.map((c, i) => (
            <CampaignRow key={i} campaign={c} onChange={v => updateCampaign(i, v)} onRemove={() => removeCampaign(i)} />
          ))}
        </div>
      </div>

      {/* Automations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ctt-gray-900">Automações de marketing</h3>
          <Button size="sm" variant="ghost" onClick={addAutomation}>+ Automação</Button>
        </div>
        <div className="space-y-2">
          {automations.map((a, i) => (
            <ListItem key={i} item={a} onChange={v => updateAutomation(i, v)} onRemove={() => removeAutomation(i)}
              fields={[
                { key: 'title', label: 'Título', placeholder: 'Nome da automação', flex: true },
                { key: 'status', label: 'Status', placeholder: 'ex: Ativa' }
              ]} />
          ))}
        </div>
      </div>

      {/* Events */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ctt-gray-900">Eventos</h3>
          <Button size="sm" variant="ghost" onClick={addEvent}>+ Evento</Button>
        </div>
        <div className="space-y-2">
          {events.map((e, i) => (
            <ListItem key={i} item={e} onChange={v => updateEvent(i, v)} onRemove={() => removeEvent(i)}
              fields={[
                { key: 'event', label: 'Evento', placeholder: 'Nome do evento', flex: true },
                { key: 'date', label: 'Data', placeholder: 'ex: Mar 2024' },
                { key: 'result', label: 'Resultado', placeholder: 'Resultado', flex: true }
              ]} />
          ))}
        </div>
      </div>

      <Textarea label="Highlights de marketing" value={data.highlights} onChange={v => update('highlights', v)} placeholder="Resumo executivo das principais ações e resultados de marketing..." rows={3} />
      <Textarea label="Looking Forward — Marketing" value={data.lookingForwardMarketing} onChange={v => update('lookingForwardMarketing', v)} placeholder="Próximas ações e campanhas planeadas..." rows={2} />
    </div>
  );
}
