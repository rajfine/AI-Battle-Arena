import React from 'react'
import AIPanel from './AIPanel'

const BattleSection = ({ solution1, solution2, isLoading, winner, acc1, acc2, speed1, speed2 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5 pb-5 w-full">
        <AIPanel
            label="COMBATANT ALPHA"
            modelName="Neural-7"
            badgeText="v4.2.0-STABLE"
            badgeStyle="bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30"
            solution={solution1}
            isLoading={isLoading}
            isWinner={winner === 1}
            accuracy={acc1}
            speed={speed1}
        />
        <AIPanel
            label="COMBATANT BETA"
            modelName="Cortex-X"
            badgeText="EXP-MODEL"
            badgeStyle="bg-[#1a1a1e] text-[#52525b] border border-white/5"
            solution={solution2}
            isLoading={isLoading}
            isWinner={winner === 2}
            accuracy={acc2}
            speed={speed2}
        />
    </div>
)

export default BattleSection
