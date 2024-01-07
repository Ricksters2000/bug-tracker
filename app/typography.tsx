import emotionStyled from "@emotion/styled";
import {Link} from "@remix-run/react";

export const NavbarBrandText = emotionStyled.a(props => ({
  fontSize: `1.25rem`,
  color: props.theme.color.nav.headingText,
  paddingTop: `0.3125rem`,
  paddingBottom: `0.3125rem`,
  paddingLeft: `1rem`,
  textDecoration: `none`,
  width: 225,
}))

export const SideNavText = emotionStyled(`span`)(props => ({
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

export const NavLink = emotionStyled(SideNavText)({
  textDecoration: `none`,
}).withComponent(Link)

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

export const H1 = emotionStyled.h1(props => ({
  marginTop: `1.5rem`,
  fontSize: `2.5rem`,
}))

export const H3 = emotionStyled.h3(props => ({
  fontSize: `1.75rem`,
}))

export const A = emotionStyled(Link)(props => ({
  color: props.theme.color.content.link,
  textDecoration: `underline`,
}))