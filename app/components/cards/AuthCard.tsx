import React from 'react';
import emotionStyled from '@emotion/styled';
import {Alert, Paper, Stack} from '@mui/material';
import {A, H3} from '~/typography';
import {isEmptyString} from '~/utils/isEmptyString';

type Props = {
  title: string;
  footerText: string;
  footerLink: string;
  errorMessage?: string;
}

export const AuthCard: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const [errorAlertIsOpen, setErrorAlertIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (props.errorMessage && !isEmptyString(props.errorMessage)) {
      setErrorAlertIsOpen(true)
    }
  }, [props.errorMessage])

  return (
    <Paper>
      <Stack>
        <HeaderContainer>
          <HeaderText>{props.title}</HeaderText>
        </HeaderContainer>
        {errorAlertIsOpen && <Alert severity='error' onClose={() => setErrorAlertIsOpen(false)}>
          {props.errorMessage}
        </Alert>}
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