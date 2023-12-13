import emotionStyled from "@emotion/styled";

export const NavbarBrandText = emotionStyled.a(props => ({
  fontSize: `1.25rem`,
  color: props.theme.color.nav.headingText,
  paddingTop: `0.3125rem`,
  paddingBottom: `0.3125rem`,
  paddingLeft: `1rem`,
  textDecoration: `none`,
}))

export const SvgInline = emotionStyled.svg({
  boxSizing: `content-box`,
  display: `inline-block`,
  height: `1em`,
  verticalAlign: `-0.125rem`,
  overflow: `visible`
})