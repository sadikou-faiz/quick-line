import { SignUp } from '@clerk/nextjs'
import React from 'react'

const page = () => {
    return (
        <div className='hero bg-base-200 min-h-screen'>
            <div className='hero-content text-center'>
                <div className='max-w-md'>
                    <SignUp />
                </div>
            </div>
        </div>
    )
}

export default page
