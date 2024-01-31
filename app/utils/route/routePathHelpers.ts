import {useRouteLoaderData} from "@remix-run/react"
import {routeIds} from "./routeIds"
import {WorkspaceLoaderData} from "~/routes/workspace/layout/Layout"

export const useWorkspacePath = () => {
  const data = useRouteLoaderData<WorkspaceLoaderData>(routeIds.workspace)
  if (!data) throw new Error(`Unexpected no user data found from useWorkspacePath()`)
  return `/workspace/${data.id}`
}

export const getTicketPath = (workspacePath: string, projectId: string, ticketId: string) => {
  return `${workspacePath}/project/${projectId}/ticket/${ticketId}`
}