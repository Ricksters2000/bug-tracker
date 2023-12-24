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

      h1, h2, h3, h4, h5, h6 {
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-weight: 500;
        line-height: 1.2;
      }
    `}/>
  )
}