import React, { createContext, useContext, useState } from 'react'

const BattleContext = createContext()

export const useBattleContext = () => useContext(BattleContext)

export const BattleProvider = ({ children }) => {
    // Default mock initial models, but they can be null
    const [model1, setModel1] = useState({ id: 'neural-7', name: 'NEURAL-7', active: true })
    const [model2, setModel2] = useState({ id: 'cortex-x', name: 'CORTEX-X', active: true })

    const [sessions, setSessions] = useState([])
    const [activeSessionId, setActiveSessionId] = useState(null)

    return (
        <BattleContext.Provider value={{ 
            model1, setModel1, 
            model2, setModel2,
            sessions, setSessions,
            activeSessionId, setActiveSessionId
        }}>
            {children}
        </BattleContext.Provider>
    )
}
