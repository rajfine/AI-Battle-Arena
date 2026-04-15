import React, { useState, useCallback, useRef, useEffect } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import ChatHistory from '../components/ChatHistory'
import PromptInput from '../components/PromptInput'
import BattleSection from '../components/BattleSection'
import JudgeResult from '../components/JudgeResult'
import { useBattleContext } from '../context/BattleContext'
import './ArenaPage.css'
import axios from 'axios'

const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const ArenaPage = () => {
    const { model1, model2, sessions, setSessions, activeSessionId, setActiveSessionId } = useBattleContext()
    const [isLoading, setIsLoading] = useState(false)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const messagesEndRef = useRef(null)

    const activeSession = sessions.find(s => s.id === activeSessionId)
    const chatRounds = activeSession ? activeSession.rounds : []

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatRounds])

    const startBattle = useCallback(async (prompt) => {
        setIsLoading(true)

        let currentSessionId = activeSessionId
        let isNewSession = false
        if (!currentSessionId) {
            currentSessionId = Date.now()
            isNewSession = true
            setActiveSessionId(currentSessionId)
        }

        const now = new Date()
        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const newRound = {
            id: Date.now(),
            prompt,
            isLoading: true,
            solution1: null,
            solution2: null,
            score1: null,
            score2: null,
            speed1: null,
            speed2: null
        }

        setSessions(prev => {
            if (isNewSession) {
                return [{
                    id: currentSessionId,
                    prompt: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : ''),
                    timestamp,
                    rounds: [newRound]
                }, ...prev]
            } else {
                return prev.map(s => 
                    s.id === currentSessionId 
                        ? { ...s, rounds: [...s.rounds, newRound] } 
                        : s
                )
            }
        })

        try {
            const response = await fetch(`${apiUrl}/invoke`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: prompt }),
                credentials: 'omit' // use 'include' if you want cookies
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let currentSolution1 = "";
            let currentSolution2 = "";
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || "";

                for (let line of lines) {
                    if (line.trim() === '') continue;
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);
                        if (dataStr === '[DONE]') continue;

                        try {
                            const data = JSON.parse(dataStr);

                            if (data.type === 'chunk') {
                                if (data.model === 1) {
                                    currentSolution1 += data.content;
                                } else if (data.model === 2) {
                                    currentSolution2 += data.content;
                                }

                                setSessions(prev =>
                                    prev.map(s => {
                                        if (s.id !== currentSessionId) return s;
                                        const newRounds = [...s.rounds];
                                        const last = { ...newRounds[newRounds.length - 1] };
                                        last.solution1 = currentSolution1;
                                        last.solution2 = currentSolution2;
                                        newRounds[newRounds.length - 1] = last;
                                        return { ...s, rounds: newRounds };
                                    })
                                );
                            } else if (data.type === 'end') {
                                const judgeRec = data.result?.judge_recommendation || {};
                                
                                setSessions(prev =>
                                    prev.map(s => {
                                        if (s.id !== currentSessionId) return s;
                                        const newRounds = [...s.rounds];
                                        const last = { ...newRounds[newRounds.length - 1] };
                                        
                                        // Update from full result just in case
                                        last.solution1 = data.result?.solution_1 || currentSolution1;
                                        last.solution2 = data.result?.solution_2 || currentSolution2;
                                        last.score1 = judgeRec.solution_1_score ?? 78;
                                        last.score2 = judgeRec.solution_2_score ?? 82;
                                        last.reasoning = judgeRec.reasoning || "";
                                        last.speed1 = 240;
                                        last.speed2 = 410;
                                        last.isLoading = false;
                                        
                                        newRounds[newRounds.length - 1] = last;
                                        return { ...s, rounds: newRounds };
                                    })
                                );
                            } else if (data.type === 'error') {
                                throw new Error(data.message);
                            }
                        } catch (err) {
                            if (err.message.includes("JSON")) {
                                console.warn("Failed to parse chunk:", dataStr);
                            } else {
                                throw err;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Battle error:", error)
            const errorMessage = error.message || "Failed to connect to backend or process request."
            
            setSessions(prev => 
                prev.map(s => {
                    if (s.id !== currentSessionId) return s
                    const newRounds = [...s.rounds]
                    if (newRounds.length === 0) return s
                    const last = { ...newRounds[newRounds.length - 1] }
                    
                    // Keep existing solutions if any, otherwise show error
                    if (!last.solution1 && !last.solution2) {
                        last.solution1 = `Error: ${errorMessage}`
                        last.solution2 = `Error: ${errorMessage}`
                    }
                    
                    last.score1 = 0
                    last.score2 = 0
                    last.speed1 = 0
                    last.speed2 = 0
                    last.reasoning = `Judge System Failure: ${errorMessage}`
                    last.isLoading = false
                    
                    newRounds[newRounds.length - 1] = last
                    return { ...s, rounds: newRounds }
                })
            )
        } finally {
            setIsLoading(false)
        }
    }, [activeSessionId])

    const resetBattle = () => setActiveSessionId(null)

    return (
        <div className="flex flex-col h-screen bg-[#0b0b0d] overflow-hidden">
            <Header />
            <div className="flex flex-1 min-h-0">
                <Sidebar 
                    onNewBattle={resetBattle} 
                    isHistoryOpen={isHistoryOpen}
                    onToggleHistory={() => setIsHistoryOpen(prev => !prev)}
                />
                
                {isHistoryOpen && (
                    <ChatHistory 
                        history={sessions}
                        onSelect={(index) => setActiveSessionId(sessions[index].id)}
                        currentIndex={sessions.findIndex(s => s.id === activeSessionId)}
                    />
                )}

                {/* Main content */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative border-l border-white/5 bg-[#0b0b0d]">
                    {/* VS Matchup Header */}
                    <div className="absolute top-0 left-0 w-full pt-6 flex justify-center pointer-events-none z-10">
                        <div className="bg-[#0f0f12] border border-white/10 rounded-full px-5 py-2 shadow-2xl flex items-center gap-4 pointer-events-auto">
                            <span className="text-[11px] font-black tracking-widest text-white shadow-xl">{model1?.name || 'MODEL 1'}</span>
                            <span className="text-[#c8f135] text-[10px] font-black italic opacity-80">VS</span>
                            <span className="text-[11px] font-black tracking-widest text-white shadow-xl">{model2?.name || 'MODEL 2'}</span>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col pt-20 pb-4">
                        {chatRounds.length === 0 && (
                            <div className="flex-1 flex items-center justify-center text-[#52525b] text-sm">
                                No chat history. Start a battle to begin.
                            </div>
                        )}
                        {chatRounds.map((round) => {
                            const winner = (!round.isLoading && round.score1 !== null)
                                ? (round.score1 > round.score2 ? 1 : round.score2 > round.score1 ? 2 : 0)
                                : null

                            return (
                                <div key={round.id} className="flex flex-col mb-10 w-full shrink-0">
                                    <div className="flex justify-end mb-6 px-5 w-full">
                                        <div className="bg-[#1a1a1e] border border-white/10 rounded-2xl p-4 md:max-w-[70%] max-w-[90%] relative rounded-tr-sm">
                                            <p className="text-[#e5e1e4] text-[13px] md:text-sm italic leading-relaxed whitespace-pre-wrap break-words">
                                                {`"${round.prompt}"`}
                                            </p>
                                        </div>
                                    </div>
                                    <BattleSection
                                        isLoading={round.isLoading}
                                        solution1={round.solution1}
                                        solution2={round.solution2}
                                        winner={winner}
                                        acc1={round.score1}
                                        acc2={round.score2}
                                        speed1={round.speed1}
                                        speed2={round.speed2}
                                    />

                                    {(round.isLoading || round.score1 !== null) && (
                                        <JudgeResult
                                            isLoading={round.isLoading}
                                            winnerName={winner === 1 ? 'NEURAL-7' : winner === 2 ? 'CORTEX-X' : 'TIE'}
                                            reasoning={round.reasoning}
                                        />
                                    )}
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>

                    <div className="shrink-0 bg-[#0b0b0d]">
                        <PromptInput onSubmit={startBattle} isLoading={isLoading} />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ArenaPage
