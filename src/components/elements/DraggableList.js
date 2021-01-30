import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import DragIcon from '@material-ui/icons/DragIndicator';
import { MENU_TYPES, LIST_TYPES } from '../../constants';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const DraggableList = ({
  items = [],
  parentItem = {},
  ItemComponent,
  type,
  handleDragEndAsync = () => {},
  isVertical = true,
  isCompact = false,
  showDragIcon = true,
  width = 400,
  renderKey = '', // when this changes, whole list re-renders
}) => {
  const grid = isCompact ? 2 : 8;
  const [sortedItems, setSortedItems] = useState(items);

  const getItemStyle = (isDragging, draggableStyle) => ({
    background: isDragging ? 'lightblue' : '#f0f0f0',
    margin: isVertical ? `0 0 ${grid * 2}px 0` : `0 ${grid}px 0 0`,
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
    await handleDragEndAsync({ type, parentItem, items: reSortedItems });
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
                    {showDragIcon ?
                      (
                        <Grid container justify="flex-start" alignItems="center" direction={isVertical ? 'row' : 'column-reverse'}>
                          <Grid item>
                            <DragIcon fontSize={isCompact ? 'small' : 'large'} color="disabled"
                                      style={{ transform: isVertical ? 'none' : 'rotateZ(90deg)' }} />
                          </Grid>
                          <Grid item style={{ padding: isCompact ? 2 : 4 }}>
                            <ItemComponent item={item} type={type} />
                          </Grid>
                        </Grid>
                      ) :
                      <ItemComponent item={item} type={type} />
                    }
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
  })).isRequired,
  ItemComponent: PropTypes.func.isRequired, // functional component
  type: PropTypes.oneOf([...MENU_TYPES, ...Object.keys(LIST_TYPES)]).isRequired,
  handleDragEndAsync: PropTypes.func.isRequired, // ({ type, items }) as props
  parentItem: PropTypes.object,
  isCompact: PropTypes.bool, // true makes a more dense layout
  isVertical: PropTypes.bool,
  width: PropTypes.string, // hint: set it '100%' for horizontal list
}

export default DraggableList;
