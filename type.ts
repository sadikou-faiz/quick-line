import {Ticket as TicketCompany } from '@prisma/client'

export type Ticket = TicketCompany & {
    serviceName : string ;
    avgTime:number
}