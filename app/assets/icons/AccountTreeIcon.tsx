import emotionStyled from '@emotion/styled';
import {createSvgIcon} from '@mui/material';
import React from 'react';

const Path = emotionStyled.path(props => ({
  fill: `inherit`,
}))

export const AccountTreeIcon = createSvgIcon(
  <Path d='M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3z'/>,
  `AccountTree`
)