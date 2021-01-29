import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
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
  width = 400,
  renderKey = '', // when this changes, whole list re-renders
}) => {
  const grid = 8;
  const [sortedItems, setSortedItems] = useState(items);

  const getItemStyle = (isDragging, draggableStyle) => ({
    background: isDragging ? 'lightblue' : '#f0f0f0',
    margin: isVertical ? `0 0 ${grid}px 0` : `0 ${grid}px 0 0`,
    userSelect: 'none',
    width: isVertical ? '100%' : 'auto',
    ...draggableStyle
  });

  const getListStyle = isDraggingOver => ({
    alignItems: 'center',
    background: isDraggingOver ? '#ffa' : '#fafafa',
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    flexWrap: 'nowrap',
    padding: grid,
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

  const getKey = item => `${item.id || '0'}|${item.label}|${item.url}`;

  React.useEffect(() => {
    setSortedItems(items);
  }, [renderKey])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={`droppable-${type}`} direction={isVertical ? 'vertical' : 'horizontal'}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {sortedItems.map((item, index) => (
              <Draggable key={getKey(item)} draggableId={`draggable-${getKey(item)}`} index={index}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    <Grid container justify="flex-start" alignItems="center" direction={isVertical ? 'row' : 'column-reverse'}>
                      <Grid item>
                        <DragIcon fontSize="large" color="disabled" style={{ transform: isVertical ? 'none' : 'rotateZ(90deg)' }} />
                      </Grid>
                      <Grid item style={{ padding: 4 }}>
                        <ItemComponent item={item} type={type} />
                      </Grid>
                    </Grid>
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
  ItemComponent: PropTypes.func.isRequired, // functional component
  type: PropTypes.oneOf(Object.keys(LIST_TYPES)).isRequired,
  handleDragEndAsync: PropTypes.func, // (type, items) as props
  isVertical: PropTypes.bool,
  width: PropTypes.string, // hint: set it '100%' for horizontal list
}

export default DraggableList;
