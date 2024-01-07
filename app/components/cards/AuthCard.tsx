import React from 'react';
import emotionStyled from '@emotion/styled';
import {Paper, Stack} from '@mui/material';
import {A, H3} from '~/typography';

type Props = {
  title: string;
  footerText: string;
  footerLink: string;
}

export const AuthCard: React.FC<React.PropsWithChildren<Props>> = (props) => {
  return (
    <Paper>
      <Stack>
        <HeaderContainer>
          <HeaderText>{props.title}</HeaderText>
        </HeaderContainer>
        <CardBody>
          {props.children}
        </CardBody>
        <Footer>
          <A to={props.footerLink}>{props.footerText}</A>
        </Footer>
      </Stack>
    </Paper>
  )
}

const HeaderContainer = emotionStyled.div(props => ({
  padding: `0.5rem 1rem`,
  background: props.theme.color.content.card.capBackground,
  borderBottom: `1px solid ${props.theme.color.content.card.border}`,
}))

const HeaderText = emotionStyled(H3)({
  textAlign: `center`,
  marginTop: `1.5rem`,
  marginBottom: `1.5rem`,
})

const CardBody = emotionStyled.div({
  flex: `1 1 auto`,
  padding: `1rem`,
})

const Footer = emotionStyled.div(props => ({
  padding: `1rem`,
  background: props.theme.color.content.card.capBackground,
  borderTop: `1px solid ${props.theme.color.content.card.border}`,
  textAlign: `center`,
  fontSize: `0.875em`,
}))