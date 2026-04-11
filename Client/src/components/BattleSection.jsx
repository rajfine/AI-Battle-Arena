import React from 'react'
import AIPanel from './AIPanel'

const BattleSection = ({ solution1, solution2, isLoading, winner }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 flex-1 min-h-0 overflow-y-auto">
        <AIPanel
            label="COMBATANT ALPHA"
            modelName="Neural-7"
            badgeText="v4.2.0-STABLE"
            badgeStyle="bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30"
            solution={solution1}
            isLoading={isLoading}
            isWinner={winner === 1}
        />
        <AIPanel
            label="COMBATANT BETA"
            modelName="Cortex-X"
            badgeText="EXP-MODEL"
            badgeStyle="bg-[#1a1a1e] text-[#52525b] border border-white/5"
            solution={solution2}
            isLoading={isLoading}
            isWinner={winner === 2}
        />
    </div>
)

export default BattleSection
