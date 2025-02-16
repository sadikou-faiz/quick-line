"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import { AudioWaveform, GlobeLock, Menu, Settings, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { checkAndAddUser, getCompanyPageName } from '../actions'
import SettingsModal from './SettingsModal'

const Navbar = () => {
    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress
    const [menuOpen, setMenuOpen] = useState(false)
    const [pageName, setPageName] = useState<string | null>(null)

    const navLinks = [
        { href: "/", label: "Accueil" },
        { href: "/services", label: "Vos services" },
        { href: "/poste_list", label: "Vos postes" },
        { href: "/dashboard", label: "Tableau de bord" }
    ]

    const renderLinks = (classNames: string) => (
        <>
            <button className="btn btn-sm btn-accent btn-circle"
                onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
                <Settings className='w-4 h-4' />
            </button>

            {navLinks.map(({ href, label }) => (
                <Link href={href} key={href} className={`${classNames} btn-sm `}>{label}</Link>
            ))}

            {pageName && (
                <Link href={`/page/${pageName}`} className={`${classNames} btn-sm `}>
                    <GlobeLock className='w-4 h-4' />
                </Link>
            )}
        </>
    )

    useEffect(() => {
        const init = async () => {
            if (email && user.fullName) {
                await checkAndAddUser(email, user.fullName)
                const pageName = await getCompanyPageName(email)
                if (pageName) {
                    setPageName(pageName)
                }

            }
        }
        init()
    }, [user, email])

    return (
        <div className='border-b  border-base-300 px-5 md:px-[10%] py-4 relelative '>
            <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                    <div className='rounded-full p-2'>
                        <AudioWaveform className='w-6 h-6 text-accent' />
                    </div>
                    <span className='font-bold text-xl'>
                        QuickLine
                    </span>
                </div>

                <button className=' btn w-fit btn-sm sm:hidden' onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu className='w-4' />
                </button>

                <div className=' hidden space-x-2 sm:flex items-center'>
                    {renderLinks("btn")}
                    <UserButton />
                </div>
            </div>

            <div className={`absolute top-0 w-full bg-base-100  h-screen flex flex-col gap-2 p-4 transition-all duration-300 sm:hidden z-50 ${menuOpen ? "left-0" : "-left-full"}`}>
                <div className=' flex justify-between'>
                    <UserButton />
                    <button className=' btn w-fit btn-sm sm:hidden' onClick={() => setMenuOpen(!menuOpen)}>
                        <X className='w-4' />
                    </button>
                </div>
                {renderLinks("btn")}
            </div>

            <SettingsModal
                email={email}
                pageName={pageName}
                onPageNameChange={setPageName}
            />

        </div>
    )
}

export default Navbar
