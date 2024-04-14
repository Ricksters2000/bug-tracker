import emotionStyled from '@emotion/styled';
import {Button} from '@mui/material';
import {Link} from '@remix-run/react';
import React from 'react';

export const PreviewNowButton: React.FC = () => {
  return (
    <Root to={`/auth/preview`}>
      <Button fullWidth sx={{textTransform: `none`}} variant='outlined' color='secondary'>Try it out!</Button>
    </Root>
  )
}

const Root = emotionStyled(Link)({
  '@media (max-width: 899px)': {
    width: `100%`,
  },
})