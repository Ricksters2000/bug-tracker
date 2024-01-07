import emotionStyled from "@emotion/styled";
import {Button, FormControl, Input, InputLabel, Stack, TextField} from "@mui/material";
import {Form} from "@remix-run/react";
import {AuthCard} from "~/components/cards/AuthCard";

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
          <TextField variant="standard" name={formKeys.email} label='Email address'/>
          <FormControl variant="standard">
            <InputLabel variant="standard">Password</InputLabel>
            <Input type='password' name={formKeys.password}/>
          </FormControl>
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