import React, { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useBattleContext } from '../context/BattleContext'

const AI_MODELS = [
    { id: 'neural-7', name: 'NEURAL-7', description: 'Advanced reasoning and logical deduction engine optimized for complex algorithms.', tags: ['Logic', 'Coding'] },
    { id: 'cortex-x', name: 'CORTEX-X', description: 'Creative generation matrix built for abstract problem solving and design tasks.', tags: ['Creative', 'Fast'] },
    { id: 'llama-3', name: 'LLAMA-3', description: 'Versatile open-weights juggernaut with excellent contextual understanding.', tags: ['Versatile', 'Balanced'] },
    { id: 'gpt-4o', name: 'GPT-4 OMNI', description: 'State-of-the-art multimodal intellect from OpenAI with unparalleled speed.', tags: ['State-of-Art', 'Reasoning'] },
    { id: 'claude-3.5', name: 'CLAUDE 3.5 SONNET', description: 'Anthropic\'s flagship balanced model excelling in safe and precise outputs.', tags: ['Precise', 'Coding'] },
    { id: 'gemini-1.5', name: 'GEMINI 1.5 PRO', description: 'Google\'s massive context window specialist capable of handling extremely large inputs.', tags: ['Super Context', 'Google'] },
]

export default function ModelsPage() {
    const { model1, setModel1, model2, setModel2 } = useBattleContext()
    const [selectedModel, setSelectedModel] = useState(null)

    return (
        <div className="flex flex-col h-screen bg-[#0b0b0d] overflow-hidden">
            <Header />
            <div className="flex flex-1 min-h-0">
                <Sidebar isHistoryOpen={false} />
                <main className="flex-1 overflow-y-auto p-6 md:p-10 border-l border-white/5 relative">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-black tracking-widest text-white mb-2 drop-shadow-md">MODEL FORGE</h1>
                        <p className="text-[#a1a1aa] text-sm tracking-wide">Select and configure your combatants for the Arena.</p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {AI_MODELS.map(model => {
                            const isModel1 = model1?.id === model.id
                            const isModel2 = model2?.id === model.id
                            
                            return (
                                <div 
                                    key={model.id}
                                    onClick={() => setSelectedModel(model)}
                                    className={`
                                        p-6 rounded-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full
                                        ${isModel1 ? 'border-[#c8f135] bg-[#c8f135]/5 shadow-[0_0_30px_rgba(200,241,53,0.06)]' : 
                                          isModel2 ? 'border-[#9b5de5] bg-[#9b5de5]/5 shadow-[0_0_30px_rgba(155,93,229,0.06)]' : 
                                          'border-white/10 bg-[#0f0f12] hover:border-white/20 hover:bg-[#1a1a1e]'}
                                    `}
                                >
                                    {/* Action Overlay */}
                                    {selectedModel?.id === model.id && (
                                        <div className="absolute inset-0 bg-[#0f0f12]/95 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 gap-4 animate-in fade-in duration-200">
                                            <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-1">Assign {model.name}</p>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setModel1(model); setSelectedModel(null) }}
                                                className="w-full py-3 rounded-md bg-[#c8f135] text-black text-[10px] font-black tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(200,241,53,0.3)]"
                                            >
                                                SET AS MODEL 1
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setModel2(model); setSelectedModel(null) }}
                                                className="w-full py-3 rounded-md bg-[#9b5de5] text-white text-[10px] font-black tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(155,93,229,0.3)]"
                                            >
                                                SET AS MODEL 2
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setSelectedModel(null) }}
                                                className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-[#71717a] hover:text-white hover:bg-white/10 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    {/* Badges container */}
                                    <div className="flex gap-2 mb-4 h-[20px]">
                                        {isModel1 && <span className="bg-[#c8f135] text-black text-[9px] font-black px-2 py-0.5 rounded tracking-[0.1em] shadow-sm">MODEL 1</span>}
                                        {isModel2 && <span className="bg-[#9b5de5] text-white text-[9px] font-black px-2 py-0.5 rounded tracking-[0.1em] shadow-sm">MODEL 2</span>}
                                    </div>
                                    
                                    <h2 className="text-lg font-black text-white tracking-widest mb-3">{model.name}</h2>
                                    <p className="text-xs text-[#71717a] leading-relaxed mb-6 flex-1">{model.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {model.tags.map(tag => (
                                            <span key={tag} className="text-[9px] font-medium text-[#8c8c93] border border-white/5 px-2 py-1 rounded bg-[#1a1a1e]">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </main>
            </div>
        </div>
    )
}
