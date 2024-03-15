import {db} from "../db/db"
import {TicketHistory} from "../db/ticketDb"

const migrationEnabled = false

export const migrateTicketClosedDate = async () => {
  if (!migrationEnabled) return
  console.log(`starting migration for tickets closed date`)
  await db.$transaction(async (tsx) => {
    const tickets = await tsx.ticket.findMany({
      where: {
        isClosed: true,
        closedDate: null,
      }
    })
    console.log(`found ${tickets.length} closed tickets without a closed date`)
    const updateTicketPromises = tickets.map(async (ticket) => {
      const history = ticket.history as unknown as Array<TicketHistory>
      let closedDate: Date | null = null
      // search in reverse to get the latest date of when the ticket was closed
      for (let i = history.length - 1; i >= 0; i--) {
        const historyItem = history[i]
        if (historyItem.action.type === `isClosed`) {
          if (historyItem.action.data) {
            closedDate = historyItem.date
            break
          }
        }
      }
      if (!closedDate) {
        closedDate = new Date()
      }
      await tsx.ticket.update({
        data: {
          closedDate,
        },
        where: {
          id: ticket.id,
        }
      })
      console.log(`migrated ticket closed date: ${ticket.id}`)
    })
    await Promise.all(updateTicketPromises)
  })
}