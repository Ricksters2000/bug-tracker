import React from 'react';
import emotionStyled from '@emotion/styled';
import {ActionFunction, LoaderFunction, json} from '@remix-run/node';
import {BodyText, H1} from '~/typography';
import {useFetcher, useLoaderData} from '@remix-run/react';
import {ProjectInfo, findProjectById, serializedProjectToProjectInfo} from '~/server/db/projectDb';
import {Breadcrumbs} from '~/components/Breadcrumbs';
import {Box, Chip, Paper, Stack} from '@mui/material';
import {CardSubInfo} from '../../components/CardSubInfo';
import {TicketFilter} from '../../components/TicketFilter';
import {Priority} from '@prisma/client';
import {TicketPreview, convertTicketFilterClientSideToTicketWhereInput, findTicketPreviews, getTicketCounts, serializedTicketToTicketPreview} from '~/server/db/ticketDb';
import {TicketFilterClientSide, createDefaultTicketFilterClientSide} from '~/utils/defaultTicketFilterClientSide';
import {useAppContext} from '../../AppContext';

type ActionData = {
  tickets: Array<TicketPreview>;
  ticketCount: number;
  ticketPriorityCounts: Record<Priority, number>;
}

export const loader: LoaderFunction = async ({params}) => {
  const {projectId} = params
  if (!projectId) {
    return json(`Error`)
  }
  const project = await findProjectById(projectId)
  if (!project) {
    return json(`Error`)
  }
  return project
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
  const project = serializedProjectToProjectInfo(useLoaderData<ProjectInfo>())
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
      <Breadcrumbs paths={[`Dashboard`]}/>
      <Paper>
        <Box>
          <Description>{project.description}</Description>
          <Stack flex={1}>
            <CardSubInfo label="Priority" details={<Chip size="medium" label={project.priority}/>}/>
            <CardSubInfo label="Created Date" details={project.createdDate.toString()}/>
            {project.dueDate && <CardSubInfo label="Due Date" details={project.dueDate.toString()}/>}
          </Stack>
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

const Description = emotionStyled(BodyText)({
  flex: 3,
})