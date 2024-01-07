import emotionStyled from "@emotion/styled";
import {Button, FormControl, Input, InputLabel, OutlinedInput, Stack, TextField} from "@mui/material";
import {ActionFunction, redirect} from "@remix-run/node";
import {Form} from "@remix-run/react";
import {AuthCard} from "~/components/cards/AuthCard";
import {PasswordField} from "~/components/input/PasswordField";

export const action: ActionFunction = () => {
  return redirect(``)
}

export default function Register() {
  return (
    <AuthCard
      title="Create Account"
      footerText="Have an account? Go to login"
      footerLink="../login"
    >
      <Form>
        <Stack spacing={2}>
          <Stack flexDirection={`row`} gap={3}>
            <TextField fullWidth label='First name'/>
            <TextField fullWidth label='Last name'/>
          </Stack>
          <TextField label='Email address'/>
          <Stack flexDirection={`row`} gap={3}>
            <PasswordField fullWidth label="Password"/>
            <PasswordField fullWidth label="Confirm Password"/>
          </Stack>
          <Button type="submit">Create Account</Button>
        </Stack>
      </Form>
    </AuthCard>
  )
}