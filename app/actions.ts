"use server"

import prisma from "@/lib/prisma"

export async function checkAndAddUser(email: string, name: string) {
    if (!email) return
    try {
        const existingUser = await prisma.company.findUnique({
            where: {
                email: email
            }
        })

        if(!existingUser && name){
            await prisma.company.create({
                data : {
                    email,
                    name
                }
            })
        }

    } catch (error) {
        console.error(error)
    }
}