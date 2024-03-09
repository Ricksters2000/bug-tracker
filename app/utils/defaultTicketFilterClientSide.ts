import {Priority, Prisma, TicketStatus} from "@prisma/client";
import {DateRange} from "../types/DateRange";
import {FilterWithAllOption, allFilter} from "~/types/FilterWithAllOption";
import {objectKeys} from "./objectKeys";

export type TicketFilterClientSide = {
  title: string | null;
  companyId: string;
  createdDateRange: DateRange;
  dueDateRange: DateRange;
  statuses: Array<TicketStatus>;
  priority: FilterWithAllOption<Priority>;
  projectIds: Array<FilterWithAllOption<string>>;
  orderBy: {
    field: keyof Prisma.TicketOrderByWithRelationInput;
    order: Prisma.SortOrder;
  };
  pagination: {
    limit: number;
    offset: number;
  }
}

export const createDefaultTicketFilterClientSide = (companyId: string): TicketFilterClientSide => ({
  companyId,
  title: null,
  projectIds: [allFilter],
  priority: allFilter,
  statuses: objectKeys(TicketStatus).filter(status => status !== `completed`),
  createdDateRange: {
    from: null,
    to: null,
  },
  dueDateRange: {
    from: null,
    to: null,
  },
  orderBy: {
    field: `title`,
    order: `asc`,
  },
  pagination: {
    limit: 20,
    offset: 0,
  }
})