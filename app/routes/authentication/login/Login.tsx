import emotionStyled from "@emotion/styled";
import {Button, Stack, TextField} from "@mui/material";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {Form, useActionData} from "@remix-run/react";
import {AuthCard} from "~/components/cards/AuthCard";
import {PasswordField} from "~/components/input/PasswordField";
import {authenticateUserWithEmailAndPassword} from "~/server/db/userDb";
import {commitSession, getSession} from "~/sessions";
import {FormErrors, FormResponse} from "~/types/Response";

const formKeys = {
  email: `email`,
  password: `password`,
}

type FormKeys = keyof typeof formKeys

export const action: ActionFunction = async ({request}) => {
  const session = await getSession(request.headers.get(`Cookie`))
  const formData = await request.formData()
  const email = formData.get(formKeys.email)?.toString()
  const password = formData.get(formKeys.password)?.toString()
  const errors: FormErrors<FormKeys> = {
    email: null,
    password: null,
  }
  if (!email || !password) {
    if (!email) {
      errors.email = `Email is required for login`
    }
    if (!password) {
      errors.password = `Password is required for login`
    }
    const errorResponse: FormResponse<FormKeys> = {
      success: false,
      errors,
    }
    return json(errorResponse)
  }
  const authData = await authenticateUserWithEmailAndPassword(email, password)
  if (!authData) {
    const errorResponse: FormResponse<FormKeys> = {
      success: false,
      errors,
      errorMessage: `Incorrect email/password`,
    }
    return json(errorResponse)
  }
  session.set(`userSessionId`, authData.sessionId)
  return redirect(`/workspace/${authData.userId}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}

export default function Login() {
  const actionData = useActionData<FormResponse<FormKeys>>()
  let errors: FormErrors<FormKeys> | undefined
  let errorMessage: string | undefined
  if (actionData && !actionData.success) {
    errors = actionData.errors
    errorMessage = actionData.errorMessage
  }
  return (
    <AuthCard
      title="Login"
      footerText="Need an account? Sign up!"
      footerLink="../register"
      errorMessage={errorMessage}
    >
      <Form method="post" encType='multipart/form-data'>
        <Stack spacing={2}>
          <TextField
            name={formKeys.email}
            type="email"
            label='Email address'
            error={!!errors?.email}
            helperText={errors?.email}/>
          <PasswordField
            name={formKeys.password}
            label="Password"
            error={!!errors?.password}
            helperText={errors?.password ?? undefined}/>
          <SubmitContainer>
            <Button type="submit" variant="contained">Login</Button>
          </SubmitContainer>
        </Stack>
      </Form>
    </AuthCard>
  )
}

const SubmitContainer = emotionStyled.div({
  display: `flex`,
  justifyContent: `flex-end`,
})