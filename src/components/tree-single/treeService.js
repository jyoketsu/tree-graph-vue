import _ from "lodash";
import { getStrWidth } from "../util";

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
  const rootWidth = getStrWidth(root.text, FONT_SIZE);
  root.width = rootWidth;
  let MAX_X = rootWidth;
  let MAX_Y = ITEM_HEIGHT;
  let MAX_END = rootWidth;

  let second_start_x;
  let second_end_x;

  if (!root.contract) {
    location(nodes, root, 10, 10);
  }

  return {
    max_x: MAX_X,
    max_y: MAX_Y,
    max_end: MAX_END,
    second_start_x: second_start_x,
    second_end_x: second_end_x,
    nodes: nodes
  };

  function location(nodes, node, x, y) {
    const nodeWidth = getStrWidth(node.text, FONT_SIZE);
    node.x = x;
    node.y = y;
    node.width = nodeWidth;
    const childrenIds = node.children;
    let childX = x + INDENT;
    let childY = y;
    let lastChildY = y;
    if (childX > MAX_X) {
      MAX_X = childX;
    }
    if (MAX_END < node.x + nodeWidth) {
      MAX_END = node.x + nodeWidth;
    }

    if (!node.contract) {
      // 遍历子节点
      for (let index = 0; index < childrenIds.length; index++) {
        childY += ITEM_HEIGHT;
        lastChildY += ITEM_HEIGHT;
        if (childY > MAX_Y) {
          MAX_Y = childY;
        }
        const element = findNodeById(nodes, childrenIds[index]);
        childY = location(nodes, element, childX, childY);
        // 最后一个子节点
        if (index + 1 !== childrenIds.length) {
          lastChildY = childY;
        }
      }
    }

    node.last_child_y = lastChildY;
    return childY;
  }

  function findNodeById(nodes, id) {
    const index = _.findIndex(nodes, function(o) {
      return o.id === id;
    });
    return nodes[index];
  }
}
