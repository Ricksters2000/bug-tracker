import {LoaderFunction, json, redirect} from "@remix-run/node"
import {Outlet, useLoaderData} from "@remix-run/react"
import {LayoutContainer} from "~/routes/workspace/layout/components/LayoutContainer"
import {UserPublic, UserPublicWithCompany, authenticateUserWithSessionId, findAllUsersByCompanyId, findUserWithCompany} from "~/server/db/userDb"
import {AppContextValue, AppContext} from "../AppContext"
import {CommonHandle} from '~/utils/CommonHandle';
import {BreadcrumbLink} from "~/typography"
import {getSession} from "~/sessions"

export const handle: CommonHandle<WorkspaceLoaderData> = {
  breadcrumb: ({params, data}) => {
    const {userId} = params
    return <BreadcrumbLink to={`/workspace/${userId}`}>{`Dashboard`}</BreadcrumbLink>
  }
}

export type WorkspaceLoaderData = {
  currentUser: UserPublicWithCompany;
  allUsers: Array<UserPublic>;
}

export const loader: LoaderFunction = async ({request, params}) => {
  const {userId} = params
  if (!userId) {
    return redirect(`/auth/login`)
  }
  const session = await getSession(request.headers.get(`Cookie`))
  const sessionId = session.get(`userSessionId`)
  const user = await authenticateUserWithSessionId(parseInt(userId), sessionId)
  if (!user) {
    return redirect(`/auth/login`)
  }
  const users = await findAllUsersByCompanyId(user.company.id)
  const workspaceData: WorkspaceLoaderData = {
    currentUser: user,
    allUsers: users,
  }
  return json(workspaceData)
}

export default function Workspace() {
  const data = useLoaderData<WorkspaceLoaderData>()
  const appContext: AppContextValue = {
    currentUser: data.currentUser,
    allUsers: data.allUsers,
  }
  return (
    <LayoutContainer user={data.currentUser}>
      <AppContext.Provider value={appContext}>
        <Outlet/>
      </AppContext.Provider>
    </LayoutContainer>
  )
}