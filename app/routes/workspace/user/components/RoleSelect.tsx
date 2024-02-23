import emotionStyled from '@emotion/styled';
import {FormControl, FormHelperText, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Paper, Select} from '@mui/material';
import {UserRole} from '@prisma/client';
import React from 'react';
import {CheckIcon} from '~/assets/icons/CheckIcon';
import {objectKeys} from '~/utils/objectKeys';
import {roleDescriptions} from '../utils/roleDescriptions';

type Props = {
  name?: string;
  value?: UserRole;
  error?: string | null;
  onChange?: (userRole: UserRole) => void;
}

const defaultRole = UserRole.submitter
export const RoleSelect: React.FC<Props> = (props) => {
  const {name, value, error, onChange} = props
  const [displayedRoleInfo, setDisplayedRoleInfo] = React.useState<UserRole>(defaultRole)

  const RoleInformation = (
    <List dense>
      {roleDescriptions.map((roleDescription, i) => {
        const hasPermission = roleDescription.roles.includes(displayedRoleInfo)
        return (
          <ListItem key={`${roleDescription.description}-${i}`}>
            <ListItemIcon sx={{minWidth: 32}}>
              <ItemIcon disabled={!hasPermission}/>
            </ListItemIcon>
            <RoleText primary={roleDescription.description} disabled={!hasPermission}/>
          </ListItem>
        )
      })}
    </List>
  )

  const onChangeRole = (newRole: UserRole) => {
    setDisplayedRoleInfo(newRole)
    if (onChange) {
      onChange(newRole)
    }
  }
  
  return (
    <Root>
      <FormControl sx={{flex: 1}} error={!!error}>
        <InputLabel id='role-label'>Role</InputLabel>
        <Select
          labelId='role-label'
          label="Role"
          name={name}
          value={value}
          defaultValue={defaultRole}
          error={!!error}
          onChange={(evt) => {
            const newRole = evt.target.value as UserRole
            onChangeRole(newRole)
          }}
        >
          {objectKeys(UserRole).map(userRole => {
            return (
              <MenuItem
                key={userRole}
                value={userRole}
                onMouseEnter={() => setDisplayedRoleInfo(userRole)}
              >
                {userRole}
              </MenuItem>
            )
          })}
        </Select>
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
      <Paper sx={{flex: 1}}>
        <List dense>
          {RoleInformation}
        </List>
      </Paper>
    </Root>
  )
}

const Root = emotionStyled.div({
  display: `flex`,
  gap: 40,
})

const ItemIcon = emotionStyled(CheckIcon)<{disabled?: boolean}>(props => ({
  fill: props.disabled ? `#000` : `rgb(116 216 170)`,
  opacity: props.disabled ? 0.25 : 1,
}))

const RoleText = emotionStyled(ListItemText)<{disabled?: boolean}>(props => ({
  color: props.disabled ? `#000` : `rgb(116 216 170)`,
  fontWeight: 700,
  opacity: props.disabled ? 0.4 : 1,
  textDecoration: props.disabled ? `line-through`: ``,
}))