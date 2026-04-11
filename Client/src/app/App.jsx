import React, { useState, useCallback } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import PromptInput from '../components/PromptInput'
import BattleSection from '../components/BattleSection'
import JudgeResult from '../components/JudgeResult'
import './App.css'

const App = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [battleResult, setBattleResult] = useState(null)

    const startBattle = useCallback(async (prompt) => {
        setIsLoading(true)
        setBattleResult(null)

        try {
            const res = await fetch('http://localhost:8000/battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            })
            if (!res.ok) throw new Error(`${res.status}`)
            const data = await res.json()

            setBattleResult({
                solution1: data.solution_1 || '',
                solution2: data.solution_2 || '',
                score1: data.judge_recommendation?.solution_1_score ?? 0,
                score2: data.judge_recommendation?.solution_2_score ?? 0,
            })
        } catch {
            // Mock data for dev/testing when backend is unreachable
            setBattleResult({
                solution1: `To implement a secure WebSocket handshake in a distributed environment using Redis as the pub/sub backbone, you should consider the following architectural pattern:\n\n\`\`\`javascript\nconst WebSocket = require('ws');\nconst redis = require('redis');\n\nconst wss = new WebSocket.Server({ port: 8080 });\nconst pub = redis.createClient();\nconst sub = redis.createClient();\n\nsub.subscribe('chat_channel');\n\nwss.on('connection', (ws) => {\n  ws.on('message', (message) => {\n    pub.publish('chat_channel', message);\n  });\n});\`\`\``,
                solution2: `A robust approach for handling distributed WebSocket connections involves a central Gateway API and a message broker. Here's a simplified version focusing on the connection logic and state synchronization.\n\n\`\`\`python\nimport asyncio\nimport websockets\n\nasync def handler(websocket, path):\n    data = await websocket.recv()\n    print(f"Data received: {data}")\n    await websocket.send("Authenticated")\n\nstart_server = websockets.serve(handler, 'localhost', 8765)\nasyncio.get_event_loop().run_until_complete(start_server)\nasyncio.get_event_loop().run_forever()\`\`\``,
                score1: 98,
                score2: 240,
            })
        } finally {
            setIsLoading(false)
        }
    }, [])

    const resetBattle = () => setBattleResult(null)

    const winner = battleResult
        ? battleResult.score1 > battleResult.score2 ? 1
            : battleResult.score2 > battleResult.score1 ? 2 : 0
        : null

    return (
        <div className="flex flex-col h-screen bg-[#0b0b0d] overflow-hidden">
            <Header />
            <div className="flex flex-1 min-h-0">
                <Sidebar onNewBattle={resetBattle} />

                {/* Main content */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <PromptInput onSubmit={startBattle} isLoading={isLoading} />

                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <BattleSection
                            solution1={battleResult?.solution1}
                            solution2={battleResult?.solution2}
                            isLoading={isLoading}
                            winner={winner}
                        />

                        {!isLoading && battleResult && (
                            <JudgeResult
                                score1={battleResult.score1}
                                score2={battleResult.score2}
                                winnerName={winner === 1 ? 'NEURAL-7' : winner === 2 ? 'CORTEX-X' : 'TIE'}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default App