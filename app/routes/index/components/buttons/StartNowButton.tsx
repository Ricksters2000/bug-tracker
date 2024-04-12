import {Button} from '@mui/material';
import {Link} from '@remix-run/react';
import React from 'react';

export const StartNowButton: React.FC = () => {
  return (
    <Link to={`/auth/register`}>
      <Button variant='contained'>Start Now</Button>
    </Link>
  )
}