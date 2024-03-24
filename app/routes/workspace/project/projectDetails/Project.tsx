import React from 'react';
import emotionStyled from '@emotion/styled';
import {ActionFunction, LoaderFunction, json} from '@remix-run/node';
import {A, BodyText, H1} from '~/typography';
import {useFetcher, useLoaderData, useOutletContext} from '@remix-run/react';
import {ProjectInfo} from '~/server/db/projectDb';
import {Breadcrumbs} from '~/components/Breadcrumbs';
import {Box, Button, Grid, Paper, Stack} from '@mui/material';
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
import {GroupByDate} from '~/server/db/types';
import {DateRange} from '~/types/DateRange';
import dayjs from 'dayjs';
import {LineChart} from '~/components/charts/LineChart';
import {ChartDataRaw} from '~/components/charts/utils/convertDataToChartData';
import {fillRawChartDataWithDateLabels} from '~/components/charts/utils/fillRawChartDataWithDateLabels';
import {convertTicketPriorityCountsToChartDataRaw, convertTicketStatusCountsToChartDataRaw} from '~/components/charts/utils/ticketPieChartHelpers';
import {db} from '~/server/db/db';

type ActionInput = {
  isArchived: boolean;
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
  const data = await request.json() as ActionInput
  const newIsArchived = await db.project.update({
    select: {
      isArchived: true,
    },
    where: {
      id: projectId
    },
    data: {
      isArchived: data.isArchived,
    },
  })
  return json(newIsArchived)
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
  const project = useOutletContext<ProjectInfo>()
  const ticketCounts = useLoaderData<LoaderData>()
  const fetcher = useFetcher()

  const onClickArchiveButton = () => {
    const input: ActionInput = {
      isArchived: !isArchived,
    }
    fetcher.submit(input, {
      method: `post`,
      encType: `application/json`,
    })
  }

  const {ticketPriorityCounts, ticketStatusCounts, totalTicketCount, closedTicketDateCounts} = ticketCounts
  const closedTicketsChartData: ChartDataRaw = closedTicketDateCounts.map(countData => ({
    label: countData.date,
    value: countData.count,
  }))
  const currentDate = new Date()
  const from = dayjs(currentDate).subtract(7, `days`).toDate()
  const to = currentDate
  const isArchived = project.isArchived
  return (
    <div>
      <H1>{project.title}</H1>
      <Breadcrumbs currentLinkTitle={project.title} excludeParentLink/>
      <Box display={`flex`} justifyContent={`space-between`} alignItems={`center`} marginBottom={2}>
        <A style={{display: `block`}} to={`./edit`}>Edit Project</A>
        <Button color={isArchived ? `primary` : `error`} onClick={onClickArchiveButton}>
          {isArchived ? `Unarchive` : `Archive`}
        </Button>
      </Box>
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
              data={convertTicketPriorityCountsToChartDataRaw(ticketPriorityCounts)}
              centerNumber={totalTicketCount}
            />
          </DefaultCard>
        </Grid>
        <Grid item xs={3}>
          <DefaultCard label='Tickets by Status'>
            <PieChart
              label='Open Tickets'
              data={convertTicketStatusCountsToChartDataRaw(ticketStatusCounts)}
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
        projectOptions={[]}
        defualtProjectId={project.id}
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