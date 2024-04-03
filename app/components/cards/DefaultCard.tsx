import React from 'react';
import emotionStyled from '@emotion/styled';

type Props = {
  label: string;
  icon?: React.ReactNode;
  height?: string | number;
}

export const DefaultCard: React.FC<React.PropsWithChildren<Props>> = (props) => {
  return (
    <Root>
      <Header>
        {props.icon && (
          <IconWrapper>
            {props.icon}
          </IconWrapper>
        )}
        {props.label}
      </Header>
      <BodyContainer style={{height: props.height}}>
        {props.children}
      </BodyContainer>
    </Root>
  )
}

const Root = emotionStyled.div(props => ({
  marginBottom: `1.5rem`,
  position: `relative`,
  display: `flex`,
  flexDirection: `column`,
  minWidth: 0,
  wordWrap: `break-word`,
  background: props.theme.color.content.card.background,
  border: `1px solid ${props.theme.color.content.card.border}`,
  borderRadius: `0.375rem`,
}))

const Header = emotionStyled.div(props => ({
  padding: `0.5rem 1rem`,
  background: props.theme.color.content.card.capBackground,
  borderBottom: `1px solid ${props.theme.color.content.card.border}`,
}))

const IconWrapper = emotionStyled.div({
  marginRight: `0.25rem`
})

const BodyContainer = emotionStyled.div({
  flex: `1 1 auto`,
  padding: `1rem`,
  overflowY: `auto`,
  height: 450,
})