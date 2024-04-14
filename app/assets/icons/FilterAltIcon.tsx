import emotionStyled from '@emotion/styled';
import {createSvgIcon} from '@mui/material';
import React from 'react';

const Path = emotionStyled.path(props => ({
  fill: `inherit`,
}))

export const FilterAltIcon = createSvgIcon(
  <Path d='M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z'/>,
  `FilterAlt`,
)