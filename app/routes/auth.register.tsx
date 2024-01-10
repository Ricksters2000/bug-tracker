import React from "react";
import emotionStyled from "@emotion/styled";
import {Button, FormControl, Input, InputLabel, OutlinedInput, Stack, TextField} from "@mui/material";
import {ActionFunction, redirect} from "@remix-run/node";
import {Form} from "@remix-run/react";
import {AuthCard} from "~/components/cards/AuthCard";
import {PasswordField} from "~/components/input/PasswordField";
import {isEmptyString} from "~/utils/isEmptyString";

const formKeys = {
  firstName: `firstName`,
  lastName: `lastName`,
  emailAddress: `emailAddress`,
  password: `password`,
  confirmPassword: `confirmPassword`,
}

export const action: ActionFunction = () => {
  return redirect(``)
}

export default function Register() {
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

  return (
    <AuthCard
      title="Create Account"
      footerText="Have an account? Go to login"
      footerLink="../login"
    >
      <Form>
        <Stack spacing={2}>
          <Stack flexDirection={`row`} gap={3}>
            <TextField fullWidth required name={formKeys.firstName} label='First name'/>
            <TextField fullWidth required name={formKeys.lastName} label='Last name'/>
          </Stack>
          <TextField required name={formKeys.emailAddress} type="email" label='Email address'/>
          <Stack flexDirection={`row`} gap={3}>
            <PasswordField
              fullWidth
              required
              inputRef={passwordRef}
              onBlur={onPasswordBlur}
              name={formKeys.password}
              label="Password"/>
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