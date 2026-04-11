import React, { useState } from 'react'
import SkeletonLoader from './SkeletonLoader'

const parseContent = (text) => {
    if (!text) return []
    const parts = []
    const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g
    let lastIndex = 0, match
    while ((match = codeBlockRegex.exec(text)) !== null) {
        if (match.index > lastIndex)
            parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
        parts.push({ type: 'code', lang: match[1] || 'text', content: match[2].trim() })
        lastIndex = match.index + match[0].length
    }
    if (lastIndex < text.length)
        parts.push({ type: 'text', content: text.slice(lastIndex) })
    return parts
}

const AIPanel = ({ label, modelName, badgeText, badgeStyle, solution, isLoading, isWinner, accuracy, speed }) => {
    const [copied, setCopied] = useState(false)
    const parts = parseContent(solution)

    const handleCopy = async () => {
        if (!solution) return
        await navigator.clipboard.writeText(solution)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`flex flex-col rounded-lg border overflow-hidden ${isWinner ? 'border-[#7c3aed]/60' : 'border-white/6'
            } bg-[#131316]`}>
            {/* Panel Header */}
            <div className="px-4 pt-4 pb-3">
                <p className="text-[9px] font-black tracking-[0.25em] text-[#52525b] uppercase mb-1">{label}</p>
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-white tracking-tight">{modelName}</h3>
                    <div className="flex items-center gap-2">
                        {isWinner && (
                            <span className="text-[9px] font-black px-2 py-1 rounded bg-[#c8f135] text-black tracking-wider">
                                WINNER
                            </span>
                        )}
                        <span className={`text-[9px] font-bold px-2 py-1 rounded tracking-wider ${badgeStyle}`}>
                            {badgeText}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ maxHeight: '420px', minHeight: '180px' }}>
                {isLoading ? (
                    <SkeletonLoader />
                ) : solution ? (
                    <div className="space-y-4 animate-fade-up">
                        {parts.map((part, i) =>
                            part.type === 'code' ? (
                                <div key={i} className="rounded overflow-hidden border border-white/6 mt-3">
                                    <div className="flex items-center justify-between px-3 py-2 bg-[#0f0f12] border-b border-white/5">
                                        <span className="text-[10px] text-[#71717a] font-mono">
                                            {part.lang === 'javascript' ? 'server.js'
                                                : part.lang === 'python' ? 'handler.py'
                                                    : part.lang || 'code'}
                                        </span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(part.content)}
                                            className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-[#71717a] hover:text-[#c8f135] transition-colors"
                                        >
                                            <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                            </svg>
                                            COPY CODE
                                        </button>
                                    </div>
                                    <pre className="overflow-x-auto p-4 bg-[#0a0a0c] text-[12px] text-[#c8f135] font-mono leading-relaxed">
                                        <code>{part.content}</code>
                                    </pre>
                                </div>
                            ) : (
                                <p key={i} className="text-sm text-[#a1a1aa] leading-relaxed whitespace-pre-wrap">{part.content}</p>
                            )
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-36 gap-2 text-[#3f3f46]">
                        <span className="text-3xl">⚔</span>
                        <p className="text-xs tracking-wider">AWAITING BATTLE</p>
                    </div>
                )}
            </div>

            {/* Metrics */}
            {solution && !isLoading && accuracy !== undefined && speed !== undefined && (
                <div className="px-5 py-4 border-t border-white/5 space-y-4 bg-[#0d0d0f]">
                    {/* Accuracy */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-black tracking-widest text-[#71717a] uppercase">Accuracy</span>
                            <span className="text-[11px] font-black text-white">{accuracy}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-[#1a1a1e] overflow-hidden">
                            <div 
                                className="h-full rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${accuracy}%`, backgroundColor: isWinner ? '#c8f135' : '#7c3aed' }} 
                            />
                        </div>
                    </div>
                    {/* Speed */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-black tracking-widest text-[#71717a] uppercase">Speed</span>
                            <span className="text-[11px] font-black" style={{ color: isWinner ? '#c8f135' : '#7c3aed' }}>{speed}ms</span>
                        </div>
                        <div className="h-1 rounded-full bg-[#1a1a1e] overflow-hidden">
                            <div 
                                className="h-full rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${Math.min((speed / 800) * 100, 100)}%`, backgroundColor: isWinner ? '#c8f135' : '#7c3aed' }} 
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Copy solution footer */}
            {solution && !isLoading && (
                <div className="px-4 py-2 border-t border-white/5 flex justify-end">
                    <button onClick={handleCopy} className="text-[9px] font-bold tracking-widest text-[#52525b] hover:text-[#c8f135] transition-colors">
                        {copied ? '✓ COPIED' : '⎘ COPY FULL RESPONSE'}
                    </button>
                </div>
            )}
        </div>
    )
}



export default AIPanel

