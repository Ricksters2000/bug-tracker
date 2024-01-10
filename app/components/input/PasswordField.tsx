import React from 'react';
import {FormControl, FormControlProps, FormHelperText, InputLabel, OutlinedInput, OutlinedInputProps} from '@mui/material';

type Props = {
  label: string;
  name?: string;
  helperText?: string;
} & Pick<FormControlProps, 'fullWidth' | `error`> & Pick<OutlinedInputProps, `onBlur` | `inputRef` | `required`>

export const PasswordField: React.FC<Props> = (props) => {
  const {name, error, label, helperText, fullWidth, inputRef, required, onBlur} = props

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        inputRef={inputRef}
        onBlur={onBlur}
        required={required}
        name={name}
        type='password'
        label={label}/>
      <FormHelperText>
        {helperText}  
      </FormHelperText>
    </FormControl>
  )
}