import emotionStyled from '@emotion/styled';
import {Paper} from '@mui/material';
import React from 'react';
import {H2} from '~/typography';

type Props = {
  className?: string;
  label: string;
}

export const ExternalLabelCard: React.FC<React.PropsWithChildren<Props>> = (props) => {
  return (
    <Root className={props.className}>
      <Label>{props.label}</Label>
      {props.children}
    </Root>
  )
}

const Root = emotionStyled(Paper)({
  position: `relative`,
  padding: `1.5rem`,
})

const Label = emotionStyled(H2)({
  position: `absolute`,
  top: 0,
  left: 0,
  transform: `scale(1) translate(20%, -50%)`,
})