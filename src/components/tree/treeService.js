import _ from "lodash";
import { getStrWidth } from "../util";

export default function calculate(
  nodes,
  startId,
  ITEM_HEIGHT,
  INDENT,
  FONT_SIZE
) {
  // 根节点
  const root = findNodeById(nodes, startId);
  const rootWidth = getStrWidth(root.text, FONT_SIZE);
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
        location(nodes, element, 10, 80);
      } else {
        if (index + 1 === secondLevel.length) {
          SECOND_END_NODE_ID = element.id;
        }
        location(nodes, element, MAX_END + 55, 80);
      }
    }
  }

  // 根节点坐标
  root.x = MAX_X / 2;
  root.y = 1;

  return {
    max_x: MAX_X,
    max_y: MAX_Y,
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
    const nodeWidth = getStrWidth(node.text, FONT_SIZE);
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
        childY += ITEM_HEIGHT;
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

    node.max_child_y = childY;
    console.log("MAX_END", MAX_END);

    return childY;
  }

  function findNodeById(nodes, id) {
    const index = _.findIndex(nodes, function(o) {
      return o.id === id;
    });
    return nodes[index];
  }
}
