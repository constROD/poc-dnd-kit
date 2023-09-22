export const CONTAINER_TYPES = {
  Column: "column",
  Item: "item",
} as const;

export type ContainerType =
  (typeof CONTAINER_TYPES)[keyof typeof CONTAINER_TYPES];

export const DEFAULT_ITEMS = Array.from({ length: 100 }, (_, i) => ({
  id: `item-${i}-id`,
  title: `Item ${i}`,
  description: `This is item ${i}`,
  columnId: `column-${i % 5}-id`,
}));

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
