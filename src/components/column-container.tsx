import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { twJoin } from "tailwind-merge";
import { ColumnType } from "./data";

type ColumnContainerProps = {
  children: React.ReactNode;
  id: string;
  column: ColumnType;
  containerType: "column";
};

export function ColumnContainer({
  children,
  id,
  column,
  containerType,
}: ColumnContainerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      containerType,
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={twJoin(
        `border border-black rounded-md p-5 gap-5 flex-col flex h-full`,
        isDragging && "opacity-50"
      )}
    >
      <h2>{column.title}</h2>
      <div className="w-full h-full flex flex-col gap-5">{children}</div>
    </div>
  );
}
