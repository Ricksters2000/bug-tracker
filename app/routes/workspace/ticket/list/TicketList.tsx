import React from "react"
import {ActionFunction, json} from "@remix-run/node"
import {useFetcher} from "@remix-run/react"
import {Breadcrumbs} from "~/components/Breadcrumbs"
import {TicketPreview, convertTicketFilterClientSideToTicketFilterServerSide, findTicketPreviews, getTicketCounts, serializedTicketToTicketPreview} from "~/server/db/ticketDb"
import {H1} from "~/typography"
import {TicketFilter} from "../../components/TicketFilter"
import {TicketFilterClientSide, createDefaultTicketFilterClientSide} from "~/utils/defaultTicketFilterClientSide"
import {Priority} from "@prisma/client"
import {ProjectOption, findProjectOptionsByCompanyId} from "~/server/db/projectDb"
import {useAppContext} from "../../AppContext"

type ActionData = {
  tickets: Array<TicketPreview>;
  ticketCount: number;
  ticketPriorityCounts: Record<Priority, number>;
  projectOptions: Array<ProjectOption>;
}

export const action: ActionFunction = async ({request}) => {
  const filter = await request.json() as TicketFilterClientSide
  const ticketFilterInput = convertTicketFilterClientSideToTicketFilterServerSide(filter)
  const paginationOptions = filter.pagination
  const tickets = await findTicketPreviews(ticketFilterInput.filter, ticketFilterInput.orderBy, paginationOptions.limit, paginationOptions.offset)
  const ticketCounts = await getTicketCounts(ticketFilterInput.filter)
  const projectOptions = await findProjectOptionsByCompanyId(filter.companyId)
  const data: ActionData = {
    tickets,
    ticketPriorityCounts: ticketCounts,
    ticketCount: ticketCounts.low + ticketCounts.medium + ticketCounts.high,
    projectOptions,
  }
  return json(data)
}

export default function TicketList() {
  const {currentUser} = useAppContext()
  const [ticketFilter, setTicketFilter] = React.useState<TicketFilterClientSide>({
    ...createDefaultTicketFilterClientSide(currentUser.company.id),
  })  
  const fetcher = useFetcher<ActionData>()
  React.useEffect(() => {
    const stringifiedData = JSON.stringify(ticketFilter)
    fetcher.submit(stringifiedData, {
      method: `post`,
      encType: `application/json`,
    })
  }, [ticketFilter])

  if (!fetcher.data) return null
  const tickets = fetcher.data.tickets.map(serializedTicketToTicketPreview)
  return (
    <div>
      <H1>Tickets</H1>
      <Breadcrumbs currentLinkTitle="List"/>
      <TicketFilter
        tickets={tickets}
        ticketFilter={ticketFilter}
        onChange={setTicketFilter}
        priorityCounts={fetcher.data.ticketPriorityCounts}
        ticketCount={fetcher.data.ticketCount}
        projectOptions={fetcher.data.projectOptions}
        canChangeProjectId/>
    </div>
  )
}