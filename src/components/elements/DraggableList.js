import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PropTypes from 'prop-types';
import DragIcon from '@material-ui/icons/DragIndicator';
import { LIST_TYPES } from '../../constants';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const DraggableList = ({
  items = [],
  ItemComponent,
  type,
  handleDragEndAsync = () => {},
  isVertical = true,
  width = 250,
}) => {

  const grid = 8;
  const [sortedItems, setSortedItems] = useState(items);

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    paddingLeft: 36, // for drag icon
    position: 'relative',
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? 'lightblue' : '#f0f0f0',
    ...draggableStyle
  });

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#ffa' : '#fafafa',
    padding: grid,
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    width,
  });

  const onDragEnd = async result => {
    if (!result.destination || result.source.index === result.destination.index) {
      return;
    }
    const reSortedItems = reorder(sortedItems, result.source.index, result.destination.index)
      .map((item, key) => ({ ...item, priority: key }));
    setSortedItems(reSortedItems);
    await handleDragEndAsync(type, reSortedItems);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {sortedItems.map((item, index) => (
              <Draggable key={item.label} draggableId={item.label} index={index}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    <DragIcon size="large" style={{ position: 'absolute', left: 5, top: 15 }} />
                    <ItemComponent item={item} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

DraggableList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string,
    url: PropTypes.string,
    priority: PropTypes.number,
  })),
  ItemComponent: PropTypes.node.isRequired,
  type: PropTypes.oneOf(Object.keys(LIST_TYPES)).isRequired,
  handleDragEndAsync: PropTypes.func, // (type, items) as props
  isVertical: PropTypes.bool,
  width: PropTypes.string, // hint: set it '100%' for horizontal list
}

export default DraggableList;
