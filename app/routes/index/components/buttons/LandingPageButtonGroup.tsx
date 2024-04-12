import {Grid} from '@mui/material';
import React from 'react';
import {StartNowButton} from './StartNowButton';
import {PreviewNowButton} from './PreviewNowButton';

export const LandingPageButtonGroup: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <StartNowButton/>
      </Grid>
      <Grid item xs={12} sm={6}>
        <PreviewNowButton/>
      </Grid>
    </Grid>
  )
}