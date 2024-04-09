import {Avatar, Box, Paper, Typography} from '@mui/material';
import React from 'react';

type Props = {
  icon: React.ReactElement;
  title: string;
  description: string;
}

export const SubFeatureCard: React.FC<Props> = (props) => {
  return (
    <Paper data-aos='fade-up' sx={{padding: `32px`}}>
      <Box display={`flex`} flexDirection={`column`}>
        <Avatar sx={{
          backgroundColor: `rgb(99, 102, 241)`,
          color: `rgb(255, 255, 255)`,
          marginBottom: `16px`,
        }}>
          {props.icon}
        </Avatar>
        <Typography variant='h6' fontWeight={500} marginBottom={`0.35em`}>{props.title}</Typography>
        <Typography color={`rgb(86, 89, 115)`}>{props.description}</Typography>
      </Box>
    </Paper>
  )
}