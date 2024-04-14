import emotionStyled from '@emotion/styled';
import {Button} from '@mui/material';
import {Link} from '@remix-run/react';
import React from 'react';

export const StartNowButton: React.FC = () => {
  return (
    <Root to={`/auth/register`}>
      <Button fullWidth sx={{textTransform: `none`}} variant='contained' color='secondary'>Start now</Button>
    </Root>
  )
}

const Root = emotionStyled(Link)({
  '@media (max-width: 899px)': {
    width: `100%`,
  },
})