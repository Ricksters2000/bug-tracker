import React from 'react';
import emotionStyled from '@emotion/styled';
import {ActionFunction, LoaderFunction, json} from '@remix-run/node';
import {A, BodyText, BreadcrumbLink, H1} from '~/typography';
import {useFetcher, useLoaderData, useOutletContext} from '@remix-run/react';
import {ProjectInfo, findProjectById, serializedProjectToProjectInfo} from '~/server/db/projectDb';
import {Breadcrumbs} from '~/components/Breadcrumbs';
import {Box, Chip, Paper, Stack} from '@mui/material';
import {CardSubInfo} from '../../components/CardSubInfo';
import {TicketFilter} from '../../components/TicketFilter';
import {Priority} from '@prisma/client';
import {TicketPreview, convertTicketFilterClientSideToTicketWhereInput, findTicketPreviews, getTicketCounts, serializedTicketToTicketPreview} from '~/server/db/ticketDb';
import {TicketFilterClientSide, createDefaultTicketFilterClientSide} from '~/utils/defaultTicketFilterClientSide';
import {useAppContext} from '../../AppContext';
import {UserList} from '../../components/UserList';
import {PriorityTag} from '../../components/PriorityTag';

type ActionData = {
  tickets: Array<TicketPreview>;
  ticketCount: number;
  ticketPriorityCounts: Record<Priority, number>;
}

export const action: ActionFunction = async ({request, params}) => {
  const {projectId} = params
  if (!projectId) {
    return json(`Error`)
  }
  const filter = await request.json() as TicketFilterClientSide
  const ticketWhereInput = convertTicketFilterClientSideToTicketWhereInput({
    ...filter,
    projectIds: [projectId],
  })
  const tickets = await findTicketPreviews(ticketWhereInput)
  const ticketCounts = await getTicketCounts(ticketWhereInput)
  const data: ActionData = {
    tickets,
    ticketPriorityCounts: ticketCounts,
    ticketCount: ticketCounts.low + ticketCounts.medium + ticketCounts.high,
  }
  return json(data)
}

export default function Project() {
  const {currentUser} = useAppContext()
  const project = useOutletContext<ProjectInfo>()
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