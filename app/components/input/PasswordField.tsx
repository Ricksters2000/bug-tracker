import React from 'react';
import {FormControl, FormControlProps, InputLabel, OutlinedInput} from '@mui/material';

type Props = {
  name?: string;
  label: string;
} & Pick<FormControlProps, 'fullWidth'>

export const PasswordField: React.FC<Props> = (props) => {
  const {name, label, fullWidth} = props

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput name={name} type='password' label={label}/>
    </FormControl>
  )
}