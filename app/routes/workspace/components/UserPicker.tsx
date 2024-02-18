import React from 'react';
import {useAppContext} from '../AppContext';
import {Avatar, Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, MenuList, Stack} from '@mui/material';
import {UserIcon} from '~/assets/icons/UserIcon';
import {BodyText, H6, SmallText} from '~/typography';
import emotionStyled from '@emotion/styled';

type Props = {
  label?: string;
  selectedUserIds: Array<number>;
  onChange: (id: number) => void;
}

export const UserPicker: React.FC<Props> = (props) => {
  const {selectedUserIds, onChange} = props
  const {allUsers} = useAppContext()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>{props.label ?? `User`}</Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth PaperProps={{
        sx: {height: `90vh`}
      }}>
        <DialogTitle>
          Users
        </DialogTitle>
        <DialogContent>
          <MenuList>
            {allUsers.map(user => {
              return (
                <MenuItem
                  key={user.id}
                  selected={selectedUserIds.includes(user.id)}
                  onClick={() => onChange(user.id)}
                >
                  <Box display={`flex`} gap={`16px`}>
                    <Avatar>
                      <UserIcon/>
                    </Avatar>
                    <Stack>
                      <H6 style={{marginBottom: 0}}>{`${user.firstName} ${user.lastName}`}</H6>
                      <RoleText>{user.role}</RoleText>
                    </Stack>
                  </Box>
                </MenuItem>
              )
            })}
          </MenuList>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const RoleText = emotionStyled(SmallText)({
  textTransform: `capitalize`,
})