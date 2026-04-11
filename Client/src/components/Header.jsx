import React from 'react'

const Header = () => (
    <header className="flex items-center justify-between px-6 h-14 border-b border-white/5 bg-[#0b0b0d] shrink-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#c8f135] flex items-center justify-center">
                <span className="text-black text-xs font-black">AI</span>
            </div>
            <span className="text-sm font-black tracking-[0.15em] text-white uppercase">AI Battle Arena</span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-8">
            {[
                { label: 'ARENA', active: true },
                { label: 'MODELS', active: false },
                { label: 'VAULT', active: false },
            ].map(({ label, active }) => (
                <button
                    key={label}
                    className={`text-xs font-bold tracking-widest transition-colors relative pb-1 ${active ? 'text-[#c8f135]' : 'text-[#71717a] hover:text-white'
                        }`}
                >
                    {label}
                    {active && (
                        <span className="absolute bottom-0 left-0 right-0 h-px bg-[#c8f135]" />
                    )}
                </button>
            ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center text-[#71717a] hover:text-white transition-colors">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-[#71717a] hover:text-white transition-colors">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
            </button>
            <button className="px-4 h-7 rounded text-[10px] font-black tracking-widest bg-[#c8f135] text-black hover:bg-[#d4f53c] transition-colors">
                LIVE SESSION
            </button>
        </div>
    </header>
)

export default Header
