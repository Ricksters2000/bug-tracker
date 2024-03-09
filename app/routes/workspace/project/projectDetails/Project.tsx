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
import {Priority, TicketStatus} from '@prisma/client';
import {TicketPreview, convertTicketFilterClientSideToTicketFilterServerSide, findTicketPreviews, getTicketCounts, serializedTicketToTicketPreview} from '~/server/db/ticketDb';
import {TicketFilterClientSide, createDefaultTicketFilterClientSide} from '~/utils/defaultTicketFilterClientSide';
import {useAppContext} from '../../AppContext';
import {UserList} from '../../components/UserList';
import {PriorityTag} from '../../components/PriorityTag';
import {DefaultCard} from '~/components/cards/DefaultCard';
import {PieChart} from '~/components/charts/PieChart';

type ActionData = {
  tickets: Array<TicketPreview>;
  ticketCount: number;
  ticketPriorityCounts: Record<Priority, number>;
}

type LoaderData = {
  ticketPriorityCounts: {
    high: number;
    medium: number;
    low: number;
  }
  totalTicketCount: number;
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
  const ticketCounts = await getTicketCounts(ticketFilterInput.filter)
  const data: ActionData = {
    tickets,
    ticketPriorityCounts: ticketCounts,
    ticketCount: ticketCounts.low + ticketCounts.medium + ticketCounts.high,
  }
  return json(data)
}

export const loader: LoaderFunction = async ({params}) => {
  const {projectId} = params
  if (!projectId) {
    return json(`Error`)
  }
  const ticketCounts = await getTicketCounts({
    projectId,
    status: {not: TicketStatus.completed}
  })
  const data: LoaderData = {
    ticketPriorityCounts: {
      high: ticketCounts.high,
      medium: ticketCounts.medium,
      low: ticketCounts.low,
    },
    totalTicketCount: ticketCounts.high + ticketCounts.medium + ticketCounts.low,
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
  const {ticketPriorityCounts, totalTicketCount} = ticketCounts
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
      <Grid container marginTop={`1.5rem`}>
        <Grid item xs={4}>
          <DefaultCard label='Open Tickets'>
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