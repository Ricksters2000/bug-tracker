import React from 'react';
import emotionStyled from '@emotion/styled';
import {BodyText, NavLink, NavLinkIcon, NavbarBrandText, SmallText} from '~/typography';
import {HamburgerIcon} from '~/assets/icons/HamburgerIcon';
import {DashboardIcon} from '~/assets/icons/DashboardIcon';
import {SideNavCollapse} from './SideNavCollapse';
import {UserIcon} from '~/assets/icons/UserIcon';
import {Box, Divider, List, ListItem, ListItemButton, ListItemText, Popover} from '@mui/material';
import {Link} from '@remix-run/react';
import {useTheme} from '@emotion/react';
import {UserPublic} from '~/server/db/userDb';
import {getUserFullNameFromUser} from '~/utils/getUserFullNameFromUser';
import {Footer} from '~/components/Footer';
import {canCreateAndEditUsers} from '../../utils/roles/canCreateAndEditUsers';
import {canViewAllProjects} from '../../utils/roles/canViewAllProjects';
import {canCreateProjects} from '../../utils/roles/canCreateProjects';

type Props = {
  user: UserPublic;
}

export const LayoutContainer: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {user} = props
  const [sideNavBarIsOpen, setSideNavBarIsOpen] = React.useState(true);
  const [userDropdownIsOpen, setUserDropdownIsOpen] = React.useState(false);
  const dropdownEl = React.useRef<HTMLAnchorElement>(null)
  const theme = useTheme().color.nav

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
        <UserButtonContainer>
          <UserDropdownButton onClick={() => setUserDropdownIsOpen(prev => !prev)}>
            <UserIconButton ref={dropdownEl} style={{color: userDropdownIsOpen ? theme.iconHover : undefined}} to={`#`}>
              <UserIcon/>
            </UserIconButton>
          </UserDropdownButton>
          <Popover
            open={userDropdownIsOpen}
            anchorEl={dropdownEl.current}
            onClose={() => setUserDropdownIsOpen(false)}
            anchorOrigin={{vertical: `bottom`, horizontal: `right`}}
            transformOrigin={{vertical: `top`, horizontal: `right`}}
          >
            <Box minWidth={`10rem`} fontSize={`1rem`}>
              <List>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={`/`}>
                    <ListItemText primary='Settings'/>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={`/`}>
                    <ListItemText primary='Activity Log'/>
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider/>
              <List>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={`/auth`}>
                    <ListItemText primary='Logout'/>
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Popover>
        </UserButtonContainer>
      </TopNav>
      <SideNavContainer>
        <SideNav isOpen={sideNavBarIsOpen}>
          <InnerSideNav>
            <SideNavMenu>
              <SideNavContent>
                <SideNavMenuHeading>Core</SideNavMenuHeading>
                <NavLink to={`.`}>
                  <NavLinkIcon>
                    <DashboardIcon/>
                  </NavLinkIcon>
                  Dashboard
                </NavLink>
                <SideNavCollapse label='Projects' adornment={<DashboardIcon/>}>
                  {canCreateProjects(user.role) &&
                    <NavLink to={`./project/create`}>
                      Create Project
                    </NavLink>
                  }
                  <NavLink to={`./project`}>
                    All Projects
                  </NavLink>
                  {canViewAllProjects(user.role) && 
                    <NavLink to={`./project`}>
                      Archived Projects
                    </NavLink>
                  }
                </SideNavCollapse>
                <SideNavCollapse label='Tickets' adornment={<DashboardIcon/>}>
                  <NavLink to={`./ticket/create`}>
                    Create Ticket
                  </NavLink>
                  <NavLink to={`./ticket/`}>
                    All Tickets
                  </NavLink>
                </SideNavCollapse>
                {canCreateAndEditUsers(user.role) &&
                  <SideNavCollapse label='Users' adornment={<DashboardIcon/>}>
                    <NavLink to={`./user/create`}>
                      Create User
                    </NavLink>
                    <NavLink to={`./user/roles`}>
                      Member Roles
                    </NavLink>
                  </SideNavCollapse>
                }
              </SideNavContent>
            </SideNavMenu>
            <SideNavFooter>
              <SmallText>Logged in as:</SmallText>
              <BodyText>{getUserFullNameFromUser(user)}</BodyText>
            </SideNavFooter>
          </InnerSideNav>
        </SideNav>
        <ContentContainer isOpen={sideNavBarIsOpen}>
          <main>
            <ContainerFluid>
              {props.children}
            </ContainerFluid>
          </main>
          <ContentFooter/>
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

const UserButtonContainer = emotionStyled.ul({
  marginLeft: `auto`,
  marginRight: `1.5rem`,
  marginTop: 0,
  marginBottom: 0,
  display: `flex`,
})

const UserDropdownButton = emotionStyled.li({
  position: `relative`,
  listStyle: `none`,
})

const UserIconButton = emotionStyled(NavLink)(props => ({
  display: `block`,
  padding: `0.5rem`,

  ':hover': {
    color: props.theme.color.nav.iconHover,
    cursor: `pointer`,
  },

  '::after': {
    display: 'inline-block',
    marginLeft: '0.255em',
    verticalAlign: '0.255em',
    content: '""',
    borderTop: '0.3em solid',
    borderRight: '0.3em solid transparent',
    borderBottom: '0',
    borderLeft: '0.3em solid transparent'
  }
}))

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

const ContentFooter = emotionStyled(Footer)({
  marginTop: `1.5rem`,
})