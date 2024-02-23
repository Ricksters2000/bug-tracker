import emotionStyled from '@emotion/styled';
import {createSvgIcon} from '@mui/material';
import React from 'react';

const Path = emotionStyled.path(props => ({
  fill: `inherit`,
}))

export const CheckIcon = createSvgIcon(
  <Path d='M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/>,
  `Search`
)