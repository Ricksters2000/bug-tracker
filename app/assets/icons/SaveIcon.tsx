import emotionStyled from '@emotion/styled';
import {createSvgIcon} from '@mui/material';

const Path = emotionStyled.path(props => ({
  fill: props.theme.color.content.success,
}))

const Background = emotionStyled(Path)({
  opacity: .3,
})

export const SaveIcon = createSvgIcon(
  <>
    <Background d='M5 19h14V5H5zm2.41-7.4 2.58 2.58 6.59-6.59L17.99 9l-8 8L6 13.01z'/>
    <Path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z'/>
  </>,
  `Save`
)