import React from "react";
import emotionStyled from "@emotion/styled";
import {Box, Card, CardActionArea, CardContent, Chip, Paper, Stack} from "@mui/material";
import {ActionFunction, json} from "@remix-run/node";
import {Link, useFetcher, useLoaderData} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {ProjectPreview, findProjectPreviewsByCompanyId, serializedProjectToProjectPreview} from "~/server/db/projectDb";
import {ANoTextDecoration, H1, H3, InformationalText} from "~/typography";
import {useAppContext} from "../../AppContext";

export const action: ActionFunction = async ({request}) => {
  const {companyId} = await request.json()
  const projects = await findProjectPreviewsByCompanyId(companyId)
  return json(projects)
}

export default function ProjectList() {
  const {currentUser} = useAppContext()
  const fetcher = useFetcher<Array<ProjectPreview>>()
  let projects: Array<ProjectPreview> = []

  React.useEffect(() => {
    fetcher.submit({companyId: currentUser.company.id}, {
      method: `post`,
      encType: `application/json`,
    })
  }, [])

  if (fetcher.data) {
    projects = fetcher.data.map(serializedProjectToProjectPreview)
  }
  
  return (
    <div>
      <H1>Projects</H1>
      <Breadcrumbs currentLinkTitle="List"/>
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