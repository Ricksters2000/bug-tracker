import {Prisma} from "@prisma/client"
import {LoaderFunction, json, redirect} from "@remix-run/node"
import {Outlet, useLoaderData} from "@remix-run/react"
import {Layout} from "~/components/layout/Layout"
import {UserPublic, findUserById} from "~/server/db/userDb"

export const loader: LoaderFunction = async ({request, params}) => {
  const {userId} = params
  if (!userId) {
    return redirect(`/auth/login`)
  }
  const user = await findUserById(parseInt(userId))
  if (!user) {
    return redirect(`/auth/login`)
  }
  return json(user)
}

export default function Workspace() {
  const user = useLoaderData<UserPublic>()
  return (
    <Layout user={user}>
      <Outlet/>
    </Layout>
  )
}