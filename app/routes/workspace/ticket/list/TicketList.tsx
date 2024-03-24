import React from "react"
import {ActionFunction, LoaderFunction, json} from "@remix-run/node"
import {useFetcher, useLoaderData} from "@remix-run/react"
import {Breadcrumbs} from "~/components/Breadcrumbs"
import {TicketPreview, convertTicketFilterClientSideToTicketFilterServerSide, findTicketPreviews, getTicketCountsByField, serializedTicketToTicketPreview} from "~/server/db/ticketDb"
import {H1} from "~/typography"
import {TicketFilter} from "../../components/TicketFilter"
import {TicketFilterClientSide, createDefaultTicketFilterClientSide} from "~/utils/defaultTicketFilterClientSide"
import {Priority} from "@prisma/client"
import {ProjectOption, findProjectOptionsByCompanyId} from "~/server/db/projectDb"
import {useAppContext} from "../../AppContext"
import {db} from "~/server/db/db"

type LoaderData = {
  projectOptions: Array<ProjectOption>;
}

export const loader: LoaderFunction = async ({request, params}) => {
  const {userId} = params
  if (!userId) throw new Error(`Unexpected userId not found from params`)
  const user = await db.user.findUnique({select: {companyId: true}, where: {id: parseInt(userId)}})
  if (!user) throw new Error(`User with id: ${userId} not found`)
  const projectOptions = await findProjectOptionsByCompanyId(user.companyId)
  const data: LoaderData = {
    projectOptions,
  }
  return json(data)
}

export default function TicketList() {
  const data = useLoaderData<LoaderData>()
  return (
    <div>
      <H1>Tickets</H1>
      <Breadcrumbs currentLinkTitle="List"/>
      <TicketFilter projectOptions={data.projectOptions} canChangeProjectId/>
    </div>
  )
}