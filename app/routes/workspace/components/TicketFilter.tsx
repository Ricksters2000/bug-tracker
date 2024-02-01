import {Checkbox, Chip, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tabs, TextField} from '@mui/material';
import React from 'react';
import {TicketPreview} from '~/server/db/ticketDb';
import {ABase} from '~/typography';
import {removeKeysFromObject} from '~/utils/removeKeysFromObject';
import {getTicketPath, useWorkspacePath} from '~/utils/route/routePathHelpers';
import {PriorityTag} from './PriorityTag';
import {RoundedSquareBackground} from './RoundedSquareBackground';
import {priorityColors} from '../utils/priorityColors';
import {Priority} from '@prisma/client';
import emotionStyled from '@emotion/styled';

type Props = {
  tickets: Array<TicketPreview>;
}

const allFilter = `all`

export const TicketFilter: React.FC<Props> = (props) => {
  const [checked, setChecked] = React.useState<Record<string, true>>({})
  const [priorityFilter, setPriorityFilter] = React.useState<Priority | typeof allFilter>(allFilter)
  const {tickets} = props
  const workspacePath = useWorkspacePath()
  return (
    <Paper>
      <TabsStyled value={priorityFilter} onChange={(e, value) => setPriorityFilter(value)}>
        <TabStyled
          disableRipple
          id={allFilter}
          label="All"
          iconPosition='end'
          icon={
            <TabIcon foregroundColor={`#fff`} backgroundColor={`#000`}>
              2
            </TabIcon>
          }
        />
        <TabStyled
          disableRipple
          id={Priority.low}
          label="Low"
          iconPosition='end'
          icon={
            <TabIcon foregroundColor={priorityColors.low.foreground} backgroundColor={priorityColors.low.background}>
              2
            </TabIcon>
          }
        />
        <TabStyled
          disableRipple
          id={Priority.medium}
          label="Medium"
          iconPosition='end'
          icon={
            <TabIcon foregroundColor={priorityColors.medium.foreground} backgroundColor={priorityColors.medium.background}>
              2
            </TabIcon>
          }
        />
        <TabStyled
          disableRipple
          id={Priority.high}
          label="High"
          iconPosition='end'
          icon={
            <TabIcon foregroundColor={priorityColors.high.foreground} backgroundColor={priorityColors.high.background}>
              2
            </TabIcon>
          }
        />
      </TabsStyled>
      <Stack padding={`20px`} spacing={1}>
        <Stack flexDirection={`row`} spacing={1}>
          <TextField
            fullWidth
            placeholder='Search'
            // InputProps={{
            //   startAdornment: <Search/>,
            // }}
          />
        </Stack>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'/>
              <TableCell>
                <TableSortLabel>
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>
                  Due Date
                </TableSortLabel>
              </TableCell>
              {/* <TableCell>
                <TableSortLabel>
                  Status
                </TableSortLabel>
              </TableCell> */}
              <TableCell>
                <TableSortLabel>
                  Priority
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(ticket => {
              const {id, projectId, title, dueDate, createdDate, priority} = ticket
              return (
                <TableRow key={id} role="checkbox">
                  <TableCell padding='checkbox'>
                    <Checkbox
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
                  </TableCell>
                  <TableCell>
                    <ABase to={`${getTicketPath(workspacePath, projectId, id)}`}>
                      {title}
                    </ABase>
                  </TableCell>
                  <TableCell>
                    {createdDate.toString()}
                  </TableCell>
                  <TableCell>
                    {dueDate?.toString() ?? `-`}
                  </TableCell>
                  <TableCell>
                    <PriorityTag priority={priority}/>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

const TabsStyled = emotionStyled(Tabs)({
  padding: `0 20px`,
  boxShadow: `rgba(145, 158, 171, 0.08) 0px -2px 0px 0px inset`,
  '& .MuiTabs-indicator': {
    background: `rgb(33, 43, 54)`,
  },
})

const TabIcon = emotionStyled(RoundedSquareBackground)({
  marginLeft: `8px`,
  pointerEvents: `none`,
})

const TabStyled = emotionStyled(Tab)({
  padding: 0,
  marginRight: 40,
  minWidth: 48,
  minHeight: 48,
  textTransform: `capitalize`,
  '&:not(.Mui-selected)' : {
    color: `rgb(99, 115, 129)`,
  },
  '&.Mui-selected' : {
    color: `rgb(33, 43, 54)`,
    fontWeight: 700,
  },
})