import emotionStyled from "@emotion/styled";
import {Box, Card, CardActionArea, CardContent, Chip, Paper, Stack} from "@mui/material";
import {LoaderFunction} from "@remix-run/node";
import {Link, useLoaderData} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {ProjectPreview, findProjectPreviews, serializedProjectToProjectPreview} from "~/server/db/projectDb";
import {ANoTextDecoration, H1, H3, InformationalText} from "~/typography";

export const loader: LoaderFunction = async () => {
  const projects = await findProjectPreviews()
  return projects
}

export default function AllProjects() {
  const projects = useLoaderData<Array<ProjectPreview>>().map(serializedProjectToProjectPreview)
  return (
    <div>
      <H1>Projects</H1>
      <Breadcrumbs paths={[`Dashboard`]}/>
      <Grid>
        {projects.map(project => {
          const {id, title, priority, createdDate, dueDate, openTicketCount, assignedUserCount} = project
          return (
            <Card key={id}>
              <ANoTextDecoration to={`./${id}`}>
                <CardActionArea>
                  <CardContent>
                    <Stack>
                      <Box display={`flex`} justifyContent={`flex-end`} alignItems={`center`} width={1}>
                        <Chip size="small" label={priority}/>
                      </Box>
                      <H3>{title}</H3>
                      <SubTextContainer>
                        <InformationalText>Open Tickets:</InformationalText>
                        <InformationalText>{openTicketCount}</InformationalText>
                      </SubTextContainer>
                      <SubTextContainer>
                        <InformationalText>Users:</InformationalText>
                        <InformationalText>{assignedUserCount}</InformationalText>
                      </SubTextContainer>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </ANoTextDecoration>
            </Card>
          )
        })}
      </Grid>
    </div>
  )
}

const SubTextContainer = emotionStyled.div({
  display: `flex`,
  justifyContent: `space-between`,
  alignItems: `center`,
})

const Grid = emotionStyled.div({
  display: `grid`,
  gridTemplateColumns: `repeat(4, minmax(0, 1fr))`,
  gap: `60px`,
})