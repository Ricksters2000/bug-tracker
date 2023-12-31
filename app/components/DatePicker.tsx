import React from 'react';
import {FormControl, FormControlProps, Input, InputLabel} from '@mui/material';

type Props = {
  label: string;
  value?: Date;
  defaultValue?: Date;
  readOnly?: boolean;
  onChange?: (newDate: Date) => void;
  ref?: React.RefObject<HTMLInputElement>;
} & Pick<FormControlProps, `variant` | `fullWidth`>

export const DatePicker: React.FC<Props> = (props) => {
  const {label, readOnly, value, defaultValue, onChange, variant, ref, fullWidth} = props
  return (
    <FormControl variant={variant} fullWidth={fullWidth}>
      <InputLabel shrink variant={variant}>{label}</InputLabel>
      <Input
        inputRef={ref}
        type='datetime-local'
        readOnly={readOnly}
        defaultValue={defaultValue}
        value={value}
        onChange={(evt) => onChange && onChange(new Date(evt.target.value))}
      />
    </FormControl>
  )
}