import {ActionFunction, json, redirect} from '@remix-run/node';
import {useActionData, useOutletContext} from '@remix-run/react';
import React from 'react';
import {ProjectInfo} from '~/server/db/projectDb';
import {useAppContext} from '../../AppContext';
import {H1} from '~/typography';
import {Breadcrumbs} from '~/components/Breadcrumbs';
import {ProjectForm, ProjectFormKeys, ProjectFormRequiredKeys, projectFormKeys, projectRequiredKeys} from '../components/ProjectForm';
import {FormErrors, FormResponse} from '~/types/Response';
import {getDataFromFormAsObject} from '~/utils/getDataFromFormAsObject';
import {createFormResponseFromData} from '~/utils/createFormResponseFromData';
import {objectKeys} from '~/utils/objectKeys';
import {db} from '~/server/db/db';
import {Priority} from '@prisma/client';

export const action: ActionFunction = async ({request, params}) => {
  const {projectId} = params
  if (!projectId) {
    return json(`error`)
  }
  const formData = await request.formData()
  const data = getDataFromFormAsObject(formData, projectFormKeys)
  const formResponse = createFormResponseFromData(data, objectKeys(projectRequiredKeys))
  if (!formResponse.success) {
    return json(formResponse)
  }
  const requiredData = data as Record<ProjectFormRequiredKeys, string> & Record<ProjectFormKeys, string | undefined>
  await db.project.update({
    data: {
      title: requiredData.title,
      companyId: requiredData.companyId,
      description: requiredData.description,
      createdDate: new Date(requiredData.dateCreated),
      dueDate: requiredData.dueDate ? new Date(requiredData.dueDate) : null,
      priority: requiredData.priority as Priority,
      assignedUsers: requiredData.users ? {
        set: requiredData.users.split(`,`).map(id => ({id: parseInt(id)})),
      } : undefined,
    },
    where: {
      id: projectId,
    },
  })
  return redirect(`..`)
}

export default function EditProject() {
  const {currentUser} = useAppContext()
  const project = useOutletContext<ProjectInfo>()
  const actionData = useActionData<FormResponse<ProjectFormRequiredKeys>>()
  let errors: FormErrors<ProjectFormRequiredKeys> | undefined
  if (actionData && !actionData.success) {
    errors = actionData.errors
  }
  return (
    <div>
      <H1>{`Edit ${project.title}`}</H1>
      <Breadcrumbs/>
      <ProjectForm project={project} companyId={currentUser.company.id} errors={errors}/>
    </div>
  )
}