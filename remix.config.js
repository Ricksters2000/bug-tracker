import {dashboardId, workspaceId} from './config/routeIds.js'

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  serverPlatform: `node`,
  appDirectory: "app",
  serverDependenciesToBundle: [
    `aos`,
  ],
  routes: (defineRoutes) => {
    const routesFolder = `routes`
    const authenticationFolder = `${routesFolder}/authentication`
    const workspaceFolder = `${routesFolder}/workspace`
    const projectFolder = `${workspaceFolder}/project`
    const ticketFolder = `${workspaceFolder}/ticket`
    const userFolder = `${workspaceFolder}/user`
    return defineRoutes(route => {
      route(``, `${routesFolder}/index/Index.tsx`, {index: true})
      route(`/auth`, `${authenticationFolder}/Layout.tsx`, () => {
        route(`login`, `${authenticationFolder}/login/Login.tsx`)
        route(`register`, `${authenticationFolder}/register/Register.tsx`)
        route(`preview`, `${authenticationFolder}/previewLogin/PreviewLogin.tsx`)
      })
      route(`/workspace/:userId`, `${workspaceFolder}/layout/Layout.tsx`, {id: workspaceId}, () => {
        route(``, `${workspaceFolder}/Dashboard.tsx`, {index: true, id: dashboardId})
        // project routes
        route(`project`, `${projectFolder}/ProjectLayout.tsx`, () => {
          route(``, `${projectFolder}/list/ProjectList.tsx`, {index: true})
          route(`archived`, `${projectFolder}/archived/ArchivedProjects.tsx`)
          route(`create`, `${projectFolder}/create/CreateProject.tsx`)
          route(`:projectId`, `${projectFolder}/ProjectLoader.tsx`, () => {
            route(``, `${projectFolder}/projectDetails/Project.tsx`, {index: true})
            route(`edit`, `${projectFolder}/edit/EditProject.tsx`)
            route(`ticket/:ticketId`, `${ticketFolder}/ticketDetails/Ticket.tsx`)
          })
        })
        // ticket routes
        route(`ticket`, `${ticketFolder}/TicketLayout.tsx`, () => {
          route(``, `${ticketFolder}/list/TicketList.tsx`, {index: true})
          route(`create`, `${ticketFolder}/create/CreateTicket.tsx`)
        })
        // user routes
        route(`user/create`, `${userFolder}/create/CreateUser.tsx`)
        route(`user/roles`, `${userFolder}/roles/UserRoles.tsx`)
      })
      route(`/api/get-project-options`, `${workspaceFolder}/api/getProjectOptions.ts`)
      route(`/api/close-tickets`, `${workspaceFolder}/api/closeTickets.ts`)
      route(`/api/ticket-filter`, `${workspaceFolder}/api/getTicketsFromFilter.ts`)
    })
  },
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
