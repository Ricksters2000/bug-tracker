import emotionStyled from "@emotion/styled";
import {useFetcher} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {H1} from "~/typography";
import {$Enums, Prisma} from "@prisma/client";
import {ActionFunction, redirect} from "@remix-run/node";
import {Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField} from "@mui/material";
import {DatePicker} from "~/components/DatePicker";

export const action: ActionFunction = async ({request}) => {
  console.log(`w:`, request)
  const formData = await request.formData()
  console.log(`data:`, formData)
  // const project: Prisma.ProjectCreateInput
  // return redirect(`/projects/1`)
}

export default function CreateProject() {
  const fetcher = useFetcher()
  
  return (
    <div>
      <H1>Create a new project</H1>
      <Breadcrumbs paths={[`Dashboard`, `Test`]}/>
      <fetcher.Form method="post" encType='multipart/form-data'>
        <Stack direction={`column`} spacing={`16px`}>
          <Paper>
            <Stack direction={`column`} spacing={`16px`}>
              <Stack direction={`column`} spacing={`16px`} padding={`24px`}>
                <TextField required name="title" label='Title'/>
                <TextField name="description" label='Description' multiline/>
              </Stack>
              <ExtraDetailsContainer direction={`row`} spacing={`16px`} padding={`24px`}>
                <DatePicker fullWidth label='Date Created' defaultValue={new Date()}/>
                <DatePicker fullWidth label='Due Date'/>
                <FormControl fullWidth>
                  <InputLabel id='priority-label'>Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    label='priority'
                    name='priority'
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
      </fetcher.Form>
    </div>
  )
}

const ExtraDetailsContainer = emotionStyled(Stack)(props => ({
  background: props.theme.color.content.secondaryBackground,
}))