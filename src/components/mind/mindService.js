import { findNodeById, getNodeWidth } from "../util";

export default function calculate(
  nodes,
  startId,
  single,
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
  let MAX_END = rootWidth * 1.5;

  let MIN_X = 0;
  let MIN_END = 0;

  if (single) {
    location(nodes, root, 10, 10);
  } else {
    if (!root.contract) {
      let { rightStarts, leftStarts } = getStarts(nodes, root);

      let [x1, y1, x2, y2] = [
        10 + rootWidth + INDENT * 2,
        10,
        -10 - INDENT * 2,
        10
      ];

      for (let index = 0; index < rightStarts.length; index++) {
        let node = rightStarts[index];
        y1 = location(nodes, node, x1, y1);
        if (index + 1 !== rightStarts.length) {
          y1 += ITEM_HEIGHT * 1.3;
          if (y1 > MAX_Y) {
            MAX_Y = y1;
          }
        }
      }

      for (let index = 0; index < leftStarts.length; index++) {
        let node = leftStarts[index];
        y2 = location(nodes, node, x2, y2, true);
        if (index + 1 !== leftStarts.length) {
          y2 += ITEM_HEIGHT * 1.3;
          if (y2 > MAX_Y) {
            MAX_Y = y2;
          }
        }
      }

      const diff = Math.abs(MIN_END);
      for (let index = 0; index < nodes.length; index++) {
        let node = nodes[index];
        node.x = node.x + diff;
      }
      MAX_X = MAX_X + Math.abs(MIN_X);
      MAX_END = MAX_END + Math.abs(MIN_END);
      root.x = Math.abs(MIN_END);
      root.y = MAX_Y / 2;
      root.rightDots = [];
      root.leftDots = [];
      for (let index = 0; index < leftStarts.length; index++) {
        const element = leftStarts[index];
        root.leftDots.push(element.y);
      }
      for (let index = 0; index < rightStarts.length; index++) {
        const element = rightStarts[index];
        root.rightDots.push(element.y);
      }
    } else {
      root.x = 10;
      root.y = 10;
      delete root.rightDots;
      delete root.leftDots;
    }
  }

  return {
    max_x: MAX_X,
    max_y: MAX_Y + ITEM_HEIGHT,
    max_end: MAX_END,
    nodes: nodes
  };

  function getStarts(nodes, root) {
    let rightStarts = [];
    let leftStarts = [];
    for (let index = 0; index < root.children.length; index++) {
      if (index % 2 === 0) {
        rightStarts.push(findNodeById(nodes, root.children[index]));
      } else {
        leftStarts.push(findNodeById(nodes, root.children[index]));
      }
    }
    return {
      rightStarts: rightStarts,
      leftStarts: leftStarts
    };
  }

  function location(nodes, node, x, y, toLeft) {
    const nodeWidth = getNodeWidth(node, FONT_SIZE);
    node.x = x;
    node.width = nodeWidth;
    if (toLeft) {
      node.toLeft = true;
      node.x = node.x - nodeWidth;
    } else {
      delete node.toLeft;
    }
    node.dots = [];
    const childrenIds = node.children;

    let childY = y;

    let childX;

    if (!toLeft) {
      childX = x + nodeWidth + INDENT * 2;
      if (childX > MAX_X) {
        MAX_X = childX;
      }
      if (MAX_END < node.x + nodeWidth) {
        MAX_END = node.x + nodeWidth;
      }
    } else {
      childX = x - nodeWidth - INDENT * 2;
      if (childX < MIN_X) {
        MIN_X = childX;
      }
      if (MIN_END > node.x - nodeWidth) {
        MIN_END = node.x - nodeWidth;
      }
    }

    if (!node.contract) {
      // 遍历子节点
      for (let index = 0; index < childrenIds.length; index++) {
        let element = findNodeById(nodes, childrenIds[index]);
        childY = location(nodes, element, childX, childY, toLeft);
        node.dots.push(element.y);
        if (index + 1 !== childrenIds.length) {
          childY += ITEM_HEIGHT * 1.3;
          if (childY > MAX_Y) {
            MAX_Y = childY;
          }
        }
      }
    }
    node.y = (y + childY) / 2;
    return childY;
  }
}
