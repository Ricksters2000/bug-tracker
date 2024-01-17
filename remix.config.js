/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  routes: (defineRoutes) => {
    const routesFolder = `routes/`
    return defineRoutes(route => {
      route(`/auth`, `${routesFolder}authentication/Layout.tsx`, () => {
        route(`login`, `${routesFolder}authentication/login/Login.tsx`)
        route(`register`, `${routesFolder}authentication/register/Register.tsx`)
      })
      route(`/workspace/:userId`, `${routesFolder}workspace/layout/Layout.tsx`, () => {
        route(``, `${routesFolder}workspace/Dashboard.tsx`, {index: true})
        // project routes
        route(`project`, `${routesFolder}workspace/project/AllProjects.tsx`)
        route(`project/create`, `${routesFolder}workspace/project/create/CreateProject.tsx`)
        // route(`:projectId`, `${routesFolder}workspace/project/projectDetails/Project.tsx`)
        // ticket routes
        route(`ticket`, `${routesFolder}workspace/ticket/AllTickets.tsx`)
        route(`ticket/create`, `${routesFolder}workspace/ticket/create/CreateTicket.tsx`)
      })
    })
  }
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
