const SESSION_STATUS = {
  draft:      { label: 'Rascunho',    bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400' },
  in_review:  { label: 'Em Revisão',  bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-400' },
  ready:      { label: 'Pronto',      bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
  presented:  { label: 'Apresentado', bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-500' },
};

const PRODUCT_STATUS = {
  draft:      { label: 'Rascunho',   bg: 'bg-gray-100',   text: 'text-gray-600' },
  submitted:  { label: 'Submetido',  bg: 'bg-emerald-50', text: 'text-emerald-700' },
  approved:   { label: 'Aprovado',   bg: 'bg-blue-50',    text: 'text-blue-700' },
};

export function SessionBadge({ status }) {
  const cfg = SESSION_STATUS[status] || SESSION_STATUS.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function ProductBadge({ status }) {
  const cfg = PRODUCT_STATUS[status] || PRODUCT_STATUS.draft;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

export function AudienceBadge({ audience }) {
  const map = {
    B2C: 'bg-blue-50 text-blue-700',
    B2B: 'bg-red-50 text-ctt-red',
    Ambos: 'bg-purple-50 text-purple-700'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${map[audience] || 'bg-gray-100 text-gray-600'}`}>
      {audience}
    </span>
  );
}
