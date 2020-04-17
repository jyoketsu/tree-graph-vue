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

  // const { rightStarts, leftStarts } = getStarts(nodes, root);
  // console.log("rightStarts---", rightStarts);
  // console.log("leftStarts---", leftStarts);
  // let y = 10;
  // let childY = 10;
  // for (let index = 0; index < rightStarts.length; index++) {
  //   let element = rightStarts[index];
  //   childY = location(nodes, element, 10, y);
  //   element.y = (y + childY) / 2;
  // }

  location(nodes, root, 10, 10);

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

  function location(nodes, node, x, y) {
    const nodeWidth = getNodeWidth(node, FONT_SIZE);
    node.x = x;
    node.width = nodeWidth;
    node.dots = [];
    const childrenIds = node.children;
    let childX = x + nodeWidth + INDENT * 2;

    let childY = y;

    if (childX > MAX_X) {
      MAX_X = childX;
    }
    if (MAX_END < node.x + nodeWidth) {
      MAX_END = node.x + nodeWidth;
    }

    if (!node.contract) {
      // 遍历子节点
      for (let index = 0; index < childrenIds.length; index++) {
        let element = findNodeById(nodes, childrenIds[index]);
        childY = location(nodes, element, childX, childY);
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
    if (node.text === "備份json文件") {
      console.log("node.y------", node.y);
    }
    return childY;
  }
}
