import React from 'react';
import {useAppContext} from '../../AppContext';
import {H1, H6, SmallText} from '~/typography';
import {Breadcrumbs} from '~/components/Breadcrumbs';
import emotionStyled from '@emotion/styled';
import {Avatar, Box, Button, ButtonGroup, Grid, Paper, Stack} from '@mui/material';
import {UserIcon} from '~/assets/icons/UserIcon';
import {getUserFullNameFromUser} from '~/utils/getUserFullNameFromUser';
import {RoleSelect} from '../components/RoleSelect';
import {UserRole} from '@prisma/client';
import {RightArrowIcon} from '~/assets/icons/RightArrowIcon';
import {useFetcher} from '@remix-run/react';
import {ActionFunction} from '@remix-run/node';
import {db} from '~/server/db/db';
import {isEmptyObject} from '~/utils/isEmptyObject';

export const action: ActionFunction = async ({request}) => {
  const changedRoles = await request.json() as Record<number, UserRole>
  await db.$transaction(Object.keys(changedRoles).map(key => {
    const userId = parseInt(key)
    return db.user.update({
      where: {id: userId},
      data: {
        role: changedRoles[userId],
      }
    })
  }))
  return `success`
}

export default function UserRoles() {
  const {allUsers} = useAppContext()
  const [changedRoles, setChangedRoles] = React.useState<Record<number, UserRole>>({})
  const fetcher = useFetcher()

  const resetChangedRoles = () => {
    setChangedRoles({})
  }

  const saveChangedRoles = () => {
    if (isEmptyObject(changedRoles)) return
    fetcher.submit(changedRoles, {
      method: `post`,
      encType: `application/json`,
    })
    setChangedRoles({})
  }

  return (
    <div>
      <H1>Member Roles</H1>
      <Breadcrumbs currentLinkTitle='Member Roles'/>
      <ButtonGroup sx={{marginBottom: `16px`}}>
        <Button color='error' onClick={resetChangedRoles}>Reset</Button>
        <Button onClick={saveChangedRoles} disabled={isEmptyObject(changedRoles)}>Save</Button>
      </ButtonGroup>
      <Grid container spacing={2}>
        {allUsers.map(user => {
          const changedRole = changedRoles[user.id]
          return (
            <Grid key={user.id} item xs={2}>
              <Paper>
                <Stack padding={2} gap={2}>
                  <Box display={`flex`} gap={`16px`}>
                    <Avatar>
                      <UserIcon/>
                    </Avatar>
                    <Stack>
                      <H6 style={{margin: 0}}>{getUserFullNameFromUser(user)}</H6>
                      <RoleWrapper>
                        <RoleText isOldRole={!!changedRole}>{user.role}</RoleText>
                        {changedRole && (
                          <>
                            <RightArrowIcon sx={{width: `.8em`, fontSize: `1.3em`}}/>
                            <RoleText>{changedRole}</RoleText>
                          </>
                        )}
                      </RoleWrapper>
                    </Stack>
                  </Box>
                  <RoleSelect
                    displayRoleInfoAsPopup
                    value={changedRole ?? user.role}
                    onChange={(newRole => {
                      setChangedRoles(prevChangedRoles => {
                        if (newRole === user.role) {
                          const {[user.id]: removedRole ,...rest} = prevChangedRoles
                          return rest
                        }
                        return {
                          ...prevChangedRoles,
                          [user.id]: newRole
                        }
                      })
                    })}
                  />
                </Stack>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}

const RoleWrapper = emotionStyled.span({
  display: `inline-flex`,
  gap: 5,
  alignItems: `center`,
})

const RoleText = emotionStyled(SmallText)<{isOldRole?: boolean}>(props => ({
  ...(props.isOldRole ? {
    color: props.theme.color.content.danger,
    textDecoration: `line-through`,
    textDecorationThickness: 1,
  } : {})
})).withComponent(`span`)

// const RoleText = emotionStyled(SmallText)<{newRole?: string}>(props => ({
//   ...(props.newRole ? {
//     color: props.theme.color.content.danger,
//     textDecoration: `line-through`,
//     '::after': {
//       content: `" —> ${props.newRole}"`,
//       color: props.theme.color.content.info,
//       display: `inline-block`,
//       marginLeft: 5,
//     }
//   } : {})
// }))