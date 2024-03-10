import React from 'react';
import {RoundedSquareBackground} from './RoundedSquareBackground';

export const ClosedTicketTag: React.FC = () => {
  return (
    <RoundedSquareBackground foregroundColor={`#fff`} backgroundColor={`#FF5630`}>
      Closed
    </RoundedSquareBackground>
  )
}