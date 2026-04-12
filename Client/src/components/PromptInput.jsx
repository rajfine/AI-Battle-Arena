import React, { useState, useRef, useEffect } from 'react'

const PromptInput = ({ onSubmit, isLoading }) => {
    const [prompt, setPrompt] = useState('')
    const textareaRef = useRef(null)

    useEffect(() => {
        const ta = textareaRef.current
        if (ta) {
            ta.style.height = 'auto'
            ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
        }
    }, [prompt])

    const handleSubmit = () => {
        if (prompt.trim() && !isLoading) {
            onSubmit(prompt.trim())
            setPrompt('')
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className="p-5 border-t border-white/5 shrink-0 bg-[#0b0b0d]">
            <p className="text-[10px] font-black tracking-[0.25em] text-[#71717a] mb-3 uppercase">
                Initiate Neural Conflict
            </p>
            <div className="rounded-lg border border-white/8 bg-[#0f0f12] overflow-hidden mb-3">
                <textarea
                    ref={textareaRef}
                    className="w-full bg-transparent px-4 py-3.5 text-sm text-[#a1a1aa] placeholder-[#3f3f46] outline-none resize-none min-h-[72px] max-h-[200px] leading-relaxed"
                    placeholder="Construct your prompt for the AI combatants..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    disabled={isLoading}
                />
            </div>
            <button
                onClick={handleSubmit}
                disabled={isLoading || !prompt.trim()}
                className={`
                    w-full py-3 rounded font-black text-[11px] tracking-[0.3em] transition-all duration-200
                    disabled:opacity-40 disabled:cursor-not-allowed
                    ${isLoading
                        ? 'bg-[#1a1a1e] text-[#71717a]'
                        : 'bg-[#c8f135] text-black hover:bg-[#d4f53c] hover:scale-[1.01] active:scale-[0.99]'
                    }
                `}
                >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        {[0, 1, 2].map(i => (
                            <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#71717a] dot-bounce"
                                style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                        COMPUTING…
                    </span>
                ) : 'START BATTLE'}
            </button>
        </div>
    )
}

export default PromptInput
