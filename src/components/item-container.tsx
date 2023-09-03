import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { twJoin } from "tailwind-merge";
import { ItemType } from "./data";

type ItemContainerProps = {
  id: string;
  item: ItemType;
  containerType: "item";
};

export function ItemContainer({ id, item, containerType }: ItemContainerProps) {
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
      item,
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
        `w-full min-h-[5rem] border border-black rounded-md overflow-hidden`,
        isDragging && "opacity-50"
      )}
    >
      <div className="h-[2rem] bg-blue-400 w-full">{item.title}</div>
      <p>{item.description}</p>
    </div>
  );
}
