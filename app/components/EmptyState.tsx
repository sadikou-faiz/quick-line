import { icons } from 'lucide-react'
import React, { FC } from 'react'

interface EmptyStateProps {
    IconComponent: keyof typeof icons
    message: string
    sm?: boolean
}

const EmptyState: FC<EmptyStateProps> = ({ IconComponent, message, sm }) => {
    const SelectedIcon = icons[IconComponent]

    return (
        <div className={`${sm ? 'my-4' : 'my-40'} w-full h-full flex justify-center items-center flex-col` }>
            <div className='wiggle-animation'>
                <SelectedIcon strokeWidth={1} className={`${sm ? 'w-20 h-20' : 'w-40 h-40'} text-accent`} />
            </div>
            <p className='text-sm'>{message}</p>
        </div>
    )
}

export default EmptyState
