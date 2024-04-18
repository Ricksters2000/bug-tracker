import emotionStyled from '@emotion/styled';
import {Box} from '@mui/material';
import React from 'react';

type Props = {
  urls: Array<string>;
}

export const ImageList: React.FC<Props> = (props) => {
  return (
    <Root>
      {props.urls.map((url, i) => {
        return (
          <Image key={`img-${url}-${i}`} src={url}/>
        )
      })}
    </Root>
  )
}

const Root = emotionStyled(Box)({
  marginTop: `-3rem`,
  display: `flex`,
  flexDirection: `column`,
  gap: 20,
  minWidth: 486,
  padding: `0 8px`,
})

const Image = emotionStyled.img({
  width: 486,
  maxWidth: `100%`,
  boxShadow: 'rgba(140, 152, 164, 0.125) 0px 6px 24px 0px',
  borderRadius: '16px',
})