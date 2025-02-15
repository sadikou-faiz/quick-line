"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs'
import { createService, deleteServiceById, getServicesByEmail } from '../actions'
import { Service } from '@prisma/client'
import { Clock, Trash } from 'lucide-react'

const page = () => {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress

  const [serviceName, setServiceName] = useState("")
  const [avgTime, setAvgTime] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [services, setServices] = useState<Service[]>([])

  const handleCreateService = async () => {
    if (serviceName && avgTime > 0 && email) {
      try {
        await createService(email, serviceName, avgTime)
        setAvgTime(0)
        setServiceName("")
        fetchServices()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const fetchServices = async () => {
    setLoading(true)
    try {
      if (email) {
        const serviceData = await getServicesByEmail(email)
        if (serviceData) {
          setServices(serviceData)
        }
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [email])

  const handleDeleteService = async (serviceId: string) => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce service ? Tous les tickets associés seront également supprimés."
    )
    if (confirmation) {
      try {
          await deleteServiceById(serviceId)
          fetchServices()
      } catch (error) {
        console.error(error)
      }
    }
  }



  return (
    <Wrapper>
      <div className='flex w-full  flex-col md:flex-row'>
        <div className='space-y-2 md:w-1/4 w-full'>
          <span className='label-text'>Nom du service</span>
          <div className=''>
            <input
              type="text"
              name=""
              placeholder='Nom du service'
              className='input input-bordered input-sm w-full'
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>
          <span className='label-text'>Temp moyen du service</span>
          <label className="input input-bordered flex items-center input-sm gap-2">
            Temps Moyen
            <input
              type="number"
              className="grow"
              placeholder="20min"
              value={avgTime}
              onChange={(e) => setAvgTime(Number(e.target.value))}
            />
          </label>
          <button className='btn btn-sm btn-accent mt-4'
            onClick={handleCreateService}
          >
            Nouveau
          </button>
        </div>

        <div className='mt-4 md:mt-0 md:ml-4 md:w-3/4 md:border-l  border-base-200 md:pl-4 w-full'>
          <h3 className='font-semibold'>Liste des services</h3>

          {loading ? (
            <div className='flex justify-center items-center w-full'>
              <span className="loading loading-spinner loading-xs"></span>
            </div>
          ) : services.length === 0 ? (
            <div>

            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="table w-fit">

                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nom du service</th>
                      <th>Temps moyen</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>

                    {services.map((service, index) => (
                      <tr key={service.id}>
                        <th>{index + 1}</th>
                        <td>{service.name}</td>
                        <td className='flex items-center'>
                          <Clock className='w-4 h-4 mr-1' /> {service.avgTime} min
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className='btn btn-xs btn-error'>
                            <Trash className='w-4 h-4' />
                          </button>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

      </div>
    </Wrapper>
  )
}

export default page
