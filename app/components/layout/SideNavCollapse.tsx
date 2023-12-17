import React from 'react';
import emotionStyled from '@emotion/styled';
import {NavLink, NavLinkIcon} from '~/typography';
import {DownArrowIcon} from '~/assets/icons/DownArrowIcon';
import {Collapse} from '@mui/material';

type Props = {
  label: string;
  adornment?: React.ReactNode;
}

export const SideNavCollapse: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <>
      <NavLink onClick={() => setMenuOpen(prev => !prev)}>
        {props.adornment && (
          <NavLinkIcon>
            {props.adornment}
          </NavLinkIcon>
        )}
        {props.label}
        <CollapseArrowWrapper menuOpen={menuOpen}>
          <DownArrowIcon/>
        </CollapseArrowWrapper>
      </NavLink>
      <Collapse in={menuOpen}>
        <NestedMenu>
          {props.children}
        </NestedMenu>
      </Collapse>
    </>
  )
}

const CollapseArrowWrapper = emotionStyled.div<{menuOpen: boolean}>(props => ({
  display: `inline-block`,
  marginLeft: `auto`,
  transition: `transform 0.15s ease`,
  ...(props.menuOpen ? {} : {transform: `rotate(-90deg)`})
}))

const NestedMenu = emotionStyled.div(props => ({
  marginLeft: `1.5rem`,
  display: `flex`,
  flexDirection: `column`,
  flexWrap: `nowrap`,
}))