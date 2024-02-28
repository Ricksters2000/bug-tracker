import React from 'react';
import emotionStyled from '@emotion/styled';
import {A} from '~/typography';

type Props = {
  paths?: Array<string>;
}

export const Breadcrumbs: React.FC<Props> = (props) => {
  return (
    <Root>
      {props.paths?.map((path, i) => {
        return (
          <Item key={`bc-${path}-${i}`} includeSlash={i !== 0}>
            {i === (props.paths?.length ?? 1) - 1 ? path : (
              <A to={`/${path}`}>{path}</A>
            )}
          </Item>
        )
      })}
    </Root>
  )
}

const Root = emotionStyled.ul({
  marginBottom: `1.5rem`,
  display: `flex`,
  flexWrap: `wrap`,
  padding: 0,
  listStyle: `none`,
  gap: `0.5rem`,
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