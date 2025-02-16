import { Ticket } from '@/type'
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react'

interface TicketComponentProps {
    ticket: Ticket;
    index?: number;
    totalWaitTime?: number;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "IN_PROGRESS":
            return <div className='badge badge-primary'>En cours de traitement</div>
        case "PENDING":
            return <div className='badge badge-warning'>En attente</div>
        case "CALL":
            return <div className='badge badge-info'>C'est votre tour</div>
        case "FINISHED":
            return <div className='badge badge-success'>Servi</div>
        default:
            return <div className='badge badge-primary'>Statut inconnu</div>
    }
}



const TicketComponent: React.FC<TicketComponentProps> = ({ ticket, index, totalWaitTime = 0 }) => {

    const totalHours = Math.floor(totalWaitTime / 60)
    const totalMinutes = totalWaitTime % 60
    const formattedTotalWaitTime = `${totalHours}h ${totalMinutes}min`

    const [waitTimeStatus, setWaitTimeStatus] = useState("success")
    const [formattedRealWaitTime, setFormattedRealWaitTime] = useState("")

    useEffect(() => {

        if (!ticket || !ticket.createdAt) return

        const currentTime = new Date().getTime()
        const createdAtTime = new Date(ticket.createdAt).getTime()
        const waitTimeInMinutes = (currentTime - createdAtTime) / 60000

        const hours = Math.floor(waitTimeInMinutes / 60)
        const minutes = Math.floor(waitTimeInMinutes % 60)
        setFormattedRealWaitTime(`${hours}h ${minutes}min`)

        if (totalWaitTime !== 0) {
            if (waitTimeInMinutes > totalWaitTime) {
                setWaitTimeStatus("error")
            } else {
                setWaitTimeStatus("success")
            }
        }

    }, [ticket,totalWaitTime])



    return (
        <div className='border p-5 border-base-300 rounded-xl flex flex-col space-y-2'>

            <div className='mx-1 text-lg font-semibold'>
                <span className='text-lg font-semibold text-gray-500 badge'>
                    #{ticket.num}
                </span>
                <span className='font-bold text-xl'>
                    <span className='ml-2'>
                        {ticket?.serviceName}
                    </span>
                    {ticket.avgTime && (
                        <span className='badge badge-accent ml-2'>
                            {ticket.avgTime} min
                        </span>
                    )}
                </span>
            </div>

            <div className='flex flex-col md:flex-row md:justify-between'>
                <div className='flex flex-col btn btn-sm w-fit'>
                    {getStatusBadge(ticket.status)}
                    <div className='lowercase'>
                        {ticket.postName || <Loader className='w-4 h-4 animate-spin' />}
                    </div>
                </div>
                <div className="flex mt-2 md:mt-0">
                    <div className='font-semibold capitalize text-md'>
                        {ticket.nameComplete}
                    </div>
                </div>
            </div>

            {ticket.status !== "IN_PROGRESS" && ticket.status !== "FINISHED" && (
                <div className='border border-base-300 rounded-xl p-5'>
                    <span className='badge badge-accent badge-outline'>Attente</span>
                    <ul className="timeline timeline-vertical lg:timeline-horizontal w-full">

                        {totalWaitTime !== 0 && (
                            <li>
                                <div className="timeline-start">Estimé</div>
                                <div className="timeline-middle">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className={`h-5 w-5 ${waitTimeStatus === "success" ? "text-green-500" : "text-red-500"}`}>
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                            clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className={`timeline-end timeline-box border-2  ${waitTimeStatus === "success" ? "border-green-500" : "border-red-500"} `}>{formattedTotalWaitTime}</div>
                                <hr className={`${waitTimeStatus === "success" ? "bg-green-500" : "bg-red-500"}`} />
                            </li>
                        )}

                        <li>
                            <hr className={`${waitTimeStatus === "success" ? "bg-green-500" : "bg-red-500"}`} />
                            <div className="timeline-start">Réel</div>
                            <div className="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className={`h-5 w-5 ${waitTimeStatus === "success" ? "text-green-500" : "text-red-500"}`}>
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className={`timeline-end timeline-box border-2  ${waitTimeStatus === "success" ? "border-green-500" : "border-red-500"} `}>{formattedRealWaitTime}</div>
                        </li>

                    </ul>

                </div>
            )}
        </div>
    )
}

export default TicketComponent
