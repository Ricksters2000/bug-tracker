import {Checkbox, Chip, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import React from 'react';
import {TicketPreview} from '~/server/db/ticketDb';
import {ABase} from '~/typography';
import {removeKeysFromObject} from '~/utils/removeKeysFromObject';

type Props = {
  tickets: Array<TicketPreview>;
}

export const TicketFilter: React.FC<Props> = (props) => {
  const [checked, setChecked] = React.useState<Record<string, true>>({})
  const {tickets} = props
  return (
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
                    setChecked(prev => removeKeysFromObject(prev, [id]))
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
  )
}