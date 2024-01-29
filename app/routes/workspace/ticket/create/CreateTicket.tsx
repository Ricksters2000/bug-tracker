import emotionStyled from "@emotion/styled";
import {Form, useActionData, useLoaderData, useSearchParams} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {H1} from "~/typography";
import {$Enums, Prisma} from "@prisma/client";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {Alert, Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Stack, TextField} from "@mui/material";
import {DatePicker} from "~/components/input/DatePicker";
import {getDataFromFormAsObject} from "~/utils/getDataFromFormAsObject";
import {createFormResponseFromData} from "~/utils/createFormResponseFromData";
import {db} from "~/server/db/db";
import {FormErrors, FormResponse} from "~/types/Response";
import {findProjectPreviews} from "~/server/db/projectDb";
import {objectKeys} from "~/utils/objectKeys";

const formKeys = {
  projectId: `projectId`,
  title: `title`,
  content: `content`,
  dateCreated: `dateCreated`,
  dueDate: `dueDate`,
  // users: `users`,
  priority: `priority`,
}

const requiredKeys = {
  projectId: null,
  title: null,
  priority: null,
  dateCreated: null,
}

type FormKeys = keyof typeof formKeys
type RequiredKeys = keyof typeof requiredKeys

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData()
  const data = getDataFromFormAsObject(formData, formKeys)
  const formResponse = createFormResponseFromData(data, objectKeys(requiredKeys))
  if (!formResponse.success) {
    return json(formResponse)
  }
  const requiredData = data as Record<RequiredKeys, string> & Record<FormKeys, string | undefined>
  const {id} = await db.ticket.create({
    select: {
      id: true,
    },
    data: {
      title: requiredData.title,
      projectId: requiredData.projectId,
      content: requiredData.content,
      createdDate: new Date(requiredData.dateCreated),
      dueDate: requiredData.dueDate ? new Date(requiredData.dueDate) : null,
      priority: requiredData.priority as $Enums.Priority,
      // assignedUsers: {
      //   connect: [{id: 1}]
      // }
    },
  })
  return redirect(`../ticket/${id}`)
}

export const loader = async () => {
  const projects = await findProjectPreviews()
  return projects
}

export default function CreateTicket() {
  const actionData = useActionData<FormResponse<RequiredKeys>>()
  const projects = useLoaderData<typeof loader>()
  const [searchParams, setSearchParams] = useSearchParams()
  let errors: FormErrors<RequiredKeys> | undefined
  if (actionData && !actionData.success) {
    errors = actionData.errors
  }
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
                    <Select<string>
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
                <TextField
                  name={formKeys.title}
                  label='Title'
                  error={!!errors?.title}
                  helperText={errors?.title}/>
                <TextField
                  name={formKeys.content}
                  label='Description'
                  placeholder="Add more info about the issue..."
                  multiline
                  rows={8}/>
              </Stack>
              <ExtraDetailsContainer direction={`row`} spacing={`16px`} padding={`24px`}>
                <DatePicker
                  name={formKeys.dateCreated}
                  fullWidth
                  label='Date Created'
                  defaultValue={new Date()}
                  error={!!errors?.dateCreated}
                  helperText={errors?.dateCreated}/>
                <DatePicker name={formKeys.dueDate} fullWidth label='Due Date'/>
                <FormControl fullWidth>
                  <InputLabel id='priority-label' error={!!errors?.priority}>
                    Priority
                  </InputLabel>
                  <Select
                    labelId="priority-label"
                    label='priority'
                    name={formKeys.priority}
                    defaultValue={$Enums.Priority.low}
                    error={!!errors?.priority}
                  >
                    {Object.keys($Enums.Priority).map(key => {
                      return (
                        <MenuItem key={key} value={key}>{key}</MenuItem>
                      )
                    })}
                  </Select>
                  <FormHelperText>{errors?.priority}</FormHelperText>
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