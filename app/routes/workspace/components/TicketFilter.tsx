import {Checkbox, Chip, Collapse, FormControl, IconButton, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, OutlinedInput, Paper, Select, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tabs, TextField, Tooltip} from '@mui/material';
import React from 'react';
import {TicketPreview} from '~/server/db/ticketDb';
import {ABase} from '~/typography';
import {removeKeysFromObject} from '~/utils/removeKeysFromObject';
import {getTicketPath, useWorkspacePath} from '~/utils/route/routePathHelpers';
import {PriorityTag} from './PriorityTag';
import {RoundedSquareBackground} from './RoundedSquareBackground';
import {priorityColors} from '../utils/priorityColors';
import {Priority, TicketStatus} from '@prisma/client';
import emotionStyled from '@emotion/styled';
import {SearchIcon} from '~/assets/icons/SearchIcon';
import {FilterIcon} from '~/assets/icons/FilterIcon';
import {DateRangePicker} from './DateRangePicker';
import {DateRange} from '~/utils/DateRange';
import {objectKeys} from '~/utils/objectKeys';

type Props = {
  tickets: Array<TicketPreview>;
}

const allFilter = `all`

export const TicketFilter: React.FC<Props> = (props) => {
  const [displayAdvancedFilters, setDisplayAdvancedFilters] = React.useState(true)
  const [checked, setChecked] = React.useState<Record<string, true>>({})
  const [priorityFilter, setPriorityFilter] = React.useState<Priority | typeof allFilter>(allFilter)
  const [createAtDateRange, setCreatedAtDateRange] = React.useState<DateRange>({from: null, to: null})
  const [dueDateRange, setDueDateRange] = React.useState<DateRange>({from: null, to: null})
  const [statusFilter, setStatusFilter] = React.useState<Array<TicketStatus>>([])
  const {tickets} = props
  const workspacePath = useWorkspacePath()
  return (
    <Paper>
      <TabsStyled value={priorityFilter} onChange={(e, value) => setPriorityFilter(value)}>
        <TabStyled
          disableRipple
          value={allFilter}
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
          value={Priority.low}
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
          value={Priority.medium}
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
          value={Priority.high}
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
      <Stack padding={`20px`} gap={2}>
        <Stack flexDirection={`row`} alignItems={`center`} gap={1}>
          <TextField
            fullWidth
            placeholder='Search'
            InputProps={{
              startAdornment: <SearchIcon/>,
            }}
          />
          <Tooltip title="More Options">
            <IconButton sx={{width: `40px`, height: `40px`}} onClick={() => setDisplayAdvancedFilters(prev => !prev)}>
              <FilterIcon/>
            </IconButton>
          </Tooltip>
        </Stack>
        <Collapse in={displayAdvancedFilters}>
          <Stack flexDirection={`row`} gap={1}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId='status-label'
                multiple
                input={<OutlinedInput label={`Status`}/>}
                value={statusFilter}
                renderValue={(selected => selected.join(`, `))}
                onChange={(evt => {
                  const value = evt.target.value
                  if (typeof value === `string`) {
                    setStatusFilter(value.split(`,`) as Array<TicketStatus>)
                  } else {
                    setStatusFilter(value)
                  }
                })}
              >
                {objectKeys(TicketStatus).map(key => {
                  const value = TicketStatus[key]
                  return (
                    <MenuItem key={key} value={value}>
                      <Checkbox checked={statusFilter.indexOf(value) > -1}/>
                      <ListItemText primary={key}/>
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
            <DateRangePicker
              label='Create At Range'
              dateRange={createAtDateRange}
              onChange={setCreatedAtDateRange}
            />
            <DateRangePicker
              label='Due Date Range'
              dateRange={dueDateRange}
              onChange={setDueDateRange}
            />
          </Stack>
        </Collapse>
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