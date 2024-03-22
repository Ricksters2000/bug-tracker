import {Stack, Paper, Alert, FormControl, InputLabel, Select, MenuItem, TextField, FormHelperText, Divider, Button} from '@mui/material';
import {$Enums, UserRole} from '@prisma/client';
import {RequiredKeys} from '@prisma/client/runtime/library';
import {ActionFunction, json, redirect} from '@remix-run/node';
import {useActionData, useFetcher, useSearchParams, Form, useRouteError} from '@remix-run/react';
import React from 'react';
import {ProjectOption} from '~/server/db/projectDb';
import {FormResponse, FormErrors} from '~/types/Response';
import {H1} from '~/typography';
import {useAppContext} from '../../AppContext';
import {UserList} from '../../components/UserList';
import {UserSelect} from '../../components/UserSelect';
import {Breadcrumbs} from '~/components/Breadcrumbs';
import {PasswordField} from '~/components/input/PasswordField';
import {getDataFromFormAsObject} from '~/utils/getDataFromFormAsObject';
import {createFormResponseFromData} from '~/utils/createFormResponseFromData';
import {objectKeys} from '~/utils/objectKeys';
import {formatPrismaError} from '~/utils/formatPrismaError';
import {db} from '~/server/db/db';
import {RoleSelect} from '../components/RoleSelect';
import {canCreateAndEditUsers} from '../../utils/roles/canCreateAndEditUsers';
import {UnauthorizedAccess} from '../../components/UnauthorizedAccess';

const formKeys = {
  companyId: `companyId`,
  firstName: `firstName`,
  lastName: `lastName`,
  emailAddress: `emailAddress`,
  password: `password`,
  role: `role`,
}

type FormKeys = keyof typeof formKeys

export const action: ActionFunction = async ({request}) => {
  let userId: number
  const formData = await request.formData()
  const data = getDataFromFormAsObject(formData, formKeys)
  const formResponse = createFormResponseFromData(data, objectKeys(formKeys))
  if (!formResponse.success) {
    return json(formResponse)
  }
  const {firstName, lastName, emailAddress, password, companyId, role} = data as Record<FormKeys, string>
  try {
    const {id} = await db.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: emailAddress,
        password: password,
        role: role as UserRole,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
      select: {
        id: true,
      }
    })
    userId = id
  } catch (err: any) {
    // @todo handle duplicate user
    // throw new Error(`${formatPrismaError(err, `User with`)}`)
  }
  return redirect(`../user/roles`)
}

export default function CreateUser() {
  const {currentUser, allUsers} = useAppContext()
  const actionData = useActionData<FormResponse<FormKeys>>()
  const fetcher = useFetcher<Array<ProjectOption>>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedUserIds, setSelectedUserIds] = React.useState<Array<number>>([])
  let projects: Array<ProjectOption> = []
  let errors: FormErrors<FormKeys> | undefined

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

  if (!canCreateAndEditUsers(currentUser.role)) {
    return <UnauthorizedAccess/>
  }

  return (
    <div>
      <H1>Create a User</H1>
      <Breadcrumbs currentLinkTitle='New User'/>
      <Form method="post" encType='multipart/form-data'>
        <Stack direction={`column`} spacing={`16px`}>
          <Paper>
            <Stack direction={`column`} gap={`16px`} padding={`24px`}>
              <input type="hidden" name={formKeys.companyId} value={currentUser.company.id}/>
              <TextField
                name={formKeys.firstName}
                label='First Name'
                error={!!errors?.firstName}
                helperText={errors?.firstName}
              />
              <TextField
                name={formKeys.lastName}
                label='Last Name'
                error={!!errors?.lastName}
                helperText={errors?.lastName}
              />
              <TextField
                name={formKeys.emailAddress}
                label='Email Address'
                error={!!errors?.emailAddress}
                helperText={errors?.emailAddress}
              />
              <PasswordField
                name={formKeys.password}
                label='Password'
                error={!!errors?.password}
                helperText={errors?.password ?? undefined}
              />
              <RoleSelect
                name={formKeys.role}
                error={errors?.role}
              />
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