import React, { useState } from 'react'
import SkeletonLoader from './SkeletonLoader'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const AIPanel = ({ label, modelName, badgeText, badgeStyle, solution, isLoading, isWinner, accuracy, speed }) => {
    const [copied, setCopied] = useState(false)

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
                {isLoading && !solution ? (
                    <SkeletonLoader />
                ) : solution ? (
                    <div className="space-y-4 animate-fade-up text-sm text-[#a1a1aa] leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({node, inline, className, children, ...props}) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <div className="rounded overflow-hidden border border-white/6 mt-3 mb-3">
                                            <div className="flex items-center justify-between px-3 py-2 bg-[#0f0f12] border-b border-white/5">
                                                <span className="text-[10px] text-[#71717a] font-mono">
                                                    {match[1]}
                                                </span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                                    className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-[#71717a] hover:text-[#c8f135] transition-colors"
                                                >
                                                    <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                                    </svg>
                                                    COPY CODE
                                                </button>
                                            </div>
                                            <SyntaxHighlighter
                                                {...props}
                                                children={String(children).replace(/\n$/, '')}
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                customStyle={{
                                                    margin: 0,
                                                    padding: '1rem',
                                                    background: '#0a0a0c',
                                                    fontSize: '12px',
                                                    color: '#c8f135' // To keep the user's custom color or use syntax highlighting
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <code {...props} className={"bg-white/10 px-1 py-0.5 rounded text-[#e2e8f0] " + className}>
                                            {children}
                                        </code>
                                    )
                                },
                                p: ({node, ...props}) => <p className="mb-3" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                                a: ({node, ...props}) => <a className="text-[#c8f135] hover:underline" {...props} />,
                                h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mb-3 mt-4" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-lg font-bold text-white mb-2 mt-4" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-md font-bold text-white mb-2 mt-3" {...props} />,
                            }}
                        >
                            {solution}
                        </ReactMarkdown>
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

