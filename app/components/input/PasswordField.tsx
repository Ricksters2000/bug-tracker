import React from 'react';
import {FormControl, FormControlProps, FormHelperText, IconButton, InputLabel, OutlinedInput, OutlinedInputProps} from '@mui/material';
import {VisibilityOffIcon} from '~/assets/icons/VisibilityOffIcon';
import {VisibilityIcon} from '~/assets/icons/VisibilityIcon';

type Props = {
  label: string;
  name?: string;
  helperText?: string;
} & Pick<FormControlProps, 'fullWidth' | `error`> & Pick<OutlinedInputProps, `onBlur` | `inputRef` | `required`>

export const PasswordField: React.FC<Props> = (props) => {
  const {name, error, label, helperText, fullWidth, inputRef, required, onBlur} = props
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        inputRef={inputRef}
        onBlur={onBlur}
        required={required}
        name={name}
        type={isVisible ? `text` : 'password'}
        label={label}
        endAdornment={
          <IconButton onClick={() => setIsVisible(prev => !prev)}>
            {isVisible && <VisibilityOffIcon/>}
            {!isVisible && <VisibilityIcon/>}
          </IconButton>
        }
      />
      <FormHelperText>
        {helperText}  
      </FormHelperText>
    </FormControl>
  )
}