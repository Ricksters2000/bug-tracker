import React from "react";
import emotionStyled from "@emotion/styled";
import {Form, useActionData, useFetcher, useSearchParams} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {H1} from "~/typography";
import {$Enums} from "@prisma/client";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {Alert, Button, Divider, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Stack, TextField} from "@mui/material";
import {DatePicker} from "~/components/input/DatePicker";
import {getDataFromFormAsObject} from "~/utils/getDataFromFormAsObject";
import {createFormResponseFromData} from "~/utils/createFormResponseFromData";
import {db} from "~/server/db/db";
import {FormErrors, FormResponse} from "~/types/Response";
import {ProjectOption} from "~/server/db/projectDb";
import {objectKeys} from "~/utils/objectKeys";
import {UserSelect} from "../../components/UserSelect";
import {useAppContext} from "../../AppContext";
import {UserList} from "../../components/UserList";

const formKeys = {
  companyId: `companyId`,
  projectId: `projectId`,
  title: `title`,
  content: `content`,
  dateCreated: `dateCreated`,
  dueDate: `dueDate`,
  users: `users`,
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
      companyId: requiredData.companyId,
      content: requiredData.content,
      createdDate: new Date(requiredData.dateCreated),
      dueDate: requiredData.dueDate ? new Date(requiredData.dueDate) : null,
      priority: requiredData.priority as $Enums.Priority,
      assignedUsers: requiredData.users ? {
        connect: requiredData.users.split(`,`).map(id => ({id: parseInt(id)})),
      } : undefined,
    },
  })
  return redirect(`../../project/${requiredData.projectId}/ticket/${id}`)
}

export default function CreateTicket() {
  const {currentUser, allUsers} = useAppContext()
  const actionData = useActionData<FormResponse<RequiredKeys>>()
  const fetcher = useFetcher<Array<ProjectOption>>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedUserIds, setSelectedUserIds] = React.useState<Array<number>>([])
  let projects: Array<ProjectOption> = []
  let errors: FormErrors<RequiredKeys> | undefined

  React.useEffect(() => {
    fetcher.submit({companyId: currentUser.company.id}, {
      method: `post`,
      encType: `application/json`,
      action: `/api/get-project-options`,
    })
  }, [])

  if (actionData && !actionData.success) {
    errors = actionData.errors
  }

  if (fetcher.data) {
    projects = fetcher.data
  }

  return (
    <div>
      <H1>Create a Ticket</H1>
      <Breadcrumbs currentLinkTitle="Create"/>
      <Form method="post" encType='multipart/form-data'>
        <Stack direction={`column`} spacing={`16px`}>
          <Paper>
            <Stack direction={`column`} spacing={`16px`}>
              <Stack direction={`column`} gap={`16px`} padding={`24px`}>
                <input type="hidden" name={formKeys.companyId} value={currentUser.company.id}/>
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
              <Stack padding={`24px`}>
                <UserSelect 
                  label="Assign Users"
                  selectedUserIds={selectedUserIds}
                  onChange={(id) => {
                    setSelectedUserIds(prev => {
                      if (prev.includes(id)) {
                        return prev.filter(userId => userId !== id)
                      }
                      return [...prev, id]
                    })
                  }}
                />
                <Divider sx={{marginTop: `8px`}}/>
                <UserList
                  users={allUsers.filter(user => selectedUserIds.includes(user.id))}
                  onDelete={(userId) => setSelectedUserIds(prev => prev.filter(id => id !== userId))}
                />
                <input name={formKeys.users} type="hidden" value={selectedUserIds.map(id => id.toString())}/>
              </Stack>
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