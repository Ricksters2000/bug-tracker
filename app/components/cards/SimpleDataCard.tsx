import {Box, Paper} from '@mui/material';
import React from 'react';
import {H3, SmallText} from '~/typography';

type Props = {
  className?: string;
  label: string;
  data: number;
}

export const SimpleDataCard: React.FC<Props> = (props) => {
  return (
    <Paper sx={{padding: `24px`}}>
      <Box>
        <SmallText style={{marginBottom: `16px`}}>{props.label}</SmallText>
        <H3>{props.data}</H3>
      </Box>
    </Paper>
  )
}