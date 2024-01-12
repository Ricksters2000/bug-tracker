import emotionStyled from "@emotion/styled";
import {Grid} from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {DefaultCard} from "~/components/cards/DefaultCard";
import {PieChart} from "~/components/charts/PieChart";
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
      <Breadcrumbs paths={[`Dashboard`, `Test`]}/>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <DefaultCard label="Tickets">
            <PieChart/>
          </DefaultCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DefaultCard label="Tickets">
            <PieChart/>
          </DefaultCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DefaultCard label="Tickets">
            <PieChart/>
          </DefaultCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DefaultCard label="Tickets">
            <PieChart/>
          </DefaultCard>
        </Grid>
      </Grid>
    </Root>
  );
}

const Root = emotionStyled(`div`)({
})