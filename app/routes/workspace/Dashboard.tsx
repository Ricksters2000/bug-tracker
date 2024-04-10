import emotionStyled from "@emotion/styled";
import {Box, Grid, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {Priority, Prisma, TicketStatus} from "@prisma/client";
import {json, type LoaderFunction, type MetaFunction} from "@remix-run/node";
import {Link, useLoaderData} from "@remix-run/react";
import {DefaultCard} from "~/components/cards/DefaultCard";
import {PieChart} from "~/components/charts/PieChart";
import {convertTicketPriorityCountsToChartDataRaw, convertTicketStatusCountsToChartDataRaw} from "~/components/charts/utils/ticketPieChartHelpers";
import {db} from "~/server/db/db";
import {TicketMinimalInfo, findTicketMinimalInfos, getTicketCountsByField} from "~/server/db/ticketDb";
import {H1} from "~/typography";
import {useAppContext} from "./AppContext";
import {UserSelect} from "./components/UserSelect";
import {UserList} from "./components/UserList";
import {BarChart} from "~/components/charts/BarChart";
import {convertGenericDataToChartDatasets} from "~/components/charts/utils/convertDataToChartData";
import {SimpleDataCard} from "~/components/cards/SimpleDataCard";
import {getEndOfNearDueDate} from "~/utils/dueDateCalculate";
import {canViewAdvancedProjectAnalytics} from "./utils/roles/canViewAdvancedProjectAnalytics";
import {PriorityTag} from "./components/tags/PriorityTag";

type LoaderData = {
  openTicketCount: number;
  unassignedTicketCount: number;
  ticketsNearDueDateCount: number;
  ticketsPastDueDateCount: number;
  ticketPriorityCounts: Record<Priority, number>;
  ticketStatusCounts: Record<TicketStatus, number>;
  projectUserToOpenTicketsCounts: Array<{
    projectTitle: string;
    openTicketCount: number;
    assignedUserCount: number;
  }> | null;
  ticketsAssignedToUser: Array<TicketMinimalInfo>;
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
  const ticketsNearDueDateCount = await db.ticket.count({
    where: {
      ...ticketFilter,
      dueDate: {
        gte: new Date(),
        lte: getEndOfNearDueDate(),
      },
    },
  })
  const ticketsPastDueDateCount = await db.ticket.count({
    where: {
      ...ticketFilter,
      dueDate: {
        lte: new Date(),
      },
    },
  })
  const ticketPriorityCounts = await getTicketCountsByField(`priority`, ticketFilter)
  const ticketStatusCounts = await getTicketCountsByField(`status`, ticketFilter)
  const projectUserToOpenTicketsCounts = !canViewAdvancedProjectAnalytics(role) ? null : await db.project.findMany({
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
  const ticketsAssignedToUser = await findTicketMinimalInfos({
    ...ticketFilter,
    assignedUsers: {
      some: {id: parseInt(userId)}
    }
  })
  const data: LoaderData = {
    openTicketCount,
    unassignedTicketCount,
    ticketsNearDueDateCount,
    ticketsPastDueDateCount,
    ticketPriorityCounts,
    ticketStatusCounts,
    projectUserToOpenTicketsCounts: projectUserToOpenTicketsCounts?.map(countData => ({
      projectTitle: countData.title,
      openTicketCount: countData._count.tickets,
      assignedUserCount: countData._count.assignedUsers,
    })) ?? null,
    ticketsAssignedToUser,
  }
  return json(data)
}

export default function Dashboard() {
  const {
    openTicketCount,
    unassignedTicketCount,
    ticketsNearDueDateCount,
    ticketsPastDueDateCount,
    ticketPriorityCounts,
    ticketStatusCounts,
    projectUserToOpenTicketsCounts,
    ticketsAssignedToUser,
  } = useLoaderData<LoaderData>()
  const {allUsers} = useAppContext()
  return (
    <Root>
      <H1>Your Dashboard</H1>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <SimpleDataCard label="Total Open Tickets" data={openTicketCount}/>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SimpleDataCard label="Total Unassigned Tickets" data={unassignedTicketCount}/>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SimpleDataCard label="Tickets Due Soon" data={ticketsNearDueDateCount}/>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SimpleDataCard label="Tickets Past Due" data={ticketsPastDueDateCount}/>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <DefaultCard label="Open Tickets By Priority">
            <PieChart
              label="Open Tickets"
              data={convertTicketPriorityCountsToChartDataRaw(ticketPriorityCounts)}
              centerNumber={openTicketCount}
            />
          </DefaultCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DefaultCard label="Members">
            <UserList
              users={allUsers}
            />
          </DefaultCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DefaultCard label="Open Tickets By Status">
            <PieChart
              label="Open Tickets"
              data={convertTicketStatusCountsToChartDataRaw(ticketStatusCounts)}
              centerNumber={openTicketCount}
            />
          </DefaultCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DefaultCard label="Tickets Assigned to You">
            <List>
              {ticketsAssignedToUser.map(ticket => {
                return (
                  <ListItem key={ticket.id} disablePadding>
                    <ListItemButton component={Link} to={`./project/${ticket.projectId}/ticket/${ticket.id}`}>
                      <ListItemText
                        sx={{
                          display: `flex`,
                          flexDirection: `column-reverse`,
                        }}
                        primary={ticket.title}
                        secondary={
                          <Box display={`inline-flex`} alignItems={`center`} justifyContent={`space-between`} width={`100%`}>
                            <span>{ticket.dueDate}</span>
                            <PriorityTag priority={ticket.priority}/>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </DefaultCard>
        </Grid>
        {projectUserToOpenTicketsCounts &&
          <Grid item xs={12}>
            <DefaultCard label="Compare Users to Open Tickets per Project" height={`100%`}>
              <BarChart
                datasetsRaw={convertGenericDataToChartDatasets(projectUserToOpenTicketsCounts, `projectTitle`)}
              />
            </DefaultCard>
          </Grid>
        }
      </Grid>
    </Root>
  );
}

const Root = emotionStyled(`div`)({
})