export const CONTAINER_TYPES = {
  Column: "column",
  Item: "item",
} as const;

export type ContainerType =
  (typeof CONTAINER_TYPES)[keyof typeof CONTAINER_TYPES];

export const DEFAULT_ITEMS = [
  {
    id: "item-1-id",
    title: "Item 1",
    description: "This is item 1",
    columnId: "column-1-id",
  },
  {
    id: "item-2-id",
    title: "Item 2",
    description: "This is item 2",
    columnId: "column-1-id",
  },
  {
    id: "item-3-id",
    title: "Item 3",
    description: "This is item 3",
    columnId: "column-2-id",
  },
  {
    id: "item-4-id",
    title: "Item 4",
    description: "This is item 4",
    columnId: "column-2-id",
  },
];

export type ItemType = (typeof DEFAULT_ITEMS)[number];

export const DEFAULT_COLUMNS = [
  {
    id: "column-1-id",
    title: "Todo",
  },
  {
    id: "column-2-id",
    title: "In Progress",
  },
  {
    id: "column-3-id",
    title: "For Testing",
  },
  {
    id: "column-4-id",
    title: "Done",
  },
];

export type ColumnType = (typeof DEFAULT_COLUMNS)[number];
