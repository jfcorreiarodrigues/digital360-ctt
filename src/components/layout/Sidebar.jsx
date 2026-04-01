import { Link } from 'react-router-dom';
import { getProductById } from '../../constants/products';
import { ProgressBar } from '../presentation/ProgressBar';
import { calcCompleteness } from '../../hooks/useSession';
import { ProductBadge } from '../ui/Badge';

export function Sidebar({ session, currentProductId, isOpen = false, onClose }) {
  const products = Object.keys(session?.products || {});
  const selectedProducts = session?.selectedProducts || products;

  const content = (
    <aside className="w-64 flex-none bg-white border-r border-ctt-gray-100 flex flex-col overflow-y-auto h-full">
      <div className="p-4 border-b border-ctt-gray-100 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-ctt-gray-400 mb-1">Sessão</div>
          <div className="font-semibold text-ctt-gray-900 text-sm leading-snug">{session?.name}</div>
          <div className="text-xs text-ctt-gray-400 mt-0.5">{session?.period} · {session?.audience}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden flex-none text-ctt-gray-400 hover:text-ctt-gray-700 transition-colors mt-0.5" aria-label="Fechar menu">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <div className="text-xs font-medium text-ctt-gray-400 px-1 mb-2">
          Produtos ({selectedProducts.length})
        </div>
        <nav className="flex flex-col gap-1">
          {selectedProducts.map(pid => {
            const product = getProductById(pid);
            const productData = session?.products?.[pid];
            const completeness = calcCompleteness(productData);
            const isActive = pid === currentProductId;

            return (
              <Link
                key={pid}
                to={`/session/${session.id}/product/${pid}`}
                onClick={onClose}
                className={`group rounded-lg p-2.5 transition-all duration-150 ${
                  isActive
                    ? 'bg-red-50 border border-ctt-red/20'
                    : 'hover:bg-ctt-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <span className={`text-xs font-medium leading-tight ${isActive ? 'text-ctt-red' : 'text-ctt-gray-700'}`}>
                    {product?.name || pid}
                  </span>
                  {productData?.status && (
                    <ProductBadge status={productData.status} />
                  )}
                </div>
                <ProgressBar value={completeness} size="sm" showLabel={false} />
                <div className="text-right text-[10px] text-ctt-gray-400 mt-0.5">{completeness}%</div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-ctt-gray-100">
        <Link
          to={`/session/${session?.id}/review`}
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-ctt-gray-50 hover:bg-ctt-gray-100 rounded text-xs font-medium text-ctt-gray-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M13 7H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Ver Revisão
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden md:flex">{content}</div>

      {/* Mobile: slide-in overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="relative z-50 flex">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
