import { findNodeById, getNodeWidth } from "../util";

export default function calculate(
  nodes,
  startId,
  ITEM_HEIGHT,
  INDENT,
  FONT_SIZE
) {
  nodes = JSON.parse(JSON.stringify(nodes));
  // 根节点
  const root = findNodeById(nodes, startId);
  const rootWidth = getNodeWidth(root, FONT_SIZE);
  root.width = rootWidth;
  let MAX_X = rootWidth;
  let MAX_Y = ITEM_HEIGHT;
  let MAX_END = rootWidth;

  let SECOND_START_NODE_ID;
  let SECOND_END_NODE_ID;
  let second_start_x;
  let second_end_x;

  if (!root.contract) {
    const secondLevel = getStarts(nodes, root);
    for (let index = 0; index < secondLevel.length; index++) {
      const element = secondLevel[index];
      if (index === 0) {
        SECOND_START_NODE_ID = element.id;
        location(nodes, element, 10, ITEM_HEIGHT * 1.5);
      } else {
        if (index + 1 === secondLevel.length) {
          SECOND_END_NODE_ID = element.id;
        }
        location(nodes, element, MAX_END + 55, ITEM_HEIGHT * 1.5);
      }
    }
  }

  if (MAX_END === rootWidth) {
    MAX_END = MAX_END * 2;
  }

  // 根节点坐标
  root.x = (MAX_END - root.width) / 2;
  root.y = 1;

  return {
    max_x: MAX_X,
    max_y: MAX_Y + ITEM_HEIGHT,
    max_end: MAX_END,
    second_start_x: second_start_x,
    second_end_x: second_end_x,
    nodes: nodes
  };

  function getStarts(nodes, root) {
    const secondLevel = [];
    for (let index = 0; index < root.children.length; index++) {
      secondLevel.push(findNodeById(nodes, root.children[index]));
    }
    return secondLevel;
  }

  function location(nodes, node, x, y) {
    const nodeWidth = getNodeWidth(node, FONT_SIZE);
    node.x = x;
    node.y = y;
    node.width = nodeWidth;
    const childrenIds = node.children;
    let childX = x + INDENT;
    let childY = y;
    MAX_X = childX;
    if (MAX_END < node.x + nodeWidth) {
      MAX_END = node.x + nodeWidth;
    }

    if (node.id === SECOND_START_NODE_ID) {
      second_start_x = node.x + nodeWidth / 2;
    }
    if (node.id === SECOND_END_NODE_ID) {
      second_end_x = node.x + nodeWidth / 2;
    }

    if (!node.contract) {
      // 遍历子节点
      for (let index = 0; index < childrenIds.length; index++) {
        if (index === 0) {
          childY += ITEM_HEIGHT * 1.3;
        } else {
          childY += ITEM_HEIGHT;
        }
        if (childY > MAX_Y) {
          MAX_Y = childY;
        }
        const element = findNodeById(nodes, childrenIds[index]);
        // 最后一个子节点
        if (index + 1 === childrenIds.length) {
          location(nodes, element, childX, childY);
        } else {
          childY = location(nodes, element, childX, childY);
        }
      }
    }

    node.last_child_y = childY;
    return childY;
  }
}
