import {Project} from "@prisma/client";
import {db} from "./db";
import {TicketPreview, serializedTicketToTicketPreview, ticketPreviewSelectInput} from "./ticketDb";
import {SerializeFrom} from "@remix-run/node";

export type ProjectInfo = Project & {
  tickets: Array<TicketPreview>;
};

export type ProjectPreview = {
  id: string;
  title: string;
}

export const findProjectById = async (id: string): Promise<ProjectInfo | null> => {
  const project = await db.project.findUnique({
    select: {
      id: true,
      priority: true,
      createdDate: true,
      description: true,
      dueDate: true,
      title: true,
      tickets: {
        select: ticketPreviewSelectInput,
      },
    },
    where: {
      id,
    }
  })
  return project
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

export const serializedProjectToProjectInfo = (serializedProject: SerializeFrom<ProjectInfo>): ProjectInfo => {
  return {
    id: serializedProject.id,
    title: serializedProject.title,
    description: serializedProject.description,
    priority: serializedProject.priority,
    createdDate: new Date(serializedProject.createdDate),
    dueDate: serializedProject.dueDate ? new Date(serializedProject.dueDate) : null,
    tickets: serializedProject.tickets.map(serializedTicketToTicketPreview),
  }
}