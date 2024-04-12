import {Button, ButtonOwnProps, Grid, Paper, Typography} from '@mui/material';
import {ActionFunction, redirect} from '@remix-run/node';
import {Form} from '@remix-run/react';
import React from 'react';
import {DemoUserKey, demoUsers} from './demoUsers';
import {authenticateUserWithEmailAndPassword} from '~/server/db/userDb';
import {commitSession, getSession} from '~/sessions';

const demoUserKey = `demoUserKey`

export const action: ActionFunction = async ({request}) => {
  const session = await getSession(request.headers.get(`Cookie`))
  const formData = await request.formData()
  const userKey = formData.get(demoUserKey) as DemoUserKey | null
  if (!userKey) throw new Error(`Unexpected user key not found from formData`)
  const {email, password} = demoUsers[userKey]
  const authData = await authenticateUserWithEmailAndPassword(email, password)
  if (!authData) throw new Error(`Demo user data not found from key: ${demoUserKey}`)
  session.set(`userSessionId`, authData.sessionId)
  return redirect(`/workspace/${authData.userId}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}

export default function PreviewLogin() {
  const createButtonItem = (label: string, demoUserKeyAccount: DemoUserKey, color?: ButtonOwnProps[`color`]) => (
    <Grid item xs={12}>
      <Form method='post'>
        <input type='hidden' name={demoUserKey} value={demoUserKeyAccount}/>
        <Button fullWidth color={color} type='submit' variant='contained' sx={{fontWeight: 700}}>{label}</Button>
      </Form>
    </Grid>
  )

  return (
    <Paper sx={{padding: `1.5rem`}}>
      <Typography variant='h4' textAlign={`center`} fontWeight={700} marginBottom={`1rem`}>Login As Demo User</Typography>
      <Grid container spacing={2}>
        {createButtonItem(`Admin`, `admin`, `error`)}
        {createButtonItem(`Project Manager`, `projectManager`, `info`)}
        {createButtonItem(`Developer`, `developer`, `secondary`)}
        {createButtonItem(`Submitter`, `submitter`, `warning`)}
      </Grid>
    </Paper>
  )
}