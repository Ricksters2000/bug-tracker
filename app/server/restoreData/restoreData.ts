import fs from 'fs';
import path from 'path';
import {Comment, Company, Project, Ticket, User} from "@prisma/client";
import {db} from '../db/db';
import {isNotNullOrUndefined} from '../../utils/inNotNullOrUndefined';
import {removeKeysFromObject} from '../../utils/removeKeysFromObject';

export type JsonRestoreData = {
  company: Company;
  users: Array<User>;
  projects: Array<Project>;
  tickets: Array<Ticket & {comments: Array<Comment>}>;
}

const jsonFilename = `restoredData.json`

export const restoreDataFromJson = async () => {
  console.log(`Starting restore data from json`)
  const dataRaw = fs.readFileSync(path.resolve(`./app/server/restoreData/${jsonFilename}`), `utf-8`)
  const data = JSON.parse(dataRaw) as JsonRestoreData
  const company = await db.company.findUnique({where: {id: data.company.id}})
  if (company) {
    console.log(`Company with id: ${data.company.id} already exists, cancel restore data`)
    return
  }
  console.log(`Restoring data from company: ${data.company.id}`)
  await db.$transaction(async tsx => {
    await tsx.company.create({
      data: {
        id: data.company.id,
        name: data.company.name,
      }
    })
    await tsx.user.createMany({
      data: data.users,
    })
    await tsx.project.createMany({
      data: data.projects,
    })
    for (const ticket of data.tickets) {
      await tsx.ticket.create({
        data: {
          ...ticket,
          history: {
            set: ticket.history.filter(isNotNullOrUndefined),
          },
          comments: {
            createMany: {
              data: ticket.comments.map(comment => {
                return removeKeysFromObject(comment, [`ticketId`])
              }),
            },
          },
        },
      })
    }
  })
  console.log(`restored data complete`)
}