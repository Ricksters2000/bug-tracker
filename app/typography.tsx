import emotionStyled from "@emotion/styled";

export const NavbarBrandText = emotionStyled.a(props => ({
  fontSize: `1.25rem`,
  color: props.theme.color.nav.headingText,
  paddingTop: `0.3125rem`,
  paddingBottom: `0.3125rem`,
  paddingLeft: `1rem`,
  textDecoration: `none`,
  width: 225,
}))

export const NavLink = emotionStyled.a(props => ({
  display: `flex`,
  alignItems: `center`,
  padding: `0.75rem 1rem`,
  position: `relative`,
  color: props.theme.color.nav.bodyText,
  transition: `color 0.15s ease-in-out`,
  ':hover': {
    color: props.theme.color.nav.textHover,
    cursor: `pointer`,
  },
}))

export const NavLinkIcon = emotionStyled.div(props => ({
  marginRight: `0.5rem`,
  color: props.theme.color.nav.iconLink
}))

export const SvgInline = emotionStyled.svg({
  boxSizing: `content-box`,
  display: `inline-block`,
  height: `1em`,
  verticalAlign: `-0.125rem`,
  overflow: `visible`
})

export const BodyText = emotionStyled.p({
  margin: 0,
  padding: 0,
  fontSize: `1rem`,
  fontWeight: 400,
  lineHeight: 1.5,
})

export const SmallText = emotionStyled(BodyText)({
  fontSize: `0.875em`,
})