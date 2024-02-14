import emotionStyled from '@emotion/styled';
import {Stack} from '@mui/material';
import React from 'react';
import {H4} from '~/typography';

type Props = {
  label: string;
  details: React.ReactNode;
}

export const CardSubInfo: React.FC<Props> = (props) => {
  return (
    <Stack>
      <Heading>{props.label}</Heading>
      <Details>{props.details}</Details>
    </Stack>
  )
}

const Heading = emotionStyled(H4)({
  margin: 0,
})

const Details = emotionStyled(`div`)({
  alignSelf: `flex-end`,
})