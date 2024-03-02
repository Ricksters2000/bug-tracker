import {LoaderFunction, json} from '@remix-run/node';
import {Outlet, useLoaderData} from '@remix-run/react';
import React from 'react';
import {ProjectInfo, findProjectById, serializedProjectToProjectInfo} from '~/server/db/projectDb';
import {BreadcrumbLink} from '~/typography';
import {CommonHandle} from '~/utils/CommonHandle';

export const handle: CommonHandle<ProjectInfo> = {
  breadcrumb: ({params, data}) => {
    const {projectId, userId} = params
    if (!projectId) throw new Error(`Unexpected project id is undefined`)
    return <BreadcrumbLink to={`/workspace/${userId}/project/${projectId}`}>{data?.title ?? `Project`}</BreadcrumbLink>
  }
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

export default function ProjectLoader() {
  const project = serializedProjectToProjectInfo(useLoaderData<ProjectInfo>())
  return (
    <Outlet context={project}/>
  )
}