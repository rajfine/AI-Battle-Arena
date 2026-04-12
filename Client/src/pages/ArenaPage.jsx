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

const ArenaPage = () => {
    const { model1, model2 } = useBattleContext()
    const [isLoading, setIsLoading] = useState(false)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [sessions, setSessions] = useState([])
    const [activeSessionId, setActiveSessionId] = useState(null)
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

        const res = await axios.post('http://localhost:3000/invoke', {
            input: prompt
        }, {withCredentials: true})
        const data = res.data
        console.log(data)

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

        const mockData = {
            solution1: `${data.result.solution_1}`,
            solution2: `${data.result.solution_2}`,
            score1: data.judge_recommendation?.solution_1_score ?? 78,
            score2: data.judge_recommendation?.solution_2_score ?? 82,
            speed1: 240,
            speed2: 410,
        }

        try {
            const res = await axios.post('http://localhost:3000/invoke', {
                input: prompt
            }, {withCredentials: true})
            const data = res.data

            setSessions(prev => 
                prev.map(s => {
                    if (s.id !== currentSessionId) return s
                    const newRounds = [...s.rounds]
                    const last = { ...newRounds[newRounds.length - 1] }
                    last.solution1 = data.solution_1  || mockData.solution1
                    last.solution2 = data.solution_2  || mockData.solution2
                    last.score1 = data.judge_recommendation?.solution_1_score ?? mockData.score1
                    last.score2 = data.judge_recommendation?.solution_2_score ?? mockData.score2
                    last.speed1 = mockData.speed1
                    last.speed2 = mockData.speed2
                    last.isLoading = false
                    newRounds[newRounds.length - 1] = last
                    return { ...s, rounds: newRounds }
                })
            )
            setIsLoading(false)
            } catch {
                setTimeout(() => {
                    setSessions(prev => 
                        prev.map(s => {
                            if (s.id !== currentSessionId) return s
                            const newRounds = [...s.rounds]
                            if (newRounds.length === 0) return s
                            const last = { ...newRounds[newRounds.length - 1] }
                            last.solution1 = mockData.solution1
                            last.solution2 = mockData.solution2
                            last.score1 = mockData.score1
                            last.score2 = mockData.score2
                            last.speed1 = mockData.speed1
                            last.speed2 = mockData.speed2
                            last.isLoading = false
                            newRounds[newRounds.length - 1] = last
                            return { ...s, rounds: newRounds }
                        })
                    )
                    setIsLoading(false)
                }, 1000)
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

                                    {!round.isLoading && round.score1 !== null && (
                                        <JudgeResult
                                            winnerName={winner === 1 ? 'NEURAL-7' : winner === 2 ? 'CORTEX-X' : 'TIE'}
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