import emotionStyled from '@emotion/styled';
import {createSvgIcon} from '@mui/material';

const Path = emotionStyled.path(props => ({
  fill: props.theme.color.content.danger,
}))

const Background = emotionStyled(Path)({
  opacity: .3,
})

export const CancelIcon = createSvgIcon(
  <>
    <Background d='M5 5v14h14V5zm12 10.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z'/>
    <Path d='M19 19H5V5h14zM3 3v18h18V3zm14 12.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z'/>
  </>,
  `Cancel`
)