import {Priority} from '@prisma/client';
import React from 'react';
import {RoundedSquareBackground} from './RoundedSquareBackground';
import {priorityColors} from '../utils/priorityColors';
import {MenuItem, Select} from '@mui/material';
import {objectKeys} from '~/utils/objectKeys';
import emotionStyled from '@emotion/styled';

type Props = {
  priority: Priority;
  editable?: boolean;
  onChange?: (priority: Priority) => void;
}

export const PriorityTag: React.FC<Props> = (props) => {
  const color = priorityColors[props.priority]
  if (props.editable) {
    return (
      <PrioritySelect
        variant='standard'
        renderValue={(value) => <>{value}</>}
        value={props.priority}
        onChange={(evt) => {
          if (props.onChange) {
            props.onChange(evt.target.value as Priority)
          }
        }}
        style={{color: color.foreground, background: color.background}}
      >
        {objectKeys(Priority).map(key => {
          const priorityColor = priorityColors[key]
          return (
            <MenuItem key={key} value={key}>
              <RoundedSquareBackground foregroundColor={priorityColor.foreground} backgroundColor={priorityColor.background}>
                {key}
              </RoundedSquareBackground>
            </MenuItem>
          )
        })}
      </PrioritySelect>
    )
  }
  return (
    <RoundedSquareBackground foregroundColor={color.foreground} backgroundColor={color.background}>
      {props.priority}
    </RoundedSquareBackground>
  )
}

const PrioritySelect = emotionStyled(Select)({
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