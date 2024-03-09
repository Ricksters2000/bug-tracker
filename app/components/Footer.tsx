import emotionStyled from '@emotion/styled';
import React from 'react';

type Props = {
  className?: string;
}

export const Footer: React.FC<Props> = (props) => {
  return (
    <Root className={props.className}>
      <FooterContainer>
        <InnerFooter>
          <FooterText>{`Copyright © Your Website ${new Date().getFullYear()}`}</FooterText>
        </InnerFooter>
      </FooterContainer>
    </Root>
  )
}

const Root = emotionStyled.div({
  minWidth: 0,
})

const FooterContainer = emotionStyled.footer(props => ({
  background: props.theme.color.content.footer,
  padding: `1.5rem`,
  marginTop: `1.5rem`,
}))

const InnerFooter = emotionStyled.div({
  width: `100%`,
  margin: `0 auto`,
  display: `flex`,
  alignItems: `center`,
})

const FooterText = emotionStyled.div(props => ({
  color: props.theme.color.content.info,
  fontSize: `0.875em`,
}))