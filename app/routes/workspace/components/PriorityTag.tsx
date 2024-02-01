import {$Enums} from '@prisma/client';
import React from 'react';
import {RoundedSquareBackground} from './RoundedSquareBackground';
import {priorityColors} from '../utils/priorityColors';

type Props = {
  priority: $Enums.Priority;
}

export const PriorityTag: React.FC<Props> = (props) => {
  const color = priorityColors[props.priority]
  return (
    <RoundedSquareBackground foregroundColor={color.foreground} backgroundColor={color.background}>
      {props.priority}
    </RoundedSquareBackground>
  )
}