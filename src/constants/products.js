export const PRODUCT_GROUPS = {
  B2C: {
    label: "B2C — Particulares",
    color: "#0066CC",
    products: [
      { id: "site_b2c", name: "Site CTT + Inbound Mkt B2C", owner: "Digital Experience", northStarMetric: "Views", revenueBreakdown: ["Receita Total"] },
      { id: "app_ctt", name: "App CTT", owner: "Digital Experience", northStarMetric: "DAU (Daily Active Users)", revenueBreakdown: ["Receita Total"] },
      { id: "envios_online", name: "Envios Online / Pack Expresso", owner: "CTT Expresso Digital", northStarMetric: "Nº Envios", revenueBreakdown: ["Vendas (€)", "Nº Vendas"] },
      { id: "loja_online_b2c", name: "Loja Online (B2C)", owner: "E-Commerce", northStarMetric: "Receita", revenueBreakdown: ["Receita Total"] },
      { id: "portagens", name: "Portagens", owner: "Serviços Digitais", northStarMetric: "Taxa de Sucesso de Cobrança", revenueBreakdown: ["Receita Total"] },
      { id: "seguros_saude", name: "Seguros / Planos de Saúde / Dívida Pública", owner: "Serviços Financeiros", northStarMetric: "Receita", revenueBreakdown: ["Seguros", "Planos de Saúde", "Dívida Pública"] },
      { id: "portal_desalfandegamento", name: "Portal Desalfandegamento", owner: "Serviços Digitais", northStarMetric: "Tráfego", revenueBreakdown: ["Receita Total"] },
      { id: "viactt_b2c", name: "ViaCTT (B2C)", owner: "ViaCTT", northStarMetric: "Nº Associações", revenueBreakdown: ["Volume (M#)", "Receita (M€)"] },
      { id: "pontos_lojas", name: "Pontos e Lojas", owner: "Rede Física Digital", northStarMetric: "Tráfego", revenueBreakdown: ["Receita Total"] }
    ]
  },
  B2B: {
    label: "B2B — Empresas",
    color: "#DF0024",
    products: [
      { id: "site_b2b", name: "Site CTT B2B + Conta CTT + Inbound Mkt B2B", owner: "Digital Experience", northStarMetric: "Registos B2B + Users B2B", revenueBreakdown: ["Receita Total"] },
      { id: "portal_expresso", name: "Portal CTT Expresso", owner: "CTT Expresso Digital", northStarMetric: "Receita Total", revenueBreakdown: ["CS", "AP", "SP", "CN", "PT", "WS", "PLG"] },
      { id: "super_portal", name: "Super Portal Empresas", owner: "CTT Expresso Digital", northStarMetric: "Contratos Concluídos", revenueBreakdown: ["Receita Total Portal", "Portal Expresso", "Plugins"] },
      { id: "plugins_shiptimize", name: "Portal Plugins Shiptimize", owner: "CTT Expresso Digital", northStarMetric: "Nº Envios", revenueBreakdown: ["Receita Total", "Lojas Online", "WooCommerce", "Shopify", "PrestaShop"] },
      { id: "ctt_now", name: "CTT Now B2B", owner: "CTT Now", northStarMetric: "Receita", revenueBreakdown: ["B2B", "C2C"] },
      { id: "ctt_logistica", name: "CTT Logística", owner: "CTT Logística", northStarMetric: "Receita Total", revenueBreakdown: ["Receita Total", "Portal (100%)", "Portal (Suporte)"] },
      { id: "criar_lojas_online", name: "Criar Lojas Online (CLO)", owner: "E-Commerce", northStarMetric: "Nº Lojas Publicadas Ativas", revenueBreakdown: ["Receita Total", "Planos (€)", "Envios (€)", "Outras Receitas (€)"] },
      { id: "pop", name: "POP — Payshop Online Payments", owner: "Serviços de Pagamento", northStarMetric: "Nº Transações", revenueBreakdown: ["Nº Transações (k)", "Ticket Médio (€)", "Nº Clientes"] },
      { id: "area_cliente_correio", name: "Área de Cliente Correio", owner: "Correio Digital", northStarMetric: "Receita Contratual", revenueBreakdown: ["Guias Web", "API", "Área de Cliente", "Guias Manuais"] },
      { id: "ecarta", name: "E-Carta", owner: "Correio Digital", northStarMetric: "Receita", revenueBreakdown: ["Receita Total"] },
      { id: "viactt_b2b", name: "ViaCTT (B2B)", owner: "ViaCTT", northStarMetric: "Nº Entidades Emissoras", revenueBreakdown: ["Volume", "Receita"] },
      { id: "ctt_ads", name: "CTT Ads + Media Digital", owner: "Media Digital", northStarMetric: "Receita Campanhas", revenueBreakdown: ["Receita Total"] }
    ]
  }
};

export const ALL_PRODUCTS = [
  ...PRODUCT_GROUPS.B2C.products,
  ...PRODUCT_GROUPS.B2B.products
];

export function getProductById(id) {
  return ALL_PRODUCTS.find(p => p.id === id);
}

export function getProductGroup(id) {
  if (PRODUCT_GROUPS.B2C.products.some(p => p.id === id)) return 'B2C';
  if (PRODUCT_GROUPS.B2B.products.some(p => p.id === id)) return 'B2B';
  return null;
}

export const PERIODS = [
  '1T2024', '2T2024', '3T2024', '4T2024',
  '1T2025', '2T2025', '3T2025', '4T2025',
  '1T2026', '2T2026', '3T2026', '4T2026',
  'Overall 2024', 'Overall 2025', 'Overall 2026'
];

export const STATUS_LABELS = {
  draft: 'Rascunho',
  in_review: 'Em Revisão',
  ready: 'Pronto',
  presented: 'Apresentado'
};

export const PRODUCT_STATUS_LABELS = {
  draft: 'Rascunho',
  submitted: 'Submetido',
  approved: 'Aprovado'
};
