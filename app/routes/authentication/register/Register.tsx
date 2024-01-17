import React from "react";
import emotionStyled from "@emotion/styled";
import {Button, Stack, TextField} from "@mui/material";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {Form, useActionData} from "@remix-run/react";
import {AuthCard} from "~/components/cards/AuthCard";
import {PasswordField} from "~/components/input/PasswordField";
import {isEmptyString} from "~/utils/isEmptyString";
import {db} from "~/server/db/db";
import {$Enums} from "@prisma/client";
import {FormErrors, FormResponse} from "~/types/Response";
import {formatPrismaError} from "~/utils/formatPrismaError";

const formKeys = {
  firstName: `firstName`,
  lastName: `lastName`,
  emailAddress: `emailAddress`,
  password: `password`,
  confirmPassword: `confirmPassword`,
}

type FormKeys = keyof typeof formKeys

export const action: ActionFunction = async ({request}) => {
  let userId: number
  const data = await request.formData()
  const firstName = data.get(formKeys.firstName)
  const lastName = data.get(formKeys.lastName)
  const email = data.get(formKeys.emailAddress)
  const password = data.get(formKeys.password)

  const errors: FormErrors<FormKeys> = {
    firstName: null,
    lastName: null,
    emailAddress: null,
    password: null,
    confirmPassword: null,
  }

  if (!firstName || !lastName || !email || !password) {
    if (!firstName) {
      errors.firstName = `First name is required to create user.`
    }
    if (!lastName) {
      errors.lastName = `Last name is required to create user.`
    }
    if (!email) {
      errors.emailAddress = `Email is required to create user.`
    }
    if (!password) {
      errors.password = `Password is required to create user.`
    }
    const response: FormResponse<FormKeys> = {
      success: false,
      errors,
    }
    return json(response)
  }
  try {
    const {id} = await db.user.create({
      data: {
        firstName: firstName.toString(),
        lastName: lastName.toString(),
        email: email.toString(),
        password: password.toString(),
        role: $Enums.UserRole.admin,
      },
      select: {
        id: true,
      }
    })
    userId = id
  } catch (err: any) {
    const response: FormResponse<FormKeys> = {
      success: false,
      errors,
      errorMessage: formatPrismaError(err, `User with`),
    }
    return json(response)
  }
  return redirect(`/workspace/${userId}`)
}

export default function Register() {
  const actionData = useActionData<FormResponse<FormKeys>>();
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null)
  const [passwordError, setPasswordError] = React.useState<string | null>(null)

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
  let errorMessage: string | undefined
  if (actionData && !actionData.success) {
    errors = actionData.errors
    errorMessage = actionData.errorMessage
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