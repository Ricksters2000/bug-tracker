import React from "react";
import emotionStyled from "@emotion/styled";
import {Box, Card, CardActionArea, CardContent, Chip, Divider, Paper, Stack} from "@mui/material";
import {ActionFunction, LoaderFunction, json} from "@remix-run/node";
import {Link, useFetcher, useLoaderData} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {ProjectPreview, findProjectPreviewsByCompanyIdWithUserRole, serializedProjectToProjectPreview} from "~/server/db/projectDb";
import {ANoTextDecoration, H1, H3, InformationalText, SmallText} from "~/typography";
import {useAppContext} from "../../AppContext";
import {PriorityTag} from "../../components/tags/PriorityTag";
import {db} from "~/server/db/db";

export const loader: LoaderFunction = async ({request, params}) => {
  const {userId} = params
  if (!userId) {
    throw new Error(`Unexpected userId is not in params`)
  }
  const parsedUserId = parseInt(userId)
  const {role, companyId} = await db.user.findUniqueOrThrow({
    select: {
      role: true,
      companyId: true,
    },
    where: {id: parsedUserId}
  })
  const projects = await findProjectPreviewsByCompanyIdWithUserRole(companyId, parsedUserId, role)
  return json(projects)
}

export default function ProjectList() {
  const projects = useLoaderData<Array<ProjectPreview>>().map(serializedProjectToProjectPreview)
  
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