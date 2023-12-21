import emotionStyled from "@emotion/styled";
import type { MetaFunction } from "@remix-run/node";
import {H1} from "~/typography";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <Root>
      <H1>Your Dashboard</H1>
      
    </Root>
  );
}

const Root = emotionStyled(`div`)({
})