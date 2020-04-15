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

  const secondLevel = getStarts(nodes, root);
  console.log("secondLevel---", secondLevel);
}
