import React from 'react';
import {FormControl, FormControlProps, FormHelperText, Input, InputLabel} from '@mui/material';
import dayjs from 'dayjs';

type Props = {
  label: string;
  name?: string;
  helperText?: string | null;
  value?: Date;
  defaultValue?: Date | null;
  readOnly?: boolean;
  error?: boolean;
  onChange?: (newDate: Date) => void;
  ref?: React.RefObject<HTMLInputElement>;
} & Pick<FormControlProps, `variant` | `fullWidth`>

export const DatePicker: React.FC<Props> = (props) => {
  const {
    label,
    readOnly,
    value,
    defaultValue,
    onChange,
    variant,
    ref,
    fullWidth,
    name,
    error,
    helperText,
  } = props

  const convertDateToString = (date?: Date | null): string | undefined => {
    if (!date) return undefined;
    const dayjsDate = dayjs(date)
    return dayjsDate.format(`YYYY-MM-DDTHH:mm`)
  };

  return (
    <FormControl variant={variant} fullWidth={fullWidth}>
      <InputLabel shrink error={error} variant={variant}>{label}</InputLabel>
      <Input
        inputRef={ref}
        name={name}
        type='datetime-local'
        readOnly={readOnly}
        defaultValue={convertDateToString(defaultValue)}
        value={convertDateToString(value)}
        onChange={(evt) => onChange && onChange(new Date(evt.target.value))}
        error={error}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}