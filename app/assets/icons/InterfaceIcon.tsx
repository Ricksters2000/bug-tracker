import emotionStyled from '@emotion/styled';
import {createSvgIcon} from '@mui/material';
import React from 'react';

const Path = emotionStyled.path(props => ({
  fill: `inherit`,
}))

export const InterfaceIcon = createSvgIcon(
  <Path d='M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z'/>,
  `Interface`
)