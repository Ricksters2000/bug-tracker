import {Box} from '@mui/material';
import React from 'react';
import {StartNowButton} from './StartNowButton';
import {PreviewNowButton} from './PreviewNowButton';
import emotionStyled from '@emotion/styled';

export const LandingPageButtonGroup: React.FC = () => {
  return (
    <Root display={`flex`} flexDirection={`column`} gap={2}>
      <StartNowButton/>
      <PreviewNowButton/>
    </Root>
  )
}

const Root = emotionStyled(Box)({
  '@media (min-width: 600px)': {
    flexDirection: `row`,
  }
})