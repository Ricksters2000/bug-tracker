import emotionStyled from '@emotion/styled';
import {Button, Divider, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Stack, TextField} from '@mui/material';
import {Priority} from '@prisma/client';
import {Form} from '@remix-run/react';
import React from 'react';
import {DatePicker} from '~/components/input/DatePicker';
import {ProjectInfo} from '~/server/db/projectDb';
import {FormErrors} from '~/types/Response';
import {UserSelect} from '../../components/UserSelect';
import {UserList} from '../../components/UserList';
import {useAppContext} from '../../AppContext';

export const projectFormKeys = {
  title: `title`,
  description: `description`,
  dateCreated: `dateCreated`,
  dueDate: `dueDate`,
  users: `users`,
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
  const assignedUserIds = project?.assignedUsers.map(user => user.id)
  const [selectedUserIds, setSelectedUserIds] = React.useState<Array<number>>(assignedUserIds ?? [])
  const [priority, setPriority] = React.useState<Priority>(project?.priority ?? Priority.low)
  const {allUsers} = useAppContext()

  const reset = () => {
    if (!project) return
    setSelectedUserIds(project.assignedUsers.map(user => user.id))
    setPriority(project.priority)
  }

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
              <TextField name={projectFormKeys.description} defaultValue={project?.description} label='Description' multiline rows={5}/>
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
                  error={!!errors?.priority}
                  value={priority}
                  onChange={(evt) => {
                    setPriority(evt.target.value as Priority)
                  }}
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
                <input name={projectFormKeys.users} type="hidden" value={selectedUserIds.map(id => id.toString())}/>
              </Stack>
          </Stack>
        </Paper>
        <Stack direction={`row`} spacing={`16px`} justifyContent={`flex-end`}>
          {project && <Button type='reset' variant='contained' color='error' onClick={reset}>Reset</Button>}
          <Button type="submit">{project ? `Save` : `Create`}</Button>
        </Stack>
      </Stack>
    </Form>
  )
}

const ExtraDetailsContainer = emotionStyled(Stack)(props => ({
  background: props.theme.color.content.secondaryBackground,
}))