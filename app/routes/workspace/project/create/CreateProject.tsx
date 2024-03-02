import {useActionData} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {H1} from "~/typography";
import {$Enums} from "@prisma/client";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {getDataFromFormAsObject} from "~/utils/getDataFromFormAsObject";
import {createFormResponseFromData} from "~/utils/createFormResponseFromData";
import {db} from "~/server/db/db";
import {FormErrors, FormResponse} from "~/types/Response";
import {objectKeys} from "~/utils/objectKeys";
import {useAppContext} from "../../AppContext";
import {ProjectForm, ProjectFormKeys, ProjectFormRequiredKeys, projectFormKeys, projectRequiredKeys} from "../components/ProjectForm";

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData()
  const data = getDataFromFormAsObject(formData, projectFormKeys)
  const formResponse = createFormResponseFromData(data, objectKeys(projectRequiredKeys))
  if (!formResponse.success) {
    return json(formResponse)
  }
  const requiredData = data as Record<ProjectFormRequiredKeys, string> & Record<ProjectFormKeys, string | undefined>
  const {id} = await db.project.create({
    select: {
      id: true,
    },
    data: {
      title: requiredData.title,
      companyId: requiredData.companyId,
      description: requiredData.description,
      createdDate: new Date(requiredData.dateCreated),
      dueDate: requiredData.dueDate ? new Date(requiredData.dueDate) : null,
      priority: requiredData.priority as $Enums.Priority,
      assignedUsers: requiredData.users ? {
        connect: requiredData.users.split(`,`).map(id => ({id: parseInt(id)})),
      } : undefined,
    },
  })
  return redirect(`../project/${id}`)
}

export default function CreateProject() {
  const {currentUser} = useAppContext()
  const actionData = useActionData<FormResponse<ProjectFormRequiredKeys>>()
  let errors: FormErrors<ProjectFormRequiredKeys> | undefined
  if (actionData && !actionData.success) {
    errors = actionData.errors
  }
  return (
    <div>
      <H1>Create a new project</H1>
      <Breadcrumbs currentLinkTitle="Create"/>
      <ProjectForm errors={errors} companyId={currentUser.company.id}/>
    </div>
  )
}