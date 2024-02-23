import emotionStyled from '@emotion/styled';
import {createSvgIcon} from '@mui/material';

const Path = emotionStyled.path(props => ({
  fill: props.theme.color.content.icon,
}))

export const VisibilityIcon = createSvgIcon(
  <>
    <Path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3'/>
  </>,
  `Visibility`
)