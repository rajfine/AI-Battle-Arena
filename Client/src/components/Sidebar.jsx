import React from 'react'

const navItems = [
    {
        icon: (
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
        ),
        label: 'BATTLE HISTORY',
        active: true,
    },
    {
        icon: (
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
            </svg>
        ),
        label: 'LEADERBOARDS',
        active: false,
    },
    {
        icon: (
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
        ),
        label: 'MODEL FORGE',
        active: false,
    },
    {
        icon: (
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
        ),
        label: 'NEURAL ARCHIVES',
        active: false,
    },
]

const Sidebar = ({ onNewBattle, isHistoryOpen, onToggleHistory }) => (
    <aside className="w-[180px] shrink-0 flex flex-col bg-[#0f0f12] border-r border-white/5 h-full">
        {/* User card */}
        <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1a1a1e] border border-white/10 flex items-center justify-center text-[#c8f135]">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <p className="text-[11px] font-black tracking-wider text-white">COMMANDER</p>
                    <p className="text-[9px] text-[#71717a] tracking-wider mt-0.5">RANK #42 · PLATINUM</p>
                </div>
            </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 p-2 flex-1">
            {navItems.map(({ icon, label, ...item }) => {
                const active = label === 'BATTLE HISTORY' ? isHistoryOpen : item.active;
                return (
                <button
                    key={label}
                    onClick={() => {
                        if (label === 'BATTLE HISTORY' && onToggleHistory) {
                            onToggleHistory();
                        }
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-left w-full transition-all duration-150 group ${active
                            ? 'bg-[#c8f135] text-black'
                            : 'text-[#71717a] hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <span className={active ? 'text-black' : 'text-[#52525b] group-hover:text-white'}>
                        {icon}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider">{label}</span>
                </button>
            )})}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/5 space-y-2">
            <button
                onClick={onNewBattle}
                className="w-full py-2.5 rounded border border-[#c8f135] text-[#c8f135] text-[10px] font-black tracking-widest hover:bg-[#c8f135] hover:text-black transition-all duration-200"
            >
                NEW BATTLE
            </button>
            <button className="flex items-center gap-2 px-2 py-1.5 w-full text-[#52525b] hover:text-white text-[9px] font-bold tracking-wider transition-colors">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                SYSTEM STATUS
            </button>
            <button className="flex items-center gap-2 px-2 py-1.5 w-full text-[#52525b] hover:text-white text-[9px] font-bold tracking-wider transition-colors">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                LOGOUT
            </button>
        </div>
    </aside>
)

export default Sidebar
