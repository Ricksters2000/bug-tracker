import {Priority, TicketStatus} from "@prisma/client";
import {DateRange} from "../types/DateRange";
import {FilterWithAllOption, allFilter} from "~/types/FilterWithAllOption";

export type TicketFilterClientSide = {
  title: string | null;
  createdDateRange: DateRange;
  dueDateRange: DateRange;
  statuses: Array<TicketStatus>;
  priority: FilterWithAllOption<Priority>;
}

export const defaultTicketFilterClientSide: TicketFilterClientSide = {
  title: null,
  priority: allFilter,
  statuses: [],
  createdDateRange: {
    from: null,
    to: null,
  },
  dueDateRange: {
    from: null,
    to: null,
  },
}