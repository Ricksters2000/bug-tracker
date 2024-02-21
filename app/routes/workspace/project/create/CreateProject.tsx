import emotionStyled from "@emotion/styled";
import {Form, useActionData, useMatches} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {H1} from "~/typography";
import {$Enums} from "@prisma/client";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Stack, TextField} from "@mui/material";
import {DatePicker} from "~/components/input/DatePicker";
import {getDataFromFormAsObject} from "~/utils/getDataFromFormAsObject";
import {createFormResponseFromData} from "~/utils/createFormResponseFromData";
import {db} from "~/server/db/db";
import {FormErrors, FormResponse} from "~/types/Response";
import {objectKeys} from "~/utils/objectKeys";
import {useAppContext} from "../../AppContext";

const formKeys = {
  title: `title`,
  description: `description`,
  dateCreated: `dateCreated`,
  dueDate: `dueDate`,
  // users: `users`,
  priority: `priority`,
  companyId: `companyId`,
}

const requiredKeys = {
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
    },
  })
  return redirect(`../project/${id}`)
}

export default function CreateProject() {
  const {currentUser} = useAppContext()
  const actionData = useActionData<FormResponse<RequiredKeys>>()
  let errors: FormErrors<RequiredKeys> | undefined
  if (actionData && !actionData.success) {
    errors = actionData.errors
  }
  return (
    <div>
      <H1>Create a new project</H1>
      <Breadcrumbs paths={[`Dashboard`, `Test`]}/>
      <Form method="post" encType='multipart/form-data'>
        <Stack direction={`column`} spacing={`16px`}>
          <Paper>
            <Stack direction={`column`} spacing={`16px`}>
              <Stack direction={`column`} spacing={`16px`} padding={`24px`}>
                <input type="hidden" name={formKeys.companyId} value={currentUser.company.id}/>
                <TextField
                  name={formKeys.title}
                  label='Title'
                  error={!!errors?.title}
                  helperText={errors?.title}/>
                <TextField name={formKeys.description} label='Description' multiline maxRows={5}/>
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
                  <InputLabel id='priority-label' error={!!errors?.priority}>Priority</InputLabel>
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