import emotionStyled from '@emotion/styled';
import {FormControl, FormHelperText, InputLabel} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import {DateRange} from '~/types/DateRange';

type Props = {
  label: string;
  dateRange: DateRange;
  onChange: (newDateRange: DateRange) => void;
}

export const DateRangePicker: React.FC<Props> = (props) => {
  const {label, dateRange, onChange} = props
  const [error, setError] = React.useState<string | null>(null)
  const {from, to} = dateRange

  const checkForError = (newDateRange: DateRange) => {
    const {from, to} = newDateRange
    if (!from || !to) return
    if (from > to) {
      setError(`Start date exceeds past end date`)
    } else if (error) {
      setError(null)
    }
  }

  const convertDateToString = (date?: Date | null): string => {
    if (!date) return ``;
    dayjs.extend(utc)
    const dayjsDate = dayjs(date)
    return dayjsDate.utc().format(`YYYY-MM-DD`)
  };

  const onChangeStartDate = (date: Date) => {
    console.log(`new date:`, date)
    const newDateRange: DateRange = {
      from: date,
      to,
    }
    onChange(newDateRange)
    checkForError(newDateRange)
  }

  const onChangeEndDate = (date: Date) => {
    const newDateRange: DateRange = {
      from,
      to: date,
    }
    onChange(newDateRange)
    checkForError(newDateRange)
  }

  return (
    <FormControl error={!!error} sx={{minWidth: `300px`}}>
      <InputLabel shrink>{label}</InputLabel>
      <OutlinedContainer>
        <Input
          type='date'
          value={convertDateToString(from)}
          onChange={(evt) => onChangeStartDate(new Date(evt.target.value))}
        />
        –
        <Input
          type='date'
          value={convertDateToString(to)}
          onChange={(evt) => onChangeEndDate(new Date(evt.target.value))}
        />
        <Fieldset error={!!error}>
          <Legend open>
            <TopLabel>{label}</TopLabel>
          </Legend>
        </Fieldset>
      </OutlinedContainer>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  )
}

const OutlinedContainer = emotionStyled.div({
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  fontWeight: '400',
  fontSize: '1rem',
  lineHeight: '1.4375em',
  letterSpacing: '0.00938em',
  boxSizing: 'border-box',
  cursor: 'text',
  display: 'inline-flex',
  WebkitBoxAlign: 'center',
  alignItems: 'center',
  position: 'relative',
  borderRadius: '4px'
})

const Fieldset = emotionStyled.fieldset<{error?: boolean}>(props => ({
  textAlign: 'left',
  position: 'absolute',
  inset: '-5px 0px 0px',
  margin: '0px',
  padding: '0px 8px',
  pointerEvents: 'none',
  borderRadius: 'inherit',
  borderStyle: 'solid',
  borderWidth: '1px',
  overflow: 'hidden',
  minWidth: '0%',
  borderColor: props.error ? `rgb(244, 67, 54)` : ``,
  // borderColor: 'rgba(255, 255, 255, 0.23)'
}))

const Legend = emotionStyled.legend<{open?: boolean}>(props => ({
  float: 'unset',
  width: 'auto',
  overflow: 'hidden',
  display: 'block',
  padding: '0px',
  height: '11px',
  fontSize: '0.75em',
  visibility: 'hidden',
  whiteSpace: 'nowrap',
  ...(props.open ? {
    maxWidth: `100%`,
    transition: `max-width 100ms cubic-bezier(0, 0, 0.2, 1) 50ms`
  } : {
    maxWidth: '0.01px',
    transition: 'max-width 50ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  })
}))

const TopLabel = emotionStyled.span({
  paddingLeft: '5px',
  paddingRight: '5px',
  display: 'inline-block',
  opacity: '0',
  visibility: 'visible'
})

const Input = emotionStyled.input({
  font: 'inherit',
  letterSpacing: 'inherit',
  border: '0px',
  boxSizing: 'content-box',
  background: 'none',
  height: '1.4375em',
  margin: '0px',
  WebkitTapHighlightColor: 'transparent',
  display: 'block',
  minWidth: '0px',
  width: '100%',
  padding: '16.5px 14px',
  '&:focus-visible': {
    outline: `none`,
  }
})