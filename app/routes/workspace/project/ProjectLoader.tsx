import {LoaderFunction, json} from '@remix-run/node';
import {Outlet, useLoaderData} from '@remix-run/react';
import React from 'react';
import {ProjectInfo, findProjectById, serializedProjectToProjectInfo} from '~/server/db/projectDb';

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