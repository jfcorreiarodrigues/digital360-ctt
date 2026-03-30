export function SlideCard({ children, type = 'content', productName = '', sessionName = '', slideNum = 0 }) {
  if (type === 'cover') {
    return (
      <div className="w-full h-full flex bg-white">
        <div className="w-1/2 bg-ctt-red flex flex-col justify-center px-16">
          <div className="text-white/60 text-sm uppercase tracking-widest mb-4">Estado da Arte</div>
          <div className="text-white font-bold text-7xl leading-none">DIGITAL</div>
          <div className="text-white font-bold text-9xl leading-none">360</div>
          <div className="text-white/50 font-bold text-4xl mt-2">CTT</div>
        </div>
        <div className="w-1/2 flex flex-col justify-center px-16">
          {children}
        </div>
      </div>
    );
  }

  if (type === 'separator') {
    return (
      <div className="w-full h-full bg-ctt-red flex flex-col items-center justify-center">
        {children}
      </div>
    );
  }

  if (type === 'closing') {
    return (
      <div className="w-full h-full bg-ctt-red flex flex-col items-center justify-center gap-6">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header bar */}
      <div className="h-1.5 bg-ctt-red flex-none" />
      {/* Slide header */}
      <div className="flex items-center justify-between px-10 py-4 border-b border-ctt-gray-100 flex-none">
        <span className="text-sm text-ctt-gray-400 font-medium">{productName}</span>
        <div className="bg-ctt-red text-white font-black text-xl px-3 py-1 rounded">CTT</div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-hidden px-10 py-6">
        {children}
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between px-10 py-3 border-t border-ctt-gray-100 flex-none">
        <span className="text-xs text-ctt-gray-400">{sessionName}</span>
        <span className="text-xs text-ctt-gray-400">{slideNum}</span>
      </div>
    </div>
  );
}
