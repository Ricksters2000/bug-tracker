import {Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import React from 'react';
import {DeleteIcon} from '~/assets/icons/DeleteIcon';
import {UserIcon} from '~/assets/icons/UserIcon';
import {UserPublic} from '~/server/db/userDb';

type Props = {
  className?: string;
  users: Array<UserPublic>;
  onDelete?: (userId: number) => void;
}

export const UserList: React.FC<Props> = (props) => {
  const {className, users, onDelete} = props
  return (
    <List className={className}>
      {users.map(user => {
        return (
          <ListItem
            key={user.id}
            secondaryAction={onDelete && (
              <IconButton
                edge="end"
                onClick={() => onDelete(user.id)}
              >
                <DeleteIcon/>
              </IconButton>
            )}
          >
            <ListItemAvatar>
              <Avatar>
                <UserIcon/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${user.firstName} ${user.lastName}`}
              secondary={user.role}
            />
          </ListItem>
        )
      })}
    </List>
  )
}