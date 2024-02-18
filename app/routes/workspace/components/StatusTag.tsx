import {TicketStatus} from '@prisma/client';
import React from 'react';
import {RoundedSquareBackground} from './RoundedSquareBackground';
import {MenuItem, Select} from '@mui/material';
import {objectKeys} from '~/utils/objectKeys';
import emotionStyled from '@emotion/styled';
import {statusColors} from '../utils/statusColors';

type Props = {
  status: TicketStatus;
  editable?: boolean;
  onChange?: (priority: TicketStatus) => void;
}

export const StatusTag: React.FC<Props> = (props) => {
  const color = statusColors[props.status]
  if (props.editable) {
    return (
      <StatusSelect
        variant='standard'
        renderValue={(value) => <>{value}</>}
        value={props.status}
        onChange={(evt) => {
          if (props.onChange) {
            props.onChange(evt.target.value as TicketStatus)
          }
        }}
        style={{color: `#fff`, background: color}}
      >
        {objectKeys(TicketStatus).map(key => {
          const statusColor = statusColors[key]
          return (
            <MenuItem key={key} value={key}>
              <RoundedSquareBackground foregroundColor={`#fff`} backgroundColor={statusColor}>
                {key}
              </RoundedSquareBackground>
            </MenuItem>
          )
        })}
      </StatusSelect>
    )
  }
  return (
    <RoundedSquareBackground foregroundColor={`#fff`} backgroundColor={color}>
      {props.status}
    </RoundedSquareBackground>
  )
}

const StatusSelect = emotionStyled(Select)({
  borderRadius: `6px`,
  minHeight: `24px`,
  fontWeight: 700,
  fontSize: `0.75rem`,
  textTransform: `capitalize`,
  padding: `0 6px`,
  '::before': {
    content: `none`,
  },
  '::after': {
    content: `none`,
  },
  '& .MuiSelect-select:focus': {
    background: `none`,
  },
})