import React from 'react'

const ChatHistory = ({ history, onSelect, currentIndex }) => {
    if (!history || history.length === 0) {
        return (
            <aside className="hidden md:flex w-64 shrink-0 flex-col bg-[#0b0b0d] border-r border-white/5 p-4 gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#52525b] mb-1">Session History</p>
                <div className="flex flex-col items-center justify-center flex-1 gap-3 text-[#52525b] opacity-60">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[10px] font-bold tracking-wider text-center">NO RECENT BATTLES</p>
                </div>
            </aside>
        )
    }

    return (
        <aside className="hidden md:flex w-64 shrink-0 flex-col bg-[#0b0b0d] border-r border-white/5 p-4 gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#52525b] mb-2">Session History</p>
            <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-1">
                {history.map((item, i) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(i)}
                        className={`
                            text-left px-3.5 py-3 rounded-lg text-xs leading-snug transition-all duration-200 border
                            ${i === currentIndex
                                ? 'bg-[#1a1a1e] text-white border-white/10 shadow-sm'
                                : 'bg-transparent text-[#71717a] border-transparent hover:bg-white/5 hover:text-[#a1a1aa]'
                            }
                        `}
                    >
                        <span className="block font-medium truncate mb-1">{item.prompt}</span>
                        <span className="block text-[9px] font-bold tracking-widest opacity-60">{item.timestamp}</span>
                    </button>
                ))}
            </div>
        </aside>
    )
}

export default ChatHistory
