import {Global} from '@emotion/react';
import React from 'react';

export const GlobalStyles: React.FC = () => {
  return (
    <Global styles={`
              *, *::before, *::after {
                box-sizing: border-box;
              }

              body {
                margin: 0;
              }
            `}/>
  )
}