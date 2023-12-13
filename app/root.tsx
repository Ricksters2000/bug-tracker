import { cssBundleHref } from "@remix-run/css-bundle";
import { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {Layout} from "./components/Layout";
import {AppTheme} from "./types/AppTheme";
import {ThemeProvider} from "@emotion/react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

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
        text: `#000`,
        primary: `rgba(13, 110, 253, 1)`,
        warning: `rgba(255, 193, 7, 1)`,
        success: `rgba(25, 135, 84, 1)`,
        danger: `rgba(220, 53, 69, 1)`,
        secondary: ``,
        info: ``,
        icon: `#000`,
        border: `rgba(0, 0, 0, 0.175)`,
        footer: `rgba(248, 349, 250, 1)`,
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
          <Layout/>
        </ThemeProvider>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
