import emotionStyled from "@emotion/styled";
import {Form, useActionData} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {H1} from "~/typography";
import {$Enums, Prisma} from "@prisma/client";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField} from "@mui/material";
import {DatePicker} from "~/components/input/DatePicker";
import {getDataFromFormAsObject} from "~/utils/getDataFromFormAsObject";
import {createFormResponseFromData} from "~/utils/createFormResponseFromData";
import {db} from "~/server/db/db";
import {FormResponse} from "~/types/Response";

const formKeys = {
  title: `title`,
  description: `description`,
  dateCreated: `dateCreated`,
  dueDate: `dueDate`,
  // users: `users`,
  priority: `priority`,
}

type FormKeys = keyof typeof formKeys

const requiredKeys = {
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
  const {id} = await db.project.create({
    select: {
      id: true,
    },
    data: {
      title: requiredData.title,
      description: requiredData.description,
      createdDate: new Date(requiredData.dateCreated),
      dueDate: requiredData.dueDate ? new Date(requiredData.dueDate) : null,
      priority: requiredData.priority as $Enums.Priority,
    },
  })
  return redirect(`./${id}`)
}

export default function CreateProject() {
  const actionData = useActionData<FormResponse<FormKeys>>()
  return (
    <div>
      <H1>Create a new project</H1>
      <Breadcrumbs paths={[`Dashboard`, `Test`]}/>
      <Form method="post" encType='multipart/form-data'>
        <Stack direction={`column`} spacing={`16px`}>
          <Paper>
            <Stack direction={`column`} spacing={`16px`}>
              <Stack direction={`column`} spacing={`16px`} padding={`24px`}>
                <TextField required name={formKeys.title} label='Title'/>
                <TextField name={formKeys.description} label='Description' multiline maxRows={5}/>
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
            <Button type="submit">Create</Button>
          </Stack>
        </Stack>
      </Form>
    </div>
  )
}

const ExtraDetailsContainer = emotionStyled(Stack)(props => ({
  background: props.theme.color.content.secondaryBackground,
}))