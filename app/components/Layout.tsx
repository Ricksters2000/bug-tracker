import React from 'react';
import emotionStyled from '@emotion/styled';
import {NavbarBrandText} from '~/typography';
import {HamburgerIcon} from '~/assets/icons/HamburgerIcon';

export const Layout: React.FC = () => {
  return (
    <div>
      <TopNav>
        <NavbarBrandText>Bug Tracker</NavbarBrandText>
        <SideToggleButton>
          <HamburgerIcon/>
        </SideToggleButton>
      </TopNav>
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
  justifyContent: `flex-start`
}))

const SideToggleButton = emotionStyled.button({
  cursor: `pointer`,
  color: `rgba(255, 255, 255, 0.5)`,
  padding: `4px 8px`,
})