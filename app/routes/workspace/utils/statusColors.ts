import {TicketStatus} from "@prisma/client";

export const statusLightColors: Record<TicketStatus, string> = {
  new: `#61F3F3`,
  testing: `#FFAC82`,
  reviewed: `#FFD666`,
  development: `#C684FF`,
}

export const statusColors: Record<TicketStatus, string> = {
  new: `linear-gradient(120deg, #61F3F3, #00B8D9)`,
  testing: `linear-gradient(120deg, #FFAC82, #FF5630)`,
  reviewed: `linear-gradient(120deg, #FFD666, #FFAB00)`,
  development: `linear-gradient(120deg, #C684FF, #8E33FF)`,
}