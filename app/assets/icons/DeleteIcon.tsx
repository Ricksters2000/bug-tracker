import emotionStyled from '@emotion/styled';
import {createSvgIcon} from '@mui/material';

const Path = emotionStyled.path(props => ({
  fill: props.theme.color.content.danger,
}))

export const DeleteIcon = createSvgIcon(
  <>
    <Path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z'/>
  </>,
  `Delete`
)