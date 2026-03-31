import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { PRODUCT_GROUPS, PERIODS } from '../constants/products';

export function SessionSetup() {
  const navigate = useNavigate();
  const { createSession, loading } = useSession();
  const [form, setForm] = useState({
    name: '',
    period: '',
    audience: 'B2B',
    sessionDate: '',
    selectedProducts: []
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  function toggleProduct(id) {
    setForm(f => ({
      ...f,
      selectedProducts: f.selectedProducts.includes(id)
        ? f.selectedProducts.filter(p => p !== id)
        : [...f.selectedProducts, id]
    }));
  }

  function selectAllGroup(groupKey) {
    const ids = PRODUCT_GROUPS[groupKey].products.map(p => p.id);
    setForm(f => {
      const allSelected = ids.every(id => f.selectedProducts.includes(id));
      if (allSelected) {
        return { ...f, selectedProducts: f.selectedProducts.filter(id => !ids.includes(id)) };
      }
      const merged = [...new Set([...f.selectedProducts, ...ids])];
      return { ...f, selectedProducts: merged };
    });
  }

  const visibleGroups = form.audience === 'B2C'
    ? ['B2C']
    : form.audience === 'B2B'
    ? ['B2B']
    : ['B2C', 'B2B'];

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('[v0] handleSubmit called');
    console.log('[v0] form state:', form);
    if (!form.name || !form.period || form.selectedProducts.length === 0) {
      console.log('[v0] validation failed - name:', form.name, 'period:', form.period, 'products:', form.selectedProducts.length);
      return;
    }
    console.log('[v0] validation passed, creating session...');
    const session = await createSession({
      ...form,
      products: Object.fromEntries(form.selectedProducts.map(id => [id, { productId: id, status: 'draft' }]))
    });
    console.log('[v0] session created:', session);
    if (session) {
      console.log('[v0] navigating to:', `/session/${session.id}/product/${form.selectedProducts[0]}`);
      navigate(`/session/${session.id}/product/${form.selectedProducts[0]}`);
    }
  }

  return (
    <div className="flex-1 bg-ctt-gray-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-8">
          <div className="text-xs font-semibold text-ctt-gray-400 uppercase tracking-wide mb-1">Nova Sessão</div>
          <h1 className="text-3xl font-bold text-ctt-gray-900">Configurar sessão</h1>
          <p className="text-sm text-ctt-gray-500 mt-1">Define os parâmetros da sessão e seleciona os produtos a incluir.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-ctt-gray-100 shadow-card p-6 space-y-4">
            <h2 className="font-bold text-ctt-gray-900 text-sm uppercase tracking-wide">Informação da sessão</h2>
            <Input
              label="Nome da sessão"
              required
              value={form.name}
              onChange={v => update('name', v)}
              placeholder='ex: Digital 360 — Estado da Arte 1T2025'
            />
            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Período"
                required
                value={form.period}
                onChange={v => update('period', v)}
                options={PERIODS}
                placeholder="Selecionar..."
              />
              <Select
                label="Audiência"
                required
                value={form.audience}
                onChange={v => update('audience', v)}
                options={[
                  { value: 'B2C', label: 'B2C — Particulares' },
                  { value: 'B2B', label: 'B2B — Empresas' },
                  { value: 'Ambos', label: 'Ambos' }
                ]}
              />
              <Input label="Data da sessão" type="date" value={form.sessionDate} onChange={v => update('sessionDate', v)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-ctt-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ctt-gray-900 text-sm uppercase tracking-wide">Produtos a incluir</h2>
              <span className="text-xs text-ctt-gray-400">{form.selectedProducts.length} selecionados</span>
            </div>

            <div className="space-y-6">
              {visibleGroups.map(groupKey => {
                const group = PRODUCT_GROUPS[groupKey];
                const groupIds = group.products.map(p => p.id);
                const allSelected = groupIds.every(id => form.selectedProducts.includes(id));
                const someSelected = groupIds.some(id => form.selectedProducts.includes(id));

                return (
                  <div key={groupKey}>
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        type="button"
                        onClick={() => selectAllGroup(groupKey)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          allSelected ? 'bg-ctt-red border-ctt-red' : someSelected ? 'bg-ctt-red/30 border-ctt-red' : 'border-ctt-gray-300'
                        }`}
                      >
                        {(allSelected || someSelected) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d={allSelected ? 'M1 4l3 3 5-6' : 'M1 4h8'} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: group.color }}>
                        {group.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-7">
                      {group.products.map(product => {
                        const selected = form.selectedProducts.includes(product.id);
                        return (
                          <label key={product.id} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-150 ${
                            selected ? 'bg-red-50 border-ctt-red/30' : 'border-ctt-gray-100 hover:bg-ctt-gray-50'
                          }`}>
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleProduct(product.id)}
                              className="mt-0.5 accent-ctt-red"
                            />
                            <div>
                              <div className={`text-xs font-semibold leading-tight ${selected ? 'text-ctt-red' : 'text-ctt-gray-700'}`}>{product.name}</div>
                              <div className="text-xs text-ctt-gray-400 mt-0.5">{product.owner}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="secondary" type="button" onClick={() => navigate('/')}>Cancelar</Button>
            <Button
              type="submit"
              disabled={!form.name || !form.period || form.selectedProducts.length === 0 || loading}
            >
              {loading ? 'A criar...' : `Criar sessão com ${form.selectedProducts.length} produto${form.selectedProducts.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
