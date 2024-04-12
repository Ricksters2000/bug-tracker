export type DemoUserKey = keyof typeof demoUsers

export const demoUsers = {
  admin: {
    email: `a@demo.com`,
    password: `123`,
  },
  projectManager: {
    email: `asbeans@gmail.com`,
    password: `123`,
  },
  developer: {
    email: `sf@demo.com`,
    password: `123`,
  },
  submitter: {
    email: `b@demo.com`,
    password: `123`,
  },
}