import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import React from 'react';

type Props = {
  label?: string;
}

export const UserPicker: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>User</Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        
      </Dialog>
    </div>
  )
}