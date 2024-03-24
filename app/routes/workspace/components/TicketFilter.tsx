import {Box, Button, ButtonGroup, Checkbox, Collapse, FormControl, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Tabs, TextField, Tooltip} from '@mui/material';
import React from 'react';
import {TicketPreview} from '~/server/db/ticketDb';
import {ABase} from '~/typography';
import {removeKeysFromObject} from '~/utils/removeKeysFromObject';
import {getTicketPath, useWorkspacePath} from '~/utils/route/routePathHelpers';
import {PriorityTag} from './tags/PriorityTag';
import {RoundedSquareBackground} from './tags/RoundedSquareBackground';
import {priorityColors} from '../utils/priorityColors';
import {Priority, Prisma, TicketStatus} from '@prisma/client';
import emotionStyled from '@emotion/styled';
import {SearchIcon} from '~/assets/icons/SearchIcon';
import {FilterIcon} from '~/assets/icons/FilterIcon';
import {DateRangePicker} from './DateRangePicker';
import {objectKeys} from '~/utils/objectKeys';
import {TicketFilterClientSide, createDefaultTicketFilterClientSide} from '~/utils/defaultTicketFilterClientSide';
import {allFilter} from '~/types/FilterWithAllOption';
import {ProjectOption} from '~/server/db/projectDb';
import {SelectFilter} from './SelectFilter';
import {StatusTag} from './tags/StatusTag';
import {ClosedTicketTag} from './tags/ClosedTicketTag';
import {DeleteIcon} from '~/assets/icons/DeleteIcon';
import {useFetcher} from '@remix-run/react';
import {CloseTicketAction} from '../api/closeTickets';
import {useAppContext} from '../AppContext';
import {TicketFilterActionData} from '../api/getTicketsFromFilter';

type Props = {
  canChangeProjectId?: boolean;
  projectOptions: Array<ProjectOption>;
  defualtProjectId?: string;
}

export const TicketFilter: React.FC<Props> = (props) => {
  const {canChangeProjectId, projectOptions, defualtProjectId} = props
  const {currentUser} = useAppContext()
  const [ticketFilter, setTicketFilter] = React.useState<TicketFilterClientSide>({
    ...createDefaultTicketFilterClientSide(currentUser.company.id),
    ...(defualtProjectId ? {
      projectIds: [defualtProjectId],
    } : {}),
  })
  const {title, statuses, priority, dueDateRange, createdDateRange, projectIds, orderBy, pagination} = ticketFilter
  const [displayAdvancedFilters, setDisplayAdvancedFilters] = React.useState(false)
  const [checked, setChecked] = React.useState<Record<string, true>>({})
  const [pageNumber, setPageNumber] = React.useState(pagination.offset === 0 ? 0 : pagination.offset / pagination.limit)
  const fetcher = useFetcher()
  const filterFetcher = useFetcher<TicketFilterActionData>()
  const workspacePath = useWorkspacePath()
  const selectedTicketIds = objectKeys(checked)

  React.useEffect(() => {
    const stringifiedData = JSON.stringify(ticketFilter)
    filterFetcher.submit(stringifiedData, {
      method: `post`,
      encType: `application/json`,
      action: `/api/ticket-filter`,
    })
  }, [ticketFilter])

  const onCloseTickets = () => {
    const ticketIds = objectKeys(checked)
    const closeTicketsAction: CloseTicketAction = {
      userId: currentUser.id,
      ticketIds,
    }
    fetcher.submit(closeTicketsAction, {
      method: `POST`,
      encType: `application/json`,
      action: `/api/close-tickets`,
    })
  }

  const onFilterChange = <K extends keyof TicketFilterClientSide>(key: K, data: TicketFilterClientSide[K]) => {
    setTicketFilter(prev => ({
      ...prev,
      [key]: data,
      // reset page back to 0 on filter change
      ...(key !== `pagination` ? {
        pagination: {
          ...prev.pagination,
          offset: 0,
        }
      } : {})
    }))
    if (key !== `pagination`) {
      setPageNumber(0)
    }
  }

  const onOrderByChange = (field: TicketFilterClientSide[`orderBy`][`field`]) => {
    let newOrder: Prisma.SortOrder
    if (orderBy.field === field) {
      newOrder = orderBy.order === `asc` ? `desc` : `asc`
    } else {
      newOrder = `asc`
    }
    onFilterChange(`orderBy`, {field, order: newOrder})
  }

  const data = filterFetcher.data
  if (!data) return null
  const {ticketPriorityCounts, ticketCount, tickets} = data
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
              {ticketPriorityCounts.low}
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
              {ticketPriorityCounts.medium}
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
              {ticketPriorityCounts.high}
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
          <Stack gap={2}>
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
            <Stack direction={`row`} gap={1}>
              <ButtonGroup aria-label='closed/open filter button group'>
                <Button
                  disabled={ticketFilter.isClosed === false}
                  onClick={() => onFilterChange(`isClosed`, false)}
                >
                  Open
                </Button>
                <Button
                  color='secondary'
                  disabled={ticketFilter.isClosed === undefined}
                  onClick={() => onFilterChange(`isClosed`, undefined)}
                >
                  Both
                </Button>
                <Button
                  color='error'
                  disabled={ticketFilter.isClosed === true}
                  onClick={() => onFilterChange(`isClosed`, true)}
                >
                  Closed
                </Button>
              </ButtonGroup>
            </Stack>
          </Stack>
        </Collapse>
        {selectedTicketIds.length > 0 && (
          <Button
            color='error'
            size='small'
            sx={{justifyContent: `flex-start`, width: `fit-content`}}
            startIcon={<DeleteIcon/>}
            onClick={onCloseTickets}
          >
            {`Close ${selectedTicketIds.length} Ticket${selectedTicketIds.length > 1 ? `s` : ``}`}
          </Button>
        )}
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'/>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === `title`}
                  direction={orderBy.field === `title` ? orderBy.order : `asc`}
                  onClick={() => onOrderByChange(`title`)}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === `createdDate`}
                  direction={orderBy.field === `createdDate` ? orderBy.order : `asc`}
                  onClick={() => onOrderByChange(`createdDate`)}
                >
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === `dueDate`}
                  direction={orderBy.field === `dueDate` ? orderBy.order : `asc`}
                  onClick={() => onOrderByChange(`dueDate`)}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === `status`}
                  direction={orderBy.field === `status` ? orderBy.order : `asc`}
                  onClick={() => onOrderByChange(`status`)}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy.field === `priority`}
                  direction={orderBy.field === `priority` ? orderBy.order : `asc`}
                  onClick={() => onOrderByChange(`priority`)}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(ticket => {
              const {id, projectId, title, dueDate, createdDate, priority, status, isClosed} = ticket
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
                    <Box display={`flex`} alignItems={`center`} gap={`8px`}>
                      <ABase to={`${getTicketPath(workspacePath, projectId, id)}`}>
                        {title}
                      </ABase>
                      {isClosed && <ClosedTicketTag/>}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {createdDate.toString()}
                  </TableCell>
                  <TableCell>
                    {dueDate?.toString() ?? `-`}
                  </TableCell>
                  <TableCell>
                    <StatusTag status={status}/>
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
      <TablePagination
        rowsPerPageOptions={[20, 50, 100]}
        component={`div`}
        count={ticketCount}
        rowsPerPage={pagination.limit}
        page={pageNumber}
        onPageChange={(evt, page) => {
          setPageNumber(page)
          onFilterChange(`pagination`, {
            limit: pagination.limit,
            offset: page * pagination.limit,
          })
        }}
        onRowsPerPageChange={(evt) => {
          const value = parseInt(evt.target.value)
          setPageNumber(0)
          onFilterChange(`pagination`, {
            limit: value,
            offset: 0,
          })
        }}
      />
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