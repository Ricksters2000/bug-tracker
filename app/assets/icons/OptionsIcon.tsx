import emotionStyled from '@emotion/styled';
import {createSvgIcon} from '@mui/material';

const Circle = emotionStyled.circle(props => ({
  fill: props.theme.color.content.icon,
}))

export const OptionsIcon = createSvgIcon(
  <>
    <Circle cx={12} cy={5} r={2}/>
    <Circle cx={12} cy={12} r={2}/>
    <Circle cx={12} cy={19} r={2}/>
  </>,
  `Options`
)