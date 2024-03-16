import React from 'react';
import emotionStyled from '@emotion/styled';
import {ActionFunction, LoaderFunction, json} from '@remix-run/node';
import {A, BodyText, BreadcrumbLink, H1} from '~/typography';
import {useFetcher, useLoaderData, useOutletContext} from '@remix-run/react';
import {ProjectInfo, findProjectById, serializedProjectToProjectInfo} from '~/server/db/projectDb';
import {Breadcrumbs} from '~/components/Breadcrumbs';
import {Box, Chip, Grid, Paper, Stack} from '@mui/material';
import {CardSubInfo} from '../../components/CardSubInfo';
import {TicketFilter} from '../../components/TicketFilter';
import {Priority, Prisma, TicketStatus} from '@prisma/client';
import {TicketPreview, convertTicketFilterClientSideToTicketFilterServerSide, findTicketPreviews, getTicketCountsByDateField, getTicketCountsByField, serializedTicketToTicketPreview} from '~/server/db/ticketDb';
import {TicketFilterClientSide, createDefaultTicketFilterClientSide} from '~/utils/defaultTicketFilterClientSide';
import {useAppContext} from '../../AppContext';
import {UserList} from '../../components/UserList';
import {PriorityTag} from '../../components/tags/PriorityTag';
import {DefaultCard} from '~/components/cards/DefaultCard';
import {PieChart} from '~/components/charts/PieChart';
import {statusLightColors} from '../../utils/statusColors';
import {GroupByDate} from '~/server/db/types';
import {DateRange} from '~/types/DateRange';
import dayjs from 'dayjs';
import {LineChart} from '~/components/charts/LineChart';
import {ChartDataRaw} from '~/components/charts/utils/convertDataToChartData';
import {fillRawChartDataWithDateLabels} from '~/components/charts/utils/fillRawChartDataWithDateLabels';

type ActionData = {
  tickets: Array<TicketPreview>;
  ticketCount: number;
  ticketPriorityCounts: Record<Priority, number>;
}

type LoaderData = {
  ticketPriorityCounts: Record<Priority, number>;
  ticketStatusCounts: Record<TicketStatus, number>;
  totalTicketCount: number;
  closedTicketDateCounts: Array<GroupByDate>
}

export const action: ActionFunction = async ({request, params}) => {
  const {projectId} = params
  if (!projectId) {
    return json(`Error`)
  }
  const filter = await request.json() as TicketFilterClientSide
  const ticketFilterInput = convertTicketFilterClientSideToTicketFilterServerSide({
    ...filter,
    projectIds: [projectId],
  })
  const paginationOptions = filter.pagination
  const tickets = await findTicketPreviews(ticketFilterInput.filter, ticketFilterInput.orderBy, paginationOptions.limit, paginationOptions.offset)
  const ticketPriorityCounts = await getTicketCountsByField(`priority`, ticketFilterInput.filter)
  const data: ActionData = {
    tickets,
    ticketPriorityCounts: ticketPriorityCounts,
    ticketCount: ticketPriorityCounts.low + ticketPriorityCounts.medium + ticketPriorityCounts.high,
  }
  return json(data)
}

export const loader: LoaderFunction = async ({params}) => {
  const {projectId} = params
  if (!projectId) {
    return json(`Error`)
  }
  const ticketFilter: Prisma.TicketWhereInput = {
    projectId,
    isClosed: false,
  }
  const currentDate = new Date()
  const dateRange: DateRange = {
    from: dayjs(currentDate).subtract(7, `days`).toDate(),
    to: currentDate,
  }
  const ticketPriorityCounts = await getTicketCountsByField(`priority`, ticketFilter)
  const ticketStatusCounts = await getTicketCountsByField(`status`, ticketFilter)
  const closedTicketDateCounts = await getTicketCountsByDateField(`closedDate`, projectId, dateRange, true)
  const data: LoaderData = {
    ticketPriorityCounts,
    ticketStatusCounts,
    closedTicketDateCounts,
    totalTicketCount: ticketPriorityCounts.high + ticketPriorityCounts.medium + ticketPriorityCounts.low,
  }
  return json(data)
}

export default function Project() {
  const {currentUser} = useAppContext()
  const project = useOutletContext<ProjectInfo>()
  const ticketCounts = useLoaderData<LoaderData>()
  const [ticketFilter, setTicketFilter] = React.useState<TicketFilterClientSide>({
    ...createDefaultTicketFilterClientSide(currentUser.company.id),
  })  
  const fetcher = useFetcher<ActionData>()
  React.useEffect(() => {
    const stringifiedData = JSON.stringify(ticketFilter)
    fetcher.submit(stringifiedData, {
      method: `post`,
      encType: `application/json`,
    })
  }, [ticketFilter])

  if (!fetcher.data) return null
  const tickets = fetcher.data.tickets.map(serializedTicketToTicketPreview)
  const {ticketPriorityCounts, ticketStatusCounts, totalTicketCount, closedTicketDateCounts} = ticketCounts
  const closedTicketsChartData: Array<ChartDataRaw> = closedTicketDateCounts.map(countData => ({
    label: countData.date,
    value: countData.count,
  }))
  const currentDate = new Date()
  const from = dayjs(currentDate).subtract(7, `days`).toDate()
  const to = currentDate
  return (
    <div>
      <H1>{project.title}</H1>
      <Breadcrumbs currentLinkTitle={project.title} excludeParentLink/>
      <A style={{marginBottom: `1rem`, display: `block`}} to={`./edit`}>Edit Project</A>
      <Paper sx={{padding: `1.5rem`}}>
        <Box display={`flex`}>
          <Description>{project.description}</Description>
          <Stack flex={1}>
            <UserList users={project.assignedUsers}/>
          </Stack>
          <ProjectMetadataInfoContainer flex={1}>
            <CardSubInfo label="Priority" details={<PriorityTag priority={project.priority}/>}/>
            <CardSubInfo label="Created Date" details={project.createdDate.toDateString()}/>
            {project.dueDate && <CardSubInfo label="Due Date" details={project.dueDate.toDateString()}/>}
          </ProjectMetadataInfoContainer>
        </Box>
      </Paper>
      <Grid container marginTop={`1.5rem`} spacing={2}>
        <Grid item xs={3}>
          <DefaultCard label='Tickets by Priority'>
            <PieChart
              label='Open Tickets'
              data={[
                {value: ticketPriorityCounts.high, label: `High`, color: `rgb(255, 99, 132)`},
                {value: ticketPriorityCounts.medium, label: `Medium`, color: `rgb(255, 205, 86)`},
                {value: ticketPriorityCounts.low, label: `Low`, color: `rgb(54, 162, 235)`},
              ]}
              centerNumber={totalTicketCount}
            />
          </DefaultCard>
        </Grid>
        <Grid item xs={3}>
          <DefaultCard label='Tickets by Status'>
            <PieChart
              label='Open Tickets'
              data={[
                {value: ticketStatusCounts.new, label: `New`, color: statusLightColors.new},
                {value: ticketStatusCounts.development, label: `Development`, color: statusLightColors.development},
                {value: ticketStatusCounts.testing, label: `Testing`, color: statusLightColors.testing},
                {value: ticketStatusCounts.reviewed, label: `Reviewed`, color: statusLightColors.reviewed},
              ]}
              centerNumber={totalTicketCount}
            />
          </DefaultCard>
        </Grid>
        <Grid item xs={6}>
          <DefaultCard label='Tickets Closed Past 7 Days'>
            <LineChart
              label='Tickets Closed'
              data={fillRawChartDataWithDateLabels(closedTicketsChartData, from, to)}
            />
          </DefaultCard>
        </Grid>
      </Grid>
      <TicketFilter
        tickets={tickets}
        ticketFilter={ticketFilter}
        onChange={setTicketFilter}
        priorityCounts={fetcher.data.ticketPriorityCounts}
        ticketCount={fetcher.data.ticketCount}
        projectOptions={[]}
      />
    </div>
  )
}

const Description = emotionStyled(BodyText)(props => ({
  flex: 2,
  paddingRight: 8,
  borderRight: `1px solid ${props.theme.color.content.divider}`,
}))

const ProjectMetadataInfoContainer = emotionStyled(Stack)(props => ({
  paddingLeft: 8,
  borderLeft: `1px solid ${props.theme.color.content.divider}`,
}))