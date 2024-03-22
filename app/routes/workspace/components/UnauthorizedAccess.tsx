import {Alert} from '@mui/material';
import React from 'react';

export const UnauthorizedAccess: React.FC = () => {
  return (
    <Alert severity='error'>
      You do not have access to this page.
    </Alert>
  )
}