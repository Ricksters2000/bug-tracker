// import { cssBundleHref } from "@remix-run/css-bundle";
// import { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {Layout} from "./components/layout/Layout";
import {AppTheme} from "./types/AppTheme";
import {Global, ThemeProvider} from "@emotion/react";
import {ThemeProvider as MuiThemeProvider, createTheme} from "@mui/material";
import {GlobalStyles} from "./components/GlobalStyles";

// export const links: LinksFunction = () => [
//   ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
// ];

export default function App() {
  const theme: AppTheme = {
    color: {
      nav: {
        background: `rgba(33, 37, 41, 1)`,
        bodyText: `rgba(255, 255, 255, 0.5)`,
        headingText: `#fff`,
        sectionText: `rgba(255, 255, 255, 0.25)`,
        footer: `#343a40`,
        icon: `rgba(255, 255, 255, 0.25)`,
        iconLink: `rgba(255, 255, 0.55)`,
        iconHover: `rgba(255, 255, 255, 0.75)`,
        textHover: `#fff`,
      },
      content: {
        background: `#fff`,
        secondaryBackground: `rgb(244, 246, 248)`,
        text: `#000`,
        primary: `rgba(13, 110, 253, 1)`,
        warning: `rgba(255, 193, 7, 1)`,
        success: `rgba(25, 135, 84, 1)`,
        danger: `rgba(220, 53, 69, 1)`,
        secondary: ``,
        info: `rgb(99, 115, 129)`,
        icon: `#000`,
        footer: `rgba(248, 349, 250, 1)`,
        breadcrumb: `#6c757d`,
        link: `#0d6efd`,
        card: {
          border: `rgba(0, 0, 0, 0.175)`,
          background: `#fff`,
          capBackground: `rgba(0, 0, 0, 0.03)`,
        }
      }
    }
  }
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <MuiThemeProvider theme={createTheme()}>
            <GlobalStyles/>
            <Layout>
              <Outlet/>
            </Layout>
          </MuiThemeProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
