"use client"
import { getLastTicketByEmail, getPostNameById, updateTicketStatus } from '@/app/actions'
import EmptyState from '@/app/components/EmptyState'
import TicketComponent from '@/app/components/TicketComponent'
import Wrapper from '@/app/components/Wrapper'
import { Ticket } from '@/type'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = ({ params }: { params: Promise<{ idPoste: string }> }) => {

    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress
    const [idPoste, setIdPoste] = useState<string | null>(null)
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [namePoste, setNamePoste] = useState<string | null>(null)
    const router = useRouter()

    const getData = async () => {
        try {
            if (email) {
                const resolvedParams = await params;
                setIdPoste(resolvedParams.idPoste)
                const data = await getLastTicketByEmail(email, resolvedParams.idPoste)
                if (data) {
                    setTicket(data)
                }

                const postName = await getPostNameById(resolvedParams.idPoste)
                if (postName) {
                    setNamePoste(postName)
                }

            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getData()
    }, [email, params])

    const handleStatusChange = async (newStatus: string) => {
        if (ticket) {
            try {
                await updateTicketStatus(ticket.id, newStatus)
                if (newStatus === "FINISHED") {
                    router.push(`/poste/${idPoste}`)
                } else {
                    getData()
                }

            } catch (error) {
                console.error(error)
            }
        }
    }

    return (
        <Wrapper>

            <div className='mb-4'>
                <h1 className="text-2xl font-bold"> <span>Poste</span> <span className='badge badge-accent'>{namePoste ?? "aucun poste"}</span></h1>
                <Link className='btn mt-4 btn-sm' href={`/poste/${idPoste}`}>Retour</Link>
            </div>
            {ticket ? (
                <div>

                    <TicketComponent
                        ticket={ticket}
                    />
                    <div className='flex space-x-4 mt-4'>
                        {ticket.status === "CALL" && (
                            <button
                                className='btn btn-accent btn-outline btn-sm'
                                onClick={() => handleStatusChange('IN_PROGRESS')}
                            >
                                Démarrer le traitement
                            </button>
                        )}

                        {ticket.status === "IN_PROGRESS" && (
                            <button
                                className='btn btn-accent btn-outline btn-sm'
                                onClick={() => handleStatusChange('FINISHED')}
                            >
                                Fin du traitement
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <EmptyState
                        message={'Aucun ticket en attente'}
                        IconComponent='UserSearch'
                    />
                </div>

            )}
        </Wrapper>
    )
}

export default page
