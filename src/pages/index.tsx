import { ColumnContainer } from "@/components/column-container";
import {
  CONTAINER_TYPES,
  ColumnType,
  ContainerType,
  DEFAULT_COLUMNS,
  DEFAULT_ITEMS,
  ItemType,
} from "@/components/data";
import { ItemContainer } from "@/components/item-container";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";

type ColumnWithItems = ColumnType & {
  items: ItemType[];
};

type ContainerData = Array<ColumnWithItems>;

type ActiveContainerType = {
  containerType: ContainerType;
  item?: ItemType;
  column?: ColumnWithItems;
};

export default function Home() {
  const DEFAULT_CONTAINER_DATA = transformColumnAndItemToContainerData(
    DEFAULT_COLUMNS,
    DEFAULT_ITEMS
  );

  const [containerData, setContainerData] = useState(DEFAULT_CONTAINER_DATA);
  const [activeContainer, setActiveContainer] =
    useState<ActiveContainerType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (!active) return;

    const activeData = active.data.current as {
      containerType: ContainerType;
      item?: ItemType;
      column?: ColumnWithItems;
    };

    setActiveContainer(activeData);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    const activeData = active.data.current as {
      containerType: ContainerType;
      item?: ItemType;
      column?: ColumnWithItems;
    };
    const overData = over.data.current as {
      containerType: ContainerType;
      item?: ItemType;
      column?: ColumnWithItems;
    };

    /* Column To Colum */
    if (
      activeData.containerType === CONTAINER_TYPES.Column &&
      overData.containerType === CONTAINER_TYPES.Column &&
      activeData.column &&
      overData.column
    ) {
      const activeColumn = activeData.column;
      const overColumn = overData.column;

      const activeColumnIndex = containerData.findIndex(
        (column) => column.id === activeColumn.id
      );
      const overColumnIndex = containerData.findIndex(
        (column) => column.id === overColumn.id
      );

      let newContainerData = [...containerData];

      newContainerData = arrayMove(
        newContainerData,
        activeColumnIndex,
        overColumnIndex
      );

      setContainerData(newContainerData);
    }

    /* Item to Column */
    if (
      activeData.containerType === CONTAINER_TYPES.Item &&
      overData.containerType === CONTAINER_TYPES.Column &&
      activeData.item &&
      overData.column
    ) {
      const activeItem = activeData.item;
      const overColumn = overData.column;

      const activeColumnIndex = containerData.findIndex(
        (column) => column.id === activeItem.columnId
      );
      const overColumnIndex = containerData.findIndex(
        (column) => column.id === overColumn.id
      );

      const newContainerData = [...containerData];
      const newActiveColumn = { ...newContainerData[activeColumnIndex] };
      const newOverColumn = { ...newContainerData[overColumnIndex] };

      const activeItemIndex = newActiveColumn.items.findIndex(
        (item) => item.id === activeItem.id
      );

      if (newActiveColumn && newOverColumn) {
        const [movedItem] = newActiveColumn.items.splice(activeItemIndex, 1);

        movedItem.columnId = newOverColumn.id;
        newOverColumn.items.push(movedItem);
        newContainerData[overColumnIndex] = newOverColumn;

        setContainerData(newContainerData);
      }
    }

    /* Item to Item */
    if (
      activeData.containerType === CONTAINER_TYPES.Item &&
      overData.containerType === CONTAINER_TYPES.Item &&
      activeData.item &&
      overData.item
    ) {
      const activeItem = activeData.item;
      const overItem = overData.item;

      const activeColumnIndex = containerData.findIndex(
        (column) => column.id === activeItem.columnId
      );
      const overColumnIndex = containerData.findIndex(
        (column) => column.id === overItem.columnId
      );

      const newContainerData = [...containerData];
      const newActiveColumn = { ...newContainerData[activeColumnIndex] };
      const newOverColumn = { ...newContainerData[overColumnIndex] };

      const activeItemIndex = newActiveColumn.items.findIndex(
        (item) => item.id === activeItem.id
      );
      const overItemIndex = newOverColumn.items.findIndex(
        (item) => item.id === overItem.id
      );

      if (newActiveColumn.id === newOverColumn.id) {
        /* Same column */
        newActiveColumn.items = arrayMove(
          newActiveColumn.items,
          activeItemIndex,
          overItemIndex
        );

        newContainerData[activeColumnIndex] = newActiveColumn;

        setContainerData(newContainerData);
      } else {
        /* Different column */
        const [movedItem] = newActiveColumn.items.splice(activeItemIndex, 1);

        movedItem.columnId = newOverColumn.id;
        newOverColumn.items.splice(overItemIndex, 0, movedItem);
        newContainerData[overColumnIndex] = newOverColumn;

        setContainerData(newContainerData);
      }
    }
    setActiveContainer(null);
  };

  return (
    <div className="w-screen h-screen flex flex-col gap-5 p-5">
      <h1 className="font-bold text-[2rem]">Project Something</h1>
      <div className="grid grid-flow-col auto-cols-fr h-full gap-5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={containerData.map((column) => column.id)}>
            {containerData.map((column) => (
              <ColumnContainer
                key={column.id}
                id={column.id}
                column={column}
                containerType={CONTAINER_TYPES.Column}
              >
                <SortableContext items={column.items.map((item) => item.id)}>
                  {column.items.map((item) => (
                    <ItemContainer
                      key={item.id}
                      id={item.id}
                      item={item}
                      containerType={CONTAINER_TYPES.Item}
                    />
                  ))}
                </SortableContext>
              </ColumnContainer>
            ))}
          </SortableContext>
          <DragOverlay>
            {activeContainer?.containerType === CONTAINER_TYPES.Item &&
              activeContainer?.item && (
                <ItemContainer
                  id={activeContainer.item.id}
                  item={activeContainer.item}
                  containerType={CONTAINER_TYPES.Item}
                />
              )}

            {activeContainer?.containerType === CONTAINER_TYPES.Column &&
              activeContainer?.column && (
                <ColumnContainer
                  id={activeContainer.column.id}
                  column={activeContainer.column}
                  containerType={CONTAINER_TYPES.Column}
                >
                  {activeContainer.column.items.map((item) => (
                    <ItemContainer
                      key={item.id}
                      id={item.id}
                      item={item}
                      containerType={CONTAINER_TYPES.Item}
                    />
                  ))}
                </ColumnContainer>
              )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

function transformColumnAndItemToContainerData(
  columns: ColumnType[],
  items: ItemType[]
): ContainerData {
  return columns.map((column) => ({
    id: column.id,
    title: column.title,
    items: items.filter((item) => item.columnId === column.id),
  }));
}
