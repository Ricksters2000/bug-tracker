import {Checkbox, Chip, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import React from 'react';
import {TicketPreview} from '~/server/db/ticketDb';
import {ABase} from '~/typography';
import {removeKeysFromObject} from '~/utils/removeKeysFromObject';
import {getTicketPath, useWorkspacePath} from '~/utils/route/routePathHelpers';

type Props = {
  tickets: Array<TicketPreview>;
}

export const TicketFilter: React.FC<Props> = (props) => {
  const [checked, setChecked] = React.useState<Record<string, true>>({})
  const {tickets} = props
  const workspacePath = useWorkspacePath()
  return (
    <List>
      {tickets.map(ticket => {
        const {id, projectId, title, dueDate, priority} = ticket
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
              primary={<ABase to={`${getTicketPath(workspacePath, projectId, id)}`}>{title}</ABase>}
              secondary={dueDate ? `Due: ${dueDate}` : null}/>
          </ListItem>
        )
      })}
    </List>
  )
}