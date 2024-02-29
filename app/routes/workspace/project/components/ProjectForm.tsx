import emotionStyled from '@emotion/styled';
import {Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Stack, TextField} from '@mui/material';
import {Priority} from '@prisma/client';
import {Form} from '@remix-run/react';
import React from 'react';
import {DatePicker} from '~/components/input/DatePicker';
import {ProjectInfo} from '~/server/db/projectDb';
import {FormErrors} from '~/types/Response';

export const projectFormKeys = {
  title: `title`,
  description: `description`,
  dateCreated: `dateCreated`,
  dueDate: `dueDate`,
  // users: `users`,
  priority: `priority`,
  companyId: `companyId`,
}

export const projectRequiredKeys = {
  title: null,
  priority: null,
  dateCreated: null,
}

export type ProjectFormKeys = keyof typeof projectFormKeys
export type ProjectFormRequiredKeys = keyof typeof projectRequiredKeys

type Props = {
  project?: ProjectInfo;
  errors?: FormErrors<ProjectFormRequiredKeys>;
  companyId: string;
}

export const ProjectForm: React.FC<Props> = (props) => {
  const {companyId, project, errors} = props
  return (
    <Form method="post" encType='multipart/form-data'>
      <Stack direction={`column`} spacing={`16px`}>
        <Paper>
          <Stack direction={`column`} spacing={`16px`}>
            <Stack direction={`column`} spacing={`16px`} padding={`24px`}>
              <input type="hidden" name={projectFormKeys.companyId} value={companyId}/>
              <TextField
                name={projectFormKeys.title}
                label='Title'
                defaultValue={project?.title}
                error={!!errors?.title}
                helperText={errors?.title}/>
              <TextField name={projectFormKeys.description} defaultValue={project?.description} label='Description' multiline maxRows={5}/>
            </Stack>
            <ExtraDetailsContainer direction={`row`} spacing={`16px`} padding={`24px`}>
              <DatePicker
                name={projectFormKeys.dateCreated}
                fullWidth
                label='Date Created'
                defaultValue={project?.createdDate ?? new Date()}
                error={!!errors?.dateCreated}
                helperText={errors?.dateCreated}/>
              <DatePicker name={projectFormKeys.dueDate} defaultValue={project?.dueDate} fullWidth label='Due Date'/>
              <FormControl fullWidth>
                <InputLabel id='priority-label' error={!!errors?.priority}>Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  label='priority'
                  name={projectFormKeys.priority}
                  defaultValue={project?.priority ?? Priority.low}
                  error={!!errors?.priority}
                >
                  {Object.keys(Priority).map(key => {
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
          {project && <Button type='reset' variant='contained' color='error'>Reset</Button>}
          <Button type="submit">{project ? `Save` : `Create`}</Button>
        </Stack>
      </Stack>
    </Form>
  )
}

const ExtraDetailsContainer = emotionStyled(Stack)(props => ({
  background: props.theme.color.content.secondaryBackground,
}))