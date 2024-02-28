import React from "react";
import emotionStyled from "@emotion/styled";
import {Button, Stack, TextField} from "@mui/material";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {Form, useActionData, useRouteError} from "@remix-run/react";
import {AuthCard} from "~/components/cards/AuthCard";
import {PasswordField} from "~/components/input/PasswordField";
import {isEmptyString} from "~/utils/isEmptyString";
import {db} from "~/server/db/db";
import {$Enums} from "@prisma/client";
import {FormErrors, FormResponse} from "~/types/Response";
import {formatPrismaError} from "~/utils/formatPrismaError";
import {getDataFromFormAsObject} from "~/utils/getDataFromFormAsObject";
import {createFormResponseFromData} from "~/utils/createFormResponseFromData";
import {objectKeys} from "~/utils/objectKeys";

const formKeys = {
  firstName: `firstName`,
  lastName: `lastName`,
  emailAddress: `emailAddress`,
  password: `password`,
  confirmPassword: `confirmPassword`,
  companyName: `companyName`,
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
  const {firstName, lastName, emailAddress, password, companyName} = data as Record<FormKeys, string>
  try {
    const {id} = await db.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: emailAddress,
        password: password,
        role: $Enums.UserRole.admin,
        company: {
          create: {
            name: companyName,
          },
        },
      },
      select: {
        id: true,
      }
    })
    userId = id
  } catch (err: any) {
    // @todo handle duplicate user better
    throw new Error(`${formatPrismaError(err, `User with`)}`)
  }
  return redirect(`/workspace/${userId}`)
}

export default function Register() {
  const actionData = useActionData<FormResponse<FormKeys>>();
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null)
  const [passwordError, setPasswordError] = React.useState<string | null>(null)
  const errorMessage = useRouteError() as string | undefined

  const onPasswordBlur = () => {
    const passwordEl = passwordRef.current
    const confirmPasswordEl = confirmPasswordRef.current
    if (!passwordEl || !confirmPasswordEl) {
      return
    }
    const password = passwordEl.value
    const confirmPassword = confirmPasswordEl.value
    if (isEmptyString(password) || isEmptyString(confirmPassword)) {
      return
    }
    if (password !== confirmPassword) {
      setPasswordError(`Passwords do not match`)
      return
    }
    setPasswordError(null)
  }

  let errors: FormErrors<FormKeys> | null = null
  if (actionData && !actionData.success) {
    errors = actionData.errors
  }

  return (
    <AuthCard
      title="Create Account"
      footerText="Have an account? Go to login"
      footerLink="../login"
      errorMessage={errorMessage}
    >
      <Form method="post" encType='multipart/form-data'>
        <Stack spacing={2}>
          <Stack flexDirection={`row`} gap={3}>
            <TextField
              fullWidth
              required
              label='First name'
              name={formKeys.firstName}
              error={!!errors?.firstName}
              helperText={errors?.firstName}/>
            <TextField
              fullWidth
              required
              label='Last name'
              name={formKeys.lastName}
              error={!!errors?.lastName}
              helperText={errors?.lastName}/>
          </Stack>
          <TextField
            required
            name={formKeys.emailAddress}
            type="email"
            label='Email address'
            error={!!errors?.emailAddress}
            helperText={errors?.emailAddress}/>
          <TextField
            required
            name={formKeys.companyName}
            label='Company Name'
            error={!!errors?.companyName}
            helperText={errors?.companyName}/>
          <Stack flexDirection={`row`} gap={3}>
            <PasswordField
              fullWidth
              required
              inputRef={passwordRef}
              onBlur={onPasswordBlur}
              name={formKeys.password}
              label="Password"
              error={!!errors?.password}
              helperText={errors?.password ?? undefined}/>
            <PasswordField
              fullWidth
              required
              error={!!passwordError}
              inputRef={confirmPasswordRef}
              onBlur={onPasswordBlur}
              name={formKeys.confirmPassword}
              label="Confirm Password"
              helperText={passwordError ?? undefined}/>
          </Stack>
          <Button type="submit" disabled={!!passwordError}>Create Account</Button>
        </Stack>
      </Form>
    </AuthCard>
  )
}