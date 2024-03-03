import React from 'react';
import emotionStyled from '@emotion/styled';
import {BreadcrumbText} from '~/typography';
import {useMatches} from '@remix-run/react';
import {Breadcrumbs as BreadcrumbsMui} from '@mui/material';
import {CommonHandle} from '~/utils/CommonHandle';

type Props = {
  paths?: Array<string>;
  currentLinkTitle: string;
  /** Use for index pages to prevent duplicate links */
  excludeParentLink?: boolean;
}

export const Breadcrumbs: React.FC<Props> = (props) => {
  const matches = useMatches()
  return (
    <Root>
      {matches.map((match, i) => {
        if (props.excludeParentLink && i === matches.length - 2) return null
        if (i === matches.length - 1) {
          return <BreadcrumbText key={`${props.currentLinkTitle}-${i}`}>{props.currentLinkTitle}</BreadcrumbText>
        }
        const handle = match.handle as CommonHandle<any> | undefined
        if (!handle?.breadcrumb) return null
        const Breadcrumb = handle.breadcrumb({params: match.params, data: match.data})
        return React.cloneElement(Breadcrumb, {
          ...Breadcrumb.props,
          key: `breadcrumb-${i}`
        })
      })}
    </Root>
  )
}

const Root = emotionStyled(BreadcrumbsMui)({
  marginBottom: `1.5rem`,
})

const Item = emotionStyled.li<{includeSlash?: boolean}>(props => ({
  color: props.theme.color.content.breadcrumb,
  ...(!props.includeSlash ? {} : {
    '::before': {
      content: `"/"`,
      paddingRight: `0.5rem`,
      float: `left`,
    }
  })
}))