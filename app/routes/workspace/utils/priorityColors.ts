import {$Enums} from "@prisma/client";

type Color = {
  foreground: string;
  background: string;
}

export const priorityColors: Record<$Enums.Priority, Color> = {
  low: {
    foreground: `#118d57`,
    background: `#22c55e29`,
  },
  medium: {
    foreground: `#b76e00`,
    background: `#ffab0029`,
  },
  high: {
    foreground: `#b71d18`,
    background: `#ff563029`,
  },
}