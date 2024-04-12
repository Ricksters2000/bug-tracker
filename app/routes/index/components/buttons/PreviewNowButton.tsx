import {Button} from '@mui/material';
import {Link} from '@remix-run/react';
import React from 'react';

export const PreviewNowButton: React.FC = () => {
  return (
    <Link to={`/auth/preview`}>
      <Button variant='outlined'>Try it out now!</Button>
    </Link>
  )
}