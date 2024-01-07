import emotionStyled from "@emotion/styled";
import {Button, FormControl, Input, InputLabel, Stack, TextField} from "@mui/material";
import {Form} from "@remix-run/react";
import {AuthCard} from "~/components/cards/AuthCard";
import {PasswordField} from "~/components/input/PasswordField";

const formKeys = {
  email: `email`,
  password: `password`,
}

export default function Login() {
  return (
    <AuthCard
      title="Login"
      footerText="Need an account? Sign up!"
      footerLink="../register"
    >
      <Form>
        <Stack spacing={2}>
          <TextField name={formKeys.email} label='Email address'/>
          <PasswordField name={formKeys.password} label="Password"/>
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