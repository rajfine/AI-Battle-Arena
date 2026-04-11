import React from 'react'

const SkeletonLoader = () => (
    <div className="space-y-3 p-1">
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-20 w-full rounded mt-4" />
        <div className="skeleton h-3 w-2/3 rounded mt-3" />
        <div className="skeleton h-3 w-4/5 rounded" />
    </div>
)

export default SkeletonLoader
