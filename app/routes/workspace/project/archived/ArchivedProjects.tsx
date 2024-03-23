import React from "react";
import emotionStyled from "@emotion/styled";
import {LoaderFunction, json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {ProjectPreview, findProjectPreviewsByCompanyIdWithUserRole, serializedProjectToProjectPreview} from "~/server/db/projectDb";
import {H1} from "~/typography";
import {db} from "~/server/db/db";
import {ProjectGroup} from "../components/ProjectGroup";

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
  const projects = await findProjectPreviewsByCompanyIdWithUserRole(companyId, parsedUserId, role, true)
  return json(projects)
}

export default function ArchivedProjects() {
  const projects = useLoaderData<Array<ProjectPreview>>().map(serializedProjectToProjectPreview)
  
  return (
    <div>
      <H1>Archived Projects</H1>
      <Breadcrumbs currentLinkTitle="Archived Projects"/>
      <ProjectGroup projects={projects}/>
    </div>
  )
}