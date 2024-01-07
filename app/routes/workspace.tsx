import {Outlet} from "@remix-run/react"
import {Layout} from "~/components/layout/Layout"

export default function Workspace() {
  return (
    <Layout>
      <Outlet/>
    </Layout>
  )
}