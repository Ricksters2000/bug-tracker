import emotionStyled from "@emotion/styled";
import {Form} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {H1} from "~/typography";
import {$Enums, Prisma} from "@prisma/client";
import {ActionFunction, redirect} from "@remix-run/node";
import {Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField} from "@mui/material";
import {DatePicker} from "~/components/DatePicker";

const formKeys = {
  title: `title`,
  description: `description`,
  dateCreated: `dateCreated`,
  dueDate: `dueDate`,
  users: `users`,
  priority: `priority`,
}

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData()
  console.log(`data:`, formData.append(`w`, JSON.stringify([1])))
  // const project: Prisma.ProjectCreateInput
  // return redirect(`/projects/1`)
  return null
}

export default function CreateProject() {
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
                <TextField name={formKeys.description} label='Description' multiline/>
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
                    defaultValue={$Enums.Priority.Low}
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