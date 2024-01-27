import React from 'react';
import emotionStyled from '@emotion/styled';
import {LoaderFunction, json} from '@remix-run/node';
import {BodyText, H1} from '~/typography';
import {useLoaderData} from '@remix-run/react';
import {ProjectInfo, findProjectById, serializedProjectToProjectInfo} from '~/server/db/projectDb';
import {Breadcrumbs} from '~/components/Breadcrumbs';
import {Box, Chip, Paper, Stack} from '@mui/material';
import {CardSubInfo} from '../../components/CardSubInfo';
import {TicketFilter} from '../../components/TicketFilter';

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

export default function Project() {
  const project = serializedProjectToProjectInfo(useLoaderData<ProjectInfo>())
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
      <TicketFilter tickets={project.tickets}/>
    </div>
  )
}

const Description = emotionStyled(BodyText)({
  flex: 3,
})