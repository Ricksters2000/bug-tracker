import emotionStyled from '@emotion/styled';
import {Avatar, Box, Stack} from '@mui/material';
import React from 'react';
import {UserIcon} from '~/assets/icons/UserIcon';
import {CommentPublic} from '~/server/db/commentDb';
import {BodyText, H6, InformationalText} from '~/typography';

type Props = {
  comment: CommentPublic;
}

export const Comment: React.FC<Props> = (props) => {
  const {user, dateSent, message} = props.comment
  return (
    <Box display={`flex`} gap={1} paddingTop={`24px`}>
      <Avatar>
        <UserIcon/>
      </Avatar>
      <TextContainer>
        <InformationalText>{dateSent.toDateString()}</InformationalText>
        <H6>{`${user.firstName} ${user.lastName}`}</H6>
        <BodyText>{message}</BodyText>
      </TextContainer>
    </Box>
  )
}

const TextContainer = emotionStyled(Stack)(props => ({
  paddingBottom: 24,
  borderBottom: `1px solid ${props.theme.color.content.divider}`,
  flex: 1,
}))