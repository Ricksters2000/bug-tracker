import emotionStyled from '@emotion/styled';
import {createSvgIcon} from '@mui/material';
import React from 'react';

const Path = emotionStyled.path(props => ({
  fill: `inherit`,
}))

export const RightArrowIcon = createSvgIcon(
  <Path d='m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7z'/>,
  `Search`
)