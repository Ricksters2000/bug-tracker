import emotionStyled from "@emotion/styled";
import {Outlet} from "@remix-run/react";
import {Footer} from "~/components/Footer";

export default function Auth() {
  return (
    <Root>
      <Content>
        <Container>
          <InnerContainer>
            <ContentWrapper>
              <Outlet/>
            </ContentWrapper>
          </InnerContainer>
        </Container>
      </Content>
      <Footer/>
    </Root>
  )
}

const Root = emotionStyled.div(props => ({
  display: `flex`,
  flexDirection: `column`,
  minHeight: `100vh`,
  background: `rgb(13, 110, 253)`,
}))

const Content = emotionStyled.div({
  minWidth: 0,
  flexGrow: 1,
})

const Container = emotionStyled.div({
  maxWidth: 1320,
  margin: `0 auto`,
})

const InnerContainer = emotionStyled.div({
  display: `flex`,
  justifyContent: `center`,
  margin: `0 auto`,
})

const ContentWrapper = emotionStyled.div({
  marginTop: `3rem`,
  flex: `0 0 auto`,
  width: `41.66%`,
  maxWidth: `100%`,
})