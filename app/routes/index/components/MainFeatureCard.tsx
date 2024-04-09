import {Avatar, Box, Typography} from '@mui/material';
import React from 'react';

type Props = {
  icon: React.ReactElement;
  title: string;
  description: string;
}

export const MainFeatureCard: React.FC<Props> = (props) => {
  return (
    <Box data-aos='fade-up'>
      <Box display={`flex`} alignItems={`center`} flexDirection={`column`}>
        <Avatar sx={{
          backgroundColor: `rgba(99, 102, 241, 0.1)`,
          color: `rgb(99, 102, 241)`,
          marginBottom: `16px`,
        }}>
          {props.icon}
        </Avatar>
        <Typography variant='h6' fontWeight={500} marginBottom={`0.35em`}>{props.title}</Typography>
        <Typography textAlign={`center`} color={`rgb(86, 89, 115)`}>{props.description}</Typography>
      </Box>
    </Box>
  )
}