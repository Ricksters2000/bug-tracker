import emotionStyled from "@emotion/styled";
import {Grid} from "@mui/material";
import {Priority, Prisma, TicketStatus} from "@prisma/client";
import {json, type LoaderFunction, type MetaFunction} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {DefaultCard} from "~/components/cards/DefaultCard";
import {PieChart} from "~/components/charts/PieChart";
import {convertTicketPriorityCountsToChartDataRaw} from "~/components/charts/utils/ticketPieChartHelpers";
import {db} from "~/server/db/db";
import {getTicketCountsByField} from "~/server/db/ticketDb";
import {H1} from "~/typography";
import {useAppContext} from "./AppContext";
import {UserSelect} from "./components/UserSelect";
import {UserList} from "./components/UserList";

type LoaderData = {
  openTicketCount: number;
  unassignedTicketCount: number;
  ticketPriorityCounts: Record<Priority, number>;
  ticketStatusCounts: Record<TicketStatus, number>;
  projectUserToOpenTicketsCounts: Array<{
    projectTitle: string;
    openTicketCount: number;
    assignedUserCount: number;
  }>;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({params}) => {
  const {userId} = params
  if (!userId) {
    throw new Error(`Unexpected userId is not in params`)
  }
  const {role, companyId} = await db.user.findUniqueOrThrow({
    select: {
      role: true,
      companyId: true,
    },
    where: {id: parseInt(userId)}
  })
  const ticketFilter: Prisma.TicketWhereInput = {
    companyId,
    isClosed: false,
  }
  const openTicketCount = await db.ticket.count({where: ticketFilter})
  const unassignedTicketCount = await db.ticket.count({
    where: {
      ...ticketFilter,
      assignedUsers: {none: {}}
    },
  })
  const ticketPriorityCounts = await getTicketCountsByField(`priority`, ticketFilter)
  const ticketStatusCounts = await getTicketCountsByField(`status`, ticketFilter)
  const projectUserToOpenTicketsCounts = await db.project.findMany({
    select: {
      title: true,
      _count: {
        select: {
          tickets: {
            where: ticketFilter,
          },
          assignedUsers: true,
        },
      },
    },
    where: {companyId},
  })
  const data: LoaderData = {
    openTicketCount,
    unassignedTicketCount,
    ticketPriorityCounts,
    ticketStatusCounts,
    projectUserToOpenTicketsCounts: projectUserToOpenTicketsCounts.map(countData => ({
      projectTitle: countData.title,
      openTicketCount: countData._count.tickets,
      assignedUserCount: countData._count.assignedUsers,
    })),
  }
  return json(data)
}

export default function Dashboard() {
  const {
    openTicketCount,
    unassignedTicketCount,
    ticketPriorityCounts,
    ticketStatusCounts,
    projectUserToOpenTicketsCounts
  } = useLoaderData<LoaderData>()
  const {allUsers} = useAppContext()
  return (
    <Root>
      <H1>Your Dashboard</H1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <DefaultCard label="Open Tickets By Priority">
            <PieChart
              label="Open Tickets"
              data={convertTicketPriorityCountsToChartDataRaw(ticketPriorityCounts)}
              centerNumber={openTicketCount}
            />
          </DefaultCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DefaultCard label="Members">
            <UserList
              users={allUsers}
            />
          </DefaultCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DefaultCard label="Open Tickets By Status">
            <PieChart
              label="Open Tickets"
              data={convertTicketPriorityCountsToChartDataRaw(ticketPriorityCounts)}
              centerNumber={openTicketCount}
            />
          </DefaultCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DefaultCard label="Tickets">
            {/* <PieChart/> */}
          </DefaultCard>
        </Grid>
      </Grid>
    </Root>
  );
}

const Root = emotionStyled(`div`)({
})