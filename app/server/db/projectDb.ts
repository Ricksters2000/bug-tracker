import {db} from "./db";

export type ProjectPreview = {
  id: string;
  title: string;
}

export const getProjectPreviews = async (): Promise<Array<ProjectPreview>> => {
  const projects = await db.project.findMany({
    select: {
      id: true,
      title: true,
    },
  })
  return projects
}