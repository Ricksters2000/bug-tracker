import {Project} from "@prisma/client";
import {db} from "./db";
import {TicketPreview, serializedTicketToTicketPreview, ticketPreviewSelectInput} from "./ticketDb";
import {SerializeFrom} from "@remix-run/node";
import {UserPublic, userPublicSelectInput} from "./userDb";

export type ProjectInfo = Project & {
  tickets: Array<TicketPreview>;
  assignedUsers: Array<UserPublic>;
};

export type ProjectPreview = Pick<Project, `id` | `title` | `createdDate` | `dueDate` | `priority`> & {
  openTicketCount: number;
  assignedUserCount: number;
}

export type ProjectOption = Pick<Project, `id` | `title`>

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
      assignedUsers: {
        select: userPublicSelectInput,
      }
    },
    where: {
      id,
    }
  })
  return project
}

export const findProjectPreviews = async (): Promise<Array<ProjectPreview>> => {
  const projects = await db.project.findMany({
    select: {
      id: true,
      title: true,
      createdDate: true,
      dueDate: true,
      priority: true,
      _count: {
        select: {
          assignedUsers: true,
          tickets: {
            where: {
              status: {not: `completed`}
            }
          }
        },
      },
    },
  })
  return projects.map(project => ({
    id: project.id,
    title: project.title,
    createdDate: project.createdDate,
    dueDate: project.dueDate,
    priority: project.priority,
    openTicketCount: project._count.tickets,
    assignedUserCount: project._count.assignedUsers,
  }))
}

export const findProjectOptions = async (): Promise<Array<ProjectOption>> => {
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
    assignedUsers: serializedProject.assignedUsers,
  }
}

export const serializedProjectToProjectPreview = (serializedProject: SerializeFrom<ProjectPreview>): ProjectPreview => {
  return {
    id: serializedProject.id,
    title: serializedProject.title,
    priority: serializedProject.priority,
    createdDate: new Date(serializedProject.createdDate),
    dueDate: serializedProject.dueDate ? new Date(serializedProject.dueDate) : null,
    openTicketCount: serializedProject.openTicketCount,
    assignedUserCount: serializedProject.assignedUserCount,
  }
}