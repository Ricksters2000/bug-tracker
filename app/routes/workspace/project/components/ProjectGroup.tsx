import {Box, Card, CardActionArea, CardContent, Divider, Grid, Stack} from '@mui/material';
import React from 'react';
import {ProjectPreview} from '~/server/db/projectDb';
import {ANoTextDecoration, SmallText, H3, InformationalText} from '~/typography';
import {PriorityTag} from '../../components/tags/PriorityTag';
import emotionStyled from '@emotion/styled';
import {useWorkspacePath} from '~/utils/route/routePathHelpers';

type Props = {
  projects: Array<ProjectPreview>;
}

export const ProjectGroup: React.FC<Props> = (props) => {
  const {projects} = props
  const workspacePath = useWorkspacePath()
  return (
    <Grid container spacing={2}>
      {projects.map(project => {
        const {id, title, priority, createdDate, dueDate, openTicketCount, assignedUserCount} = project
        return (
          <Grid key={id} item xs={12} sm={6} lg={4} xl={3} component={Card}>
            <ANoTextDecoration to={`${workspacePath}/project/${id}`}>
              <CardActionArea>
                <CardContent>
                  <Stack>
                    <Box display={`flex`} justifyContent={`flex-end`} alignItems={`center`} width={1}>
                      {dueDate && <SmallText style={{marginRight: `auto`}}>{`Due: ${dueDate.toDateString()}`}</SmallText>}
                      <PriorityTag priority={priority}/>
                    </Box>
                    <H3>{title}</H3>
                    <SubTextContainer>
                      <InformationalText>Open Tickets:</InformationalText>
                      <InformationalText>{openTicketCount}</InformationalText>
                    </SubTextContainer>
                    <Divider sx={{margin: `4px 0`}}/>
                    <SubTextContainer>
                      <InformationalText>Users:</InformationalText>
                      <InformationalText>{assignedUserCount}</InformationalText>
                    </SubTextContainer>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </ANoTextDecoration>
          </Grid>
        )
      })}
    </Grid>
  )
}

const SubTextContainer = emotionStyled.div({
  display: `flex`,
  justifyContent: `space-between`,
  alignItems: `center`,
})