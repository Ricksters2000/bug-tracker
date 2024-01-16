import emotionStyled from "@emotion/styled";
import {Form, useActionData, useLoaderData, useSearchParams} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {H1} from "~/typography";
import {$Enums, Prisma} from "@prisma/client";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {Alert, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField} from "@mui/material";
import {DatePicker} from "~/components/input/DatePicker";
import {getDataFromFormAsObject} from "~/utils/getDataFromFormAsObject";
import {createFormResponseFromData} from "~/utils/createFormResponseFromData";
import {db} from "~/server/db/db";
import {FormResponse} from "~/types/Response";
import {getProjectPreviews} from "~/server/db/projectDb";

const formKeys = {
  projectId: `projectId`,
  title: `title`,
  content: `content`,
  dateCreated: `dateCreated`,
  dueDate: `dueDate`,
  // users: `users`,
  priority: `priority`,
}

type FormKeys = keyof typeof formKeys

const requiredKeys = {
  projectId: null,
  title: null,
  priority: null,
  dateCreated: null,
}

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData()
  const data = getDataFromFormAsObject(formData, formKeys)
  const formResponse = createFormResponseFromData(data)
  if (!formResponse.success) {
    return json(formResponse)
  }
  const requiredData = data as Record<keyof typeof requiredKeys, string> & Record<FormKeys, string | undefined>
  const {id} = await db.ticket.create({
    select: {
      id: true,
    },
    data: {
      title: requiredData.title,
      projectId: parseInt(requiredData.projectId),
      content: requiredData.content,
      createdDate: new Date(requiredData.dateCreated),
      dueDate: requiredData.dueDate ? new Date(requiredData.dueDate) : null,
      priority: requiredData.priority as $Enums.Priority,
    },
  })
  return redirect(`./${id}`)
}

export const loader = async () => {
  const projects = await getProjectPreviews()
  return projects
}

export default function CreateTicket() {
  const actionData = useActionData<FormResponse<FormKeys>>()
  const projects = useLoaderData<typeof loader>()
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <div>
      <H1>Create a Ticket</H1>
      <Breadcrumbs paths={[`Dashboard`, `Test`]}/>
      <Form method="post" encType='multipart/form-data'>
        <Stack direction={`column`} spacing={`16px`}>
          <Paper>
            <Stack direction={`column`} spacing={`16px`}>
              <Stack direction={`column`} spacing={`16px`} padding={`24px`}>
                {projects.length === 0 ?
                  <Alert color="error">No Projects Found! Create a project before creating a ticket.</Alert>
                  :
                  <FormControl fullWidth>
                    <InputLabel id='project-label'>Project</InputLabel>
                    <Select<number>
                      labelId="project-label"
                      label='Project'
                      name={formKeys.projectId}
                      defaultValue={projects[0].id}
                    >
                      {projects.map(project => {
                        return (
                          <MenuItem key={project.id} value={project.id}>{project.title}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                }
                <TextField required name={formKeys.title} label='Title'/>
                <TextField
                  name={formKeys.content}
                  label='Description'
                  placeholder="Add more info about the issue..."
                  multiline
                  rows={8}/>
              </Stack>
              <ExtraDetailsContainer direction={`row`} spacing={`16px`} padding={`24px`}>
                <DatePicker name={formKeys.dateCreated} fullWidth label='Date Created' defaultValue={new Date()}/>
                <DatePicker name={formKeys.dueDate} fullWidth label='Due Date'/>
                <FormControl fullWidth>
                  <InputLabel id='priority-label'>Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    label='priority'
                    name={formKeys.priority}
                    defaultValue={$Enums.Priority.low}
                  >
                    {Object.keys($Enums.Priority).map(key => {
                      return (
                        <MenuItem key={key} value={key}>{key}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </ExtraDetailsContainer>
            </Stack>
          </Paper>
          <Stack direction={`row`} spacing={`16px`} justifyContent={`flex-end`}>
            <Button type="submit" disabled={projects.length === 0}>Create</Button>
          </Stack>
        </Stack>
      </Form>
    </div>
  )
}

const ExtraDetailsContainer = emotionStyled(Stack)(props => ({
  background: props.theme.color.content.secondaryBackground,
}))