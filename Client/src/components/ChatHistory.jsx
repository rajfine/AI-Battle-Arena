import React from 'react'

const ChatHistory = ({ history, onSelect, currentIndex }) => {
    if (!history || history.length === 0) {
        return (
            <aside className="hidden md:flex w-56 shrink-0 flex-col bg-[#0e0e10] border-r border-white/5 p-4 gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[#978d9e] mb-1">History</p>
                <div className="flex flex-col items-center justify-center flex-1 gap-2 text-[#978d9e]">
                    <span className="text-2xl">📜</span>
                    <p className="text-xs text-center">No battles yet</p>
                </div>
            </aside>
        )
    }

    return (
        <aside className="hidden md:flex w-56 shrink-0 flex-col bg-[#0e0e10] border-r border-white/5 p-4 gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#978d9e] mb-1">History</p>
            <div className="flex flex-col gap-1 overflow-y-auto flex-1">
                {history.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(i)}
                        className={`
              text-left px-3 py-2.5 rounded-xl text-xs leading-snug transition-all duration-150
              ${i === currentIndex
                                ? 'bg-[#2a2a2c] text-[#e5e1e4] border-l-2 border-[#9b5de5]'
                                : 'text-[#978d9e] hover:bg-[#1b1b1d] hover:text-[#cec2d5]'
                            }
            `}
                    >
                        <span className="block font-medium truncate">{item.prompt}</span>
                        <span className="block text-[10px] mt-0.5 opacity-60">{item.timestamp}</span>
                    </button>
                ))}
            </div>
        </aside>
    )
}

export default ChatHistory
