import React from "react"
import {Checkbox, Chip, List, ListItem, ListItemIcon, ListItemText} from "@mui/material"
import {LoaderFunction} from "@remix-run/node"
import {useLoaderData} from "@remix-run/react"
import {Breadcrumbs} from "~/components/Breadcrumbs"
import {TicketPreview, findTicketPreviews} from "~/server/db/ticketDb"
import {A, ABase, H1} from "~/typography"
import {removeKeysFromObject} from "~/utils/removeKeysFromObject"

export const loader: LoaderFunction = async () => {
  const tickets = await findTicketPreviews()
  return tickets
}

export default function Index() {
  const [checked, setChecked] = React.useState<Record<number, true>>({})
  const tickets = useLoaderData<Array<TicketPreview>>()
  return (
    <div>
      <H1>Tickets</H1>
      <Breadcrumbs paths={[`Dashboard`, `Test`]}/>
      <List>
        {tickets.map(ticket => {
          const {id, title, dueDate, priority} = ticket
          return (
            <ListItem disablePadding key={ticket.id} secondaryAction={
              <Chip size="small" label={priority}/>
            }>
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={checked[id] ?? false}
                  onClick={() => {
                    if (checked[id]) {
                      setChecked(prev => {
                        const {[id]: keyToRemove, ...rest} = prev
                        return rest
                      })
                      return
                    }
                    setChecked(prev => ({
                      ...prev,
                      [id]: true,
                    }))
                  }}
                  />
              </ListItemIcon>
              <ListItemText
                primary={<ABase to={`./${id}`}>{title}</ABase>}
                secondary={`Due: ${dueDate}`}/>
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}