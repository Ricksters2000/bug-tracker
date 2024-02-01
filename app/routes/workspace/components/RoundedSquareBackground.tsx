import emotionStyled from '@emotion/styled';
import React from 'react';

type Props = {
  className?: string;
  backgroundColor: string;
  foregroundColor: string;
}

export const RoundedSquareBackground: React.FC<React.PropsWithChildren<Props>> = (props) => {
  return (
    <Root className={props.className} backgroundColor={props.backgroundColor} foregroundColor={props.foregroundColor}>
      {props.children}
    </Root>
  )
}

const Root = emotionStyled(`span`)<Props>(props => ({
  height: '24px',
  minWidth: '24px',
  lineHeight: '0',
  borderRadius: '6px',
  cursor: 'default',
  WebkitBoxAlign: 'center',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  WebkitBoxPack: 'center',
  justifyContent: 'center',
  textTransform: 'capitalize',
  padding: '0px 6px',
  fontSize: '0.75rem',
  fontWeight: '700',
  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  color: props.foregroundColor,
  backgroundColor: props.backgroundColor,
}))