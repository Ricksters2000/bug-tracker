import emotionStyled from '@emotion/styled';
import {createSvgIcon} from '@mui/material';

const Path = emotionStyled.path(props => ({
  fill: props.theme.color.content.icon,
}))

export const SendIcon = createSvgIcon(
  <Path d='M2.01 21 23 12 2.01 3 2 10l15 2-15 2z'/>,
  `Edit`
)