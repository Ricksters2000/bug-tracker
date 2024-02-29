import {dashboardId, workspaceId} from './config/routeIds.js'

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  serverPlatform: `node`,
  appDirectory: "app",
  routes: (defineRoutes) => {
    const routesFolder = `routes`
    const authenticationFolder = `${routesFolder}/authentication`
    const workspaceFolder = `${routesFolder}/workspace`
    const projectFolder = `${workspaceFolder}/project`
    const ticketFolder = `${workspaceFolder}/ticket`
    const userFolder = `${workspaceFolder}/user`
    return defineRoutes(route => {
      route(`/auth`, `${authenticationFolder}/Layout.tsx`, () => {
        route(`login`, `${authenticationFolder}/login/Login.tsx`)
        route(`register`, `${authenticationFolder}/register/Register.tsx`)
      })
      route(`/workspace/:userId`, `${workspaceFolder}/layout/Layout.tsx`, {id: workspaceId}, () => {
        route(``, `${workspaceFolder}/Dashboard.tsx`, {index: true, id: dashboardId})
        // project routes
        route(`project`, `${projectFolder}/AllProjects.tsx`)
        route(`project/create`, `${projectFolder}/create/CreateProject.tsx`)
        route(`project/:projectId`, `${projectFolder}/ProjectLoader.tsx`, () => {
          route(``, `${projectFolder}/projectDetails/Project.tsx`, {index: true})
          route(`edit`, `${projectFolder}/edit/EditProject.tsx`)
        })
        // ticket routes
        route(`ticket`, `${ticketFolder}/AllTickets.tsx`)
        route(`ticket/create`, `${ticketFolder}/create/CreateTicket.tsx`)
        route(`project/:projectId/ticket/:ticketId`, `${ticketFolder}/ticketDetails/Ticket.tsx`)
        // user routes
        route(`user/create`, `${userFolder}/create/CreateUser.tsx`)
        route(`user/roles`, `${userFolder}/roles/UserRoles.tsx`)
      })
      route(`/api/get-project-options`, `${workspaceFolder}/api/getProjectOptions.ts`)
    })
  },
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
