import React, { useState, useCallback, useRef, useEffect } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import ChatHistory from '../components/ChatHistory'
import PromptInput from '../components/PromptInput'
import BattleSection from '../components/BattleSection'
import JudgeResult from '../components/JudgeResult'
import './App.css'

const App = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isHistoryOpen, setIsHistoryOpen] = useState(true)
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
            solution1: `To implement a secure WebSocket handshake in a distributed environment using Redis as the pub/sub backbone, you should consider the following architectural pattern:\n\n\`\`\`javascript\nconst WebSocket = require('ws');\nconst redis = require('redis');\n\nconst wss = new WebSocket.Server({ port: 8080 });\nconst pub = redis.createClient();\nconst sub = redis.createClient();\n\nsub.subscribe('chat_channel');\n\nwss.on('connection', (ws) => {\n  ws.on('message', (message) => {\n    pub.publish('chat_channel', message);\n  });\n});\`\`\``,
            solution2: `A robust approach for handling distributed WebSocket connections involves a central Gateway API and a message broker. Here's a simplified version focusing on the connection logic and state synchronization.\n\n\`\`\`python\nimport asyncio\nimport websockets\n\nasync def handler(websocket, path):\n    data = await websocket.recv()\n    print(f"Data received: {data}")\n    await websocket.send("Auth OK")\n\nstart_server = websockets.serve(handler, 'localhost', 8765)\nasyncio.get_event_loop().run_until_complete(start_server)\nasyncio.get_event_loop().run_forever()\`\`\``,
            score1: 98,
            score2: 82,
            speed1: 240,
            speed2: 410,
        }

        try {
            const res = await fetch('http://localhost:8000/battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            })
            if (!res.ok) throw new Error(`${res.status}`)
            const data = await res.json()

            setSessions(prev => 
                prev.map(s => {
                    if (s.id !== currentSessionId) return s
                    const newRounds = [...s.rounds]
                    const last = { ...newRounds[newRounds.length - 1] }
                    last.solution1 = data.solution_1 || mockData.solution1
                    last.solution2 = data.solution_2 || mockData.solution2
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
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative border-l border-white/5">
                    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col pt-8 pb-4">
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
                                        solution1={round.solution1}
                                        solution2={round.solution2}
                                        isLoading={round.isLoading}
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

export default App