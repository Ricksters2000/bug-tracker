import emotionStyled from "@emotion/styled";
import {FormControl, Input, InputLabel, OutlinedInput, Stack, TextField} from "@mui/material";
import {Form} from "@remix-run/react";
import {AuthCard} from "~/components/cards/AuthCard";

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
            <FormControl fullWidth variant="standard">
              <InputLabel variant="standard">Password</InputLabel>
              <Input type='password'/>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
              <OutlinedInput id="confirm-password" type='password'/>
            </FormControl>
          </Stack>
        </Stack>
      </Form>
    </AuthCard>
  )
}