import React from 'react';
import emotionStyled from '@emotion/styled';
import {BodyText, NavLink, NavLinkIcon, NavbarBrandText, SmallText} from '~/typography';
import {HamburgerIcon} from '~/assets/icons/HamburgerIcon';
import {DashboardIcon} from '~/assets/icons/DashboardIcon';
import {SideNavCollapse} from './SideNavCollapse';

export const Layout: React.FC<React.PropsWithChildren> = (props) => {
  const [sideNavBarIsOpen, setSideNavBarIsOpen] = React.useState(true);

  const toggleSideNavBar = () => {
    setSideNavBarIsOpen(prev => !prev);
  }

  return (
    <div>
      <TopNav>
        <NavbarBrandText>Bug Tracker</NavbarBrandText>
        <SideToggleButton onClick={toggleSideNavBar}>
          <HamburgerIcon/>
        </SideToggleButton>
      </TopNav>
      <SideNavContainer>
        <SideNav isOpen={sideNavBarIsOpen}>
          <InnerSideNav>
            <SideNavMenu>
              <SideNavContent>
                <SideNavMenuHeading>Core</SideNavMenuHeading>
                <NavLink to={`/`}>
                  <NavLinkIcon>
                    <DashboardIcon/>
                  </NavLinkIcon>
                  Dashboard
                </NavLink>
                <SideNavCollapse label='Projects' adornment={<DashboardIcon/>}>
                  <NavLink to={`/project/create`}>
                    Create
                  </NavLink>
                  <NavLink to={``}>
                    Project 1
                  </NavLink>
                  <NavLink to={``}>
                    Project 2
                  </NavLink>
                </SideNavCollapse>
                <SideNavCollapse label='Account' adornment={<DashboardIcon/>}>
                  <SideNavCollapse label='Authentication'>
                    <NavLink to={``}>
                      Login
                    </NavLink>
                    <NavLink to={``}>
                      Register
                    </NavLink>
                  </SideNavCollapse>
                  <SideNavCollapse label='Error'>
                    <NavLink to={``}>
                      401 Page
                    </NavLink>
                    <NavLink to={``}>
                      404 Page
                    </NavLink>
                    <NavLink to={``}>
                      500 Page
                    </NavLink>
                  </SideNavCollapse>
                </SideNavCollapse>
              </SideNavContent>
            </SideNavMenu>
            <SideNavFooter>
              <SmallText>Logged in as:</SmallText>
              <BodyText>Username</BodyText>
            </SideNavFooter>
          </InnerSideNav>
        </SideNav>
        <ContentContainer isOpen={sideNavBarIsOpen}>
          <main>
            <ContainerFluid>
              {props.children}
            </ContainerFluid>
          </main>
        </ContentContainer>
      </SideNavContainer>
    </div>
  )
}

const TopNav = emotionStyled.nav(props => ({
  position: `fixed`,
  top: 0,
  right: 0,
  left: 0,
  zIndex: 1000,
  height: 56,
  background: props.theme.color.nav.background,
  display: `flex`,
  justifyContent: `flex-start`,
  alignItems: `center`,
}))

const SideToggleButton = emotionStyled.button({
  cursor: `pointer`,
  color: `rgba(255, 255, 255, 0.5)`,
  padding: `4px 8px`,
  background: `transparent`,
  border: 0,
})

const SideNavContainer = emotionStyled.div({
  display: `flex`,
})

const ContentContainer = emotionStyled.div<{isOpen: boolean}>(props => ({
  paddingLeft: 225,
  top: 56,
  transition: `margin 0.15s ease-in-out`,
  position: `relative`,
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `space-between`,
  minWidth: 0,
  flexGrow: 1,
  minHeight: `calc(100vh - 56px)`,
  ...(props.isOpen ?
    {marginLeft: 0}
    :
    {marginLeft: -225}  
  )
}))

const SideNav = emotionStyled.div<{isOpen: boolean}>(props => ({
  width: 225,
  height: `100vh`,
  zIndex: 999,
  position: `fixed`,
  top: 0,
  left: 0,
  right: 0,
  flexBasis: 225,
  flexShrink: 0,
  transition: `transform 0.15s ease-in-out`,
  ...(props.isOpen ? {} : {transform: `translateX(-225px)`}),
}))

const InnerSideNav = emotionStyled.nav(props => ({
  paddingTop: 56,
  background: props.theme.color.nav.background,
  color: props.theme.color.nav.bodyText,
  display: `flex`,
  flexDirection: `column`,
  height: `100%`,
  flexWrap: `nowrap`,
}))

const SideNavMenu = emotionStyled.div({
  overflowY: `auto`,
  flexGrow: 1,
})

const SideNavContent = emotionStyled.div({
  display: `flex`,
  flexDirection: `column`,
  flexWrap: `nowrap`,
})

const SideNavFooter = emotionStyled.div(props => ({
  background: props.theme.color.nav.footer,
  padding: `0.75rem`,
  flexShrink: 0,
  color: props.theme.color.nav.bodyText,
}))

const SideNavMenuHeading = emotionStyled.div(props => ({
  padding: `1.75rem 1rem 0.75rem`,
  fontSize: `0.75rem`,
  fontWeight: `bold`,
  textTransform: `uppercase`,
  color: props.theme.color.nav.sectionText,
}))

const ContainerFluid = emotionStyled.div({
  padding: `0 1.5rem`,
  margin: `0 auto`,
  width: `100%`,
})