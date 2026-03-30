import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession, calcCompleteness } from '../hooks/useSession';
import { getProductById } from '../constants/products';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Button } from '../components/ui/Button';
import { NorthStarSection, RevenueSection } from '../components/forms/KPIRevenueSection';
import { TrafficUsersSection } from '../components/forms/TrafficUsersSection';
import { ProductDevSection } from '../components/forms/ProductDevSection';
import { MarketingSection } from '../components/forms/MarketingSection';

const TABS = [
  { id: 'northstar', label: '🎯 North Star', key: 'northStar' },
  { id: 'revenue', label: '💰 Receita', key: 'revenue' },
  { id: 'traffic', label: '👥 Tráfego', key: 'traffic' },
  { id: 'product', label: '🚀 Produto', key: 'productDev' },
  { id: 'marketing', label: '📢 Marketing', key: 'marketing' },
];

export function ProductForm() {
  const { sessionId, productId } = useParams();
  const navigate = useNavigate();
  const { fetchSession, saveProductData, updateProductStatus, loading } = useSession();

  const [session, setSession] = useState(null);
  const [productData, setProductData] = useState({});
  const [activeTab, setActiveTab] = useState('northstar');
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [isSaving, setIsSaving] = useState(false);
  const saveTimer = useRef(null);
  const pendingSave = useRef(false);

  useEffect(() => {
    fetchSession(sessionId).then(s => {
      if (s) {
        setSession(s);
        setProductData(s.products?.[productId] || { productId, status: 'draft' });
      }
    });
  }, [sessionId, productId]);

  const save = useCallback(async (data) => {
    if (isSaving) { pendingSave.current = true; return; }
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      await saveProductData(sessionId, productId, data);
      setSaveStatus('saved');
      // Update local session state
      setSession(prev => prev ? {
        ...prev,
        products: { ...prev.products, [productId]: { ...prev.products?.[productId], ...data } }
      } : prev);
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      if (pendingSave.current) {
        pendingSave.current = false;
        save(data);
      }
    }
  }, [sessionId, productId, isSaving]);

  function handleChange(key, val) {
    const updated = { ...productData, [key]: val };
    setProductData(updated);
    setSaveStatus('idle');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(updated), 2000);
  }

  async function handleManualSave() {
    clearTimeout(saveTimer.current);
    await save(productData);
  }

  async function handleSubmit() {
    await handleManualSave();
    await updateProductStatus(sessionId, productId, 'submitted');
    setProductData(prev => ({ ...prev, status: 'submitted' }));
    setSession(prev => prev ? {
      ...prev,
      products: { ...prev.products, [productId]: { ...prev.products?.[productId], status: 'submitted' } }
    } : prev);
  }

  const product = getProductById(productId);
  const completeness = calcCompleteness(productData);
  const isSubmitted = productData.status === 'submitted';

  const tabCompleted = (tab) => {
    switch (tab.id) {
      case 'northstar': return !!(productData.northStar?.currentValue && productData.northStar?.executiveHighlight);
      case 'revenue': return !!productData.revenue?.total;
      case 'traffic': return !!productData.traffic?.totalSessions;
      case 'product': return !!(productData.productDev?.features?.length);
      case 'marketing': return !!productData.marketing?.highlights;
      default: return false;
    }
  };

  if (!session) return (
    <div className="flex-1 flex items-center justify-center bg-ctt-gray-50">
      <div className="text-ctt-gray-400 text-sm">A carregar...</div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header session={session} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar session={session} currentProductId={productId} />

        <main className="flex-1 flex flex-col overflow-hidden bg-ctt-gray-50">
          {/* Product header */}
          <div className="bg-white border-b border-ctt-gray-100 px-8 py-4 flex-none">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-ctt-gray-900">{product?.name || productId}</h2>
                <div className="text-xs text-ctt-gray-400">{product?.owner} · {completeness}% completo</div>
              </div>
              <div className="flex items-center gap-3">
                {/* Save status */}
                <div className="text-xs text-ctt-gray-400">
                  {saveStatus === 'saving' && <span className="text-amber-500">💾 A guardar...</span>}
                  {saveStatus === 'saved' && <span className="text-emerald-600">✓ Guardado</span>}
                  {saveStatus === 'error' && <span className="text-red-500">⚠ Erro ao guardar</span>}
                </div>
                <Button size="sm" variant="secondary" onClick={handleManualSave} disabled={isSaving}>
                  Guardar
                </Button>
                {!isSubmitted ? (
                  <Button size="sm" variant="success" onClick={handleSubmit}>
                    ✓ Marcar como submetido
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => updateProductStatus(sessionId, productId, 'draft').then(() => setProductData(p => ({ ...p, status: 'draft' })))}>
                    Voltar a rascunho
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    activeTab === tab.id
                      ? 'bg-ctt-red text-white shadow-sm'
                      : 'text-ctt-gray-600 hover:bg-ctt-gray-100'
                  }`}
                >
                  {tab.label}
                  {tabCompleted(tab) && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-3xl">
              {activeTab === 'northstar' && (
                <NorthStarSection
                  data={productData.northStar || { metric: product?.northStarMetric }}
                  onChange={v => handleChange('northStar', v)}
                />
              )}
              {activeTab === 'revenue' && (
                <RevenueSection
                  data={productData.revenue}
                  onChange={v => handleChange('revenue', v)}
                  productMeta={product}
                />
              )}
              {activeTab === 'traffic' && (
                <TrafficUsersSection
                  data={productData.traffic}
                  onChange={v => handleChange('traffic', v)}
                />
              )}
              {activeTab === 'product' && (
                <ProductDevSection
                  devData={productData.productDev}
                  fwdData={productData.lookingForward}
                  onDevChange={v => handleChange('productDev', v)}
                  onFwdChange={v => handleChange('lookingForward', v)}
                  period={session.period}
                />
              )}
              {activeTab === 'marketing' && (
                <MarketingSection
                  data={productData.marketing}
                  onChange={v => handleChange('marketing', v)}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
