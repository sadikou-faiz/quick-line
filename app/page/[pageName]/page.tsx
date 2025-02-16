"use client"
import { createTicket, getServicesByPageName, getTicketsByIds } from '@/app/actions'
import EmptyState from '@/app/components/EmptyState'
import TicketComponent from '@/app/components/TicketComponent'
import { Ticket } from '@/type'
import { Service } from '@prisma/client'

import React, { use, useEffect, useState } from 'react'

const page = ({ params }: { params: Promise<{ pageName: string }> }) => {

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [pageName, setPageName] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [nameComplete, setNameComplete] = useState<string>("")
  const [ticketNums, setTicketNums] = useState<any[]>([])
  const [countdown, setCountdown] = useState<number>(5)


  const resolveParamsAndFetchServices = async () => {
    try {
      const resolvedParams = await params
      setPageName(resolvedParams.pageName)
      const servicesList = await getServicesByPageName(resolvedParams.pageName)
      if (servicesList) {
        setServices(servicesList)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    resolveParamsAndFetchServices()

    const ticketNumsFromStorage = localStorage.getItem('ticketNums')

    if (ticketNumsFromStorage && ticketNumsFromStorage !== "undefined" ) {
      const savedTicketNums = JSON.parse(ticketNumsFromStorage)
      setTicketNums(savedTicketNums)
      if (savedTicketNums.length > 0) {
        fetchTicketsByIds(savedTicketNums)
      }
    } else {
      setTicketNums([])
    }


  }, [])

  const fetchTicketsByIds = async (ticketNums: any[]) => {
    try {
      const fetchedTickets = await getTicketsByIds(ticketNums)
      const validTickets = fetchedTickets?.filter(ticket => ticket.status !== "FINISHED")
      const validTicketNums = validTickets?.map(ticket => ticket.num)
      localStorage.setItem('ticketNums', JSON.stringify(validTicketNums))
      if (validTickets)
        setTickets(validTickets)

    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedServiceId || !nameComplete) {
      alert("Veuillez sélectionner un service et entrer votre nom.");
      return
    }
    try {
      const ticketNum = await createTicket(selectedServiceId, nameComplete, pageName || '')
      setSelectedServiceId(null)
      setNameComplete("")
      const updatedTicketNums = [...ticketNums, ticketNum];
      setTicketNums(updatedTicketNums)
      localStorage.setItem("ticketNums", JSON.stringify(updatedTicketNums))

      console.log(ticketNums)
      console.log(ticketNum)

    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    const handleCountdownAndRefresh = () => {
      if (countdown === 0) {
        if (ticketNums.length > 0)
          fetchTicketsByIds(ticketNums)
        setCountdown(5)
      } else {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }
    }
    const timeoutId = setTimeout(handleCountdownAndRefresh, 1000)
    return () => clearTimeout(timeoutId)
  }, [countdown , ticketNums])





  return (
    <div className='px-5 md:px-[10%] mt-8 mb-10'>

      <div>
        <h1 className='text-2xl font-bold'>
          Bienvenu sur
          <span className='badge badge-accent ml-2'>@{pageName}</span>
        </h1>
        <p className='text-md'>Aller , créer votre ticket</p>
      </div>

      <div className='flex flex-col md:flex-row w-full mt-4'>

        <form className='flex flex-col space-y-2 md:w-96' onSubmit={handleSubmit}>
          <select
            className="select  select-bordered w-full"
            onChange={(e) => setSelectedServiceId(e.target.value)}
            value={selectedServiceId || ''}
          >
            <option disabled value="">Choisissez un service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - ({service.avgTime} min)
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder='Quel est votre nom ?'
            className='input input-bordered w-full'
            onChange={(e) => setNameComplete(e.target.value)}
            value={nameComplete}
          />
          <button type="submit" className='btn btn-accent w-fit'>Go</button>
        </form>

        <div className='w-full mt-4 md:ml-4 md:mt-0'>


          {tickets.length !== 0 && (

            <div>
              <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Vos Tickets</h1>
                <div className="flex items-center">
                  <span className="relative flex size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/30 opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-accent"></span>
                  </span>
                  <div className="ml-2">
                    ({countdown}s)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">

                {tickets.map((ticket, index) => {
                  const totalWaitTime = tickets
                    .slice(0, index)
                    .reduce((acc, prevTicket) => acc + prevTicket.avgTime, 0)
                  return (
                    <TicketComponent
                      key={ticket.id}
                      ticket={ticket}
                      totalWaitTime={totalWaitTime}
                      index={index}
                    />
                  )
                })}

              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default page
