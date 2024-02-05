import {Checkbox, Collapse, FormControl, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tabs, TextField, Tooltip} from '@mui/material';
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
import {objectKeys} from '~/utils/objectKeys';
import {TicketFilterClientSide} from '~/utils/defaultTicketFilterClientSide';
import {allFilter} from '~/types/FilterWithAllOption';
import {ProjectOption} from '~/server/db/projectDb';
import {SelectFilter} from './SelectFilter';

type Props = {
  tickets: Array<TicketPreview>;
  priorityCounts: Record<Priority, number>;
  ticketCount: number;
  ticketFilter: TicketFilterClientSide;
  onChange: React.Dispatch<React.SetStateAction<TicketFilterClientSide>>;
  canChangeProjectId?: boolean;
  projectOptions: Array<ProjectOption>;
}

export const TicketFilter: React.FC<Props> = (props) => {
  const {ticketFilter, onChange, priorityCounts, ticketCount, canChangeProjectId, projectOptions} = props
  const {title, statuses, priority, dueDateRange, createdDateRange, projectIds} = ticketFilter
  const [displayAdvancedFilters, setDisplayAdvancedFilters] = React.useState(true)
  const [checked, setChecked] = React.useState<Record<string, true>>({})
  const {tickets} = props
  const workspacePath = useWorkspacePath()

  const onFilterChange = <K extends keyof TicketFilterClientSide>(key: K, data: TicketFilterClientSide[K]) => {
    onChange(prev => ({
      ...prev,
      [key]: data,
    }))
  }
  return (
    <Paper>
      <TabsStyled value={priority} onChange={(e, value) => onFilterChange(`priority`, value)}>
        <TabStyled
          disableRipple
          value={allFilter}
          id={allFilter}
          label="All"
          iconPosition='end'
          icon={
            <TabIcon foregroundColor={`#fff`} backgroundColor={`#000`}>
              {ticketCount}
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
              {priorityCounts.low}
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
              {priorityCounts.medium}
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
              {priorityCounts.high}
            </TabIcon>
          }
        />
      </TabsStyled>
      <Stack padding={`20px`} gap={2}>
        <Stack flexDirection={`row`} alignItems={`center`} gap={1}>
          <TextField
            fullWidth
            placeholder='Search'
            value={title ?? ``}
            onChange={(evt => {
              onFilterChange(`title`, evt.target.value)
            })}
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
                value={statuses}
                renderValue={(selected => selected.join(`, `))}
                onChange={(evt => {
                  const value = evt.target.value
                  if (typeof value === `string`) {
                    onFilterChange(`statuses`, value.split(`,`) as Array<TicketStatus>)
                  } else {
                    onFilterChange(`statuses`, value)
                  }
                })}
              >
                {objectKeys(TicketStatus).map(key => {
                  const value = TicketStatus[key]
                  return (
                    <MenuItem key={key} value={value}>
                      <Checkbox checked={statuses.indexOf(value) > -1}/>
                      <ListItemText primary={key}/>
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
            {canChangeProjectId &&
              <SelectFilter
                fullWidth
                label='Projects'
                value={projectIds}
                onChange={(value => onFilterChange(`projectIds`, value))}
                options={projectOptions.map(option => ({
                  value: option.id,
                  label: option.title,
                }))}
              />
            }
            <DateRangePicker
              label='Create At Range'
              dateRange={createdDateRange}
              onChange={newDateRange => onFilterChange(`createdDateRange`, newDateRange)}
            />
            <DateRangePicker
              label='Due Date Range'
              dateRange={dueDateRange}
              onChange={newDateRange => onFilterChange(`dueDateRange`, newDateRange)}
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