export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', className = '', icon }) {
  const base = 'inline-flex items-center gap-2 font-medium rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-ctt-red text-white hover:bg-ctt-red-dark focus:ring-ctt-red disabled:opacity-50',
    secondary: 'bg-white text-ctt-gray-900 border border-ctt-gray-200 hover:bg-ctt-gray-50 focus:ring-ctt-gray-300',
    ghost: 'bg-transparent text-ctt-gray-600 hover:bg-ctt-gray-100 focus:ring-ctt-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
}
