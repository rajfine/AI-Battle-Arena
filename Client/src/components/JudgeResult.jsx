import React, { useEffect, useState } from 'react'

const JudgeResult = ({ reasoning, winnerName, isLoading }) => {
    const [visible, setVisible] = useState(false)
    useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t) }, [])

    // For radar/pentagon chart — simplified as a visual element
    const HexChart = () => (
        <svg width="120" height="120" viewBox="0 0 120 120" className="opacity-70">
            <polygon
                points="60,10 100,35 100,85 60,110 20,85 20,35"
                fill="none" stroke="rgba(200,241,53,0.15)" strokeWidth="1"
            />
            <polygon
                points="60,25 85,42 85,78 60,95 35,78 35,42"
                fill="none" stroke="rgba(200,241,53,0.1)" strokeWidth="1"
            />
            <polygon
                points="60,18 92,38 92,82 60,102 28,82 28,38"
                fill="rgba(124,58,237,0.25)" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5"
            />
            <circle cx="60" cy="62" r="5" fill="#c8f135" />
        </svg>
    )

    return (
        <div
            className={`mx-5 mb-5 shrink-0 rounded-lg border border-white/6 bg-[#131316] overflow-hidden transition-all duration-300 ${visible ? 'animate-winner' : 'opacity-0'
                }`}
        >
            {/* Judge Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <div className={`w-8 h-8 rounded bg-[#1a1a1e] flex items-center justify-center text-[#c8f135] ${isLoading ? 'animate-pulse' : ''}`}>
                    ⚖
                </div>
                <div>
                    <p className="text-sm font-black tracking-wide text-white">THE JUDGE'S VERDICT</p>
                    <p className="text-[9px] font-bold tracking-[0.2em] text-[#c8f135] uppercase">
                        {isLoading ? 'EVALUATION IN PROGRESS...' : 'Neural Evaluation Protocol Alpha-01'}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-6 p-5">
                {/* Center — radar */}
                <div className={`flex items-center justify-center w-32 ${isLoading ? 'opacity-50 animate-pulse' : ''}`}>
                    <HexChart />
                </div>

                {/* Right — critical analysis */}
                <div className="flex-1 space-y-2">
                    <p className="text-[9px] font-black tracking-[0.2em] text-[#c8f135] uppercase">Critical Analysis</p>
                    
                    {isLoading ? (
                        <div className="space-y-2 mt-2">
                            <div className="h-3 w-full bg-white/5 rounded animate-pulse"></div>
                            <div className="h-3 w-[90%] bg-white/5 rounded animate-pulse"></div>
                            <div className="h-3 w-[80%] bg-white/5 rounded animate-pulse"></div>
                            <div className="h-3 w-[60%] bg-white/5 rounded animate-pulse"></div>
                        </div>
                    ) : (
                        <>
                            <p className="text-[11px] text-[#71717a] leading-relaxed italic">
                                {reasoning || `"Neural-7 demonstrated superior architectural depth. While Cortex-X offered a cleaner syntax, it lacked the production-readiness required for the high-concurrency constraints defined in the prompt."`}
                            </p>
                            <div className="flex items-center gap-2 pt-2 border-t border-white/5 mt-3">
                                <svg width="10" height="10" fill="#c8f135" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[9px] font-black tracking-widest text-[#71717a] uppercase">
                                    Winner Declared: <span className="text-[#c8f135]">{winnerName || 'TIE'}</span>
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default JudgeResult
