export function Input({ label, value, onChange, placeholder, type = 'text', required, className = '', hint, error }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-ctt-gray-600">
          {label}{required && <span className="text-ctt-red ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-white text-ctt-gray-900 placeholder-ctt-gray-400
          focus:outline-none focus:ring-2 focus:ring-ctt-gray-400 focus:border-transparent
          transition-all duration-150
          ${error ? 'border-red-400' : 'border-ctt-gray-200'}`}
      />
      {hint && <p className="text-xs text-ctt-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Textarea({ label, value, onChange, placeholder, required, className = '', rows = 3, hint }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-ctt-gray-600">
          {label}{required && <span className="text-ctt-red ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value || ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-3 py-2 text-sm border border-ctt-gray-200 rounded-lg bg-white text-ctt-gray-900 placeholder-ctt-gray-400
          focus:outline-none focus:ring-2 focus:ring-ctt-gray-400 focus:border-transparent
          transition-all duration-150 resize-y"
      />
      {hint && <p className="text-xs text-ctt-gray-400">{hint}</p>}
    </div>
  );
}

export function Select({ label, value, onChange, options, required, className = '', placeholder }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-ctt-gray-600">
          {label}{required && <span className="text-ctt-red ml-1">*</span>}
        </label>
      )}
      <select
        value={value || ''}
        onChange={e => onChange?.(e.target.value)}
        required={required}
        className="w-full px-3 py-2 text-sm border border-ctt-gray-200 rounded-lg bg-white text-ctt-gray-900
          focus:outline-none focus:ring-2 focus:ring-ctt-gray-400 focus:border-transparent
          transition-all duration-150 cursor-pointer"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          typeof opt === 'string'
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
