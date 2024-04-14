import {Box} from '@mui/material';
import React from 'react';
import {StartNowButton} from './StartNowButton';
import {PreviewNowButton} from './PreviewNowButton';

export const LandingPageButtonGroup: React.FC = () => {
  return (
    <Box display={`flex`} flexDirection={`column`} gap={2}>
      <StartNowButton/>
      <PreviewNowButton/>
    </Box>
  )
}