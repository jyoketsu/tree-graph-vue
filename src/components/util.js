import _ from "lodash";

function findNodeById(nodes, id) {
  const index = _.findIndex(nodes, function(o) {
    return o.id === id;
  });
  return nodes[index];
}

// 生成标识符
function guid(len, radix) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}

function textWidth(fontSize) {
  const ele = document.createElement("span");
  ele.innerText = "傑";
  ele.style.fontSize = `${fontSize}px`;
  ele.style.fontFamily = '"Microsoft YaHei", sans-serif';
  document.body.appendChild(ele);
  const kanjiWidth = ele.offsetWidth;
  ele.innerText = "；";
  const fullAngleWidth = ele.offsetWidth;
  ele.innerText = ";";
  const halfAnglePunctuationWidth = ele.offsetWidth;
  ele.innerText = "a";
  const alphabetWidth = ele.offsetWidth;
  ele.innerText = "8";
  const numberWidth = ele.offsetWidth;
  document.body.removeChild(ele);
  return {
    kanjiWidth: kanjiWidth,
    fullAngleWidth: fullAngleWidth,
    halfAnglePunctuationWidth: halfAnglePunctuationWidth,
    alphabetWidth: alphabetWidth,
    numberWidth: numberWidth
  };
}

// 获取全角字符数
function getFullAngleNum(str) {
  const res = str.match(/[^\x00-\xff]/g);
  return res ? res.length : 0;
}

// 获取半角标点字符数
function getHalfAnglePunctuationNum(str) {
  const res = str.match(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/g);
  return res ? res.length : 0;
}

// 获取半角字母数
function getAlphabetNum(str) {
  const res = str.match(/[a-zA-Z]/g);
  return res ? res.length : 0;
}

// 获取半角数字数
function getNumberNum(str) {
  const res = str.match(/[0-9]/g);
  return res ? res.length : 0;
}

function getNodeWidth(node, fontSize, padding) {
  const str = node.text;
  let full = getFullAngleNum(str);
  const punctuation = getHalfAnglePunctuationNum(str);
  const alphabet = getAlphabetNum(str);
  const number = getNumberNum(str);
  if (!str.length) {
    full = 6;
  }
  const width = textWidth(fontSize);

  const paddingWidth = padding ? padding * 1.5 : 10;
  const extInfoWidth = getExtInfoWidth(node);

  return (
    width.fullAngleWidth * full +
    width.halfAnglePunctuationWidth * punctuation +
    width.alphabetWidth * alphabet +
    width.numberWidth * number +
    paddingWidth +
    extInfoWidth
  );
}

function getExtInfoWidth(node) {
  const avatarWidth = node.showAvatar ? 22 : 0;
  const checkboxWidth = node.showCheckbox ? 18 : 0;
  const statusWidth = node.showStatus ? 22 : 0;
  const temp = [avatarWidth, checkboxWidth, statusWidth];
  let count = 0;
  for (let index = 0; index < temp.length; index++) {
    const element = temp[index];
    if (element) {
      count++;
    }
  }

  const marginWidth = count ? count * 1.5 : 0;
  return avatarWidth + checkboxWidth + statusWidth + marginWidth;
}

function nodeLocation(node, type, BLOCK_HEIGHT) {
  switch (type) {
    case "avatar":
      return {
        x: node.x + 5,
        y: node.y + (BLOCK_HEIGHT - 22) / 2
      };
    case "checkbox":
      return {
        x: node.x + 5 + (node.showAvatar ? 22 + 2 : 0),
        y: node.y + (BLOCK_HEIGHT - 18) / 2
      };
    case "status":
      return {
        x:
          node.x +
          5 +
          (node.showAvatar ? 22 + 2 : 0) +
          (node.showCheckbox ? 18 + 2 : 0),
        y: node.y + (BLOCK_HEIGHT - 22) / 2
      };
    case "text":
      const extWidth = getExtInfoWidth(node);
      return {
        x: node.x + 5 + extWidth + (extWidth ? 2 : 0),
        y: node.y + BLOCK_HEIGHT / 2 + 1
      };
    default:
      break;
  }
}

function changeNodeText(nodes, id, text) {
  let node = findNodeById(nodes, id);
  if (!text) {
    text = "新增节点";
  }
  node.text = text;
  return nodes;
}

function addChildNode(nodes, selectedId) {
  const childNode = {
    id: guid(8, 16),
    text: "",
    fatherId: selectedId,
    children: [],
    showAvatar: false,
    showCheckbox: false,
    checked: false,
    showStatus: false,
    hour: 0,
    limitDay: 0
  };
  const selectedNode = findNodeById(nodes, selectedId);
  selectedNode.children.push(childNode.id);
  nodes.push(childNode);
  return {
    nodes: nodes,
    addedNode: childNode
  };
}

function addNext(nodes, selectedId) {
  let selectedNode = findNodeById(nodes, selectedId);
  let fatherNode = findNodeById(nodes, selectedNode.fatherId);
  const nextNode = {
    id: guid(8, 16),
    text: "",
    fatherId: fatherNode.id,
    children: [],
    showAvatar: false,
    showCheckbox: false,
    checked: false,
    showStatus: false,
    hour: 0,
    limitDay: 0
  };
  let brotherKeys = fatherNode.children;
  brotherKeys.splice(brotherKeys.indexOf(selectedId) + 1, 0, nextNode.id);
  fatherNode.children = brotherKeys;
  nodes.push(nextNode);
  return {
    nodes: nodes,
    addedNode: nextNode
  };
}

function deleteNode(nodes, selectedId) {
  let selectedNode = findNodeById(nodes, selectedId);
  let fatherNode = findNodeById(nodes, selectedNode.fatherId);
  let brotherKeys = fatherNode.children;
  brotherKeys.splice(brotherKeys.indexOf(selectedId), 1);
  fatherNode.children = brotherKeys;

  deleteNodeById(selectedNode);

  function deleteNodeById(node) {
    let children = node.children;
    for (let index = 0; index < children.length; index++) {
      let element = children[index];
      let child = findNodeById(nodes, element);
      deleteNodeById(child);
    }
    _.remove(nodes, function(n) {
      return n.id === node.id;
    });
  }

  return nodes;
}

function dot(c_nodes, nodeId) {
  let nodes = JSON.parse(JSON.stringify(c_nodes));
  for (let index = 0; index < nodes.length; index++) {
    let element = nodes[index];
    delete element.width;
    delete element.x;
    delete element.y;
  }
  let selectedNode = findNodeById(nodes, nodeId);
  selectedNode.contract = selectedNode.contract ? false : true;
  return nodes;
}

function checkNode(c_nodes, nodeId) {
  let node = findNodeById(c_nodes, nodeId);
  node.checked = !node.checked;
  return c_nodes;
}

function editNode(c_nodes, nodeId, prop) {
  const index = _.findIndex(c_nodes, function(o) {
    return o.id === nodeId;
  });
  c_nodes[index] = { ...c_nodes[index], ...prop };
  return c_nodes;
}

function save(c_nodes) {
  let nodes = JSON.parse(JSON.stringify(c_nodes));
  for (let index = 0; index < nodes.length; index++) {
    let element = nodes[index];
    delete element.width;
    delete element.x;
    delete element.y;
    delete element.toLeft;
    delete element.dots;
    delete element.leftDots;
    delete element.rightDots;
  }
  return nodes;
}

function dragEnd(c_nodes, blockHeight, x, y) {
  let minDiff;
  let node;
  for (let index = 0; index < c_nodes.length; index++) {
    const element = c_nodes[index];
    const diff = Math.abs(x - element.x) + Math.abs(y - element.y);
    if (minDiff === undefined) {
      minDiff = diff;
      node = element;
    } else if (diff < minDiff) {
      minDiff = diff;
      node = element;
    }
  }
  const diffX = x - node.x;
  const diffY = y - node.y;
  let position;
  if (Math.abs(diffX) < node.width && Math.abs(diffY) < blockHeight) {
    position = "inside";
  } else if (diffX < 0 && diffY < 0) {
    position = "top-left";
  } else if (diffX < 0 && diffY > 0) {
    position = "bottom-left";
  } else if (diffX > 0 && diffY < 0) {
    position = "top-right";
  } else {
    position = "bottom-right";
  }
  return {
    targetNode: node,
    targetPosition: position
  };
}

function dragSort(nodes, selectedId, targetNodeId, position, arrange) {
  let selectedNode = findNodeById(nodes, selectedId);
  let targetNode = findNodeById(nodes, targetNodeId);
  switch (position) {
    case "inside":
      // 从选中节点的父节点的children中删除当前id
      let selectedNodeFather = findNodeById(nodes, selectedNode.fatherId);
      let children = selectedNodeFather.children;
      children.splice(children.indexOf(selectedNode.id), 1);
      selectedNode.fatherId = targetNodeId;
      // 将当前id添加到目标节点children中
      targetNode.children.push(selectedNode.id);
      break;
    case "top-left":
      if (arrange === "vertical") {
        addSibling("before");
      } else {
        addSibling("before");
      }
      break;
    case "top-right":
      if (arrange === "vertical") {
        addSibling("before");
      } else {
        addSibling("next");
      }
      break;
    case "bottom-left":
      if (arrange === "vertical") {
        addSibling("next");
      } else {
        addSibling("before");
      }
      break;
    case "bottom-right":
      if (arrange === "vertical") {
        addSibling("next");
      } else {
        addSibling("next");
      }
      break;
    default:
      break;
  }
  return nodes;
  function addSibling(type) {
    if (selectedNode.fatherId === targetNode.fatherId) {
      // 从选中节点的父节点的children中删除当前id
      let father = findNodeById(nodes, targetNode.fatherId);
      let children = father.children;
      children.splice(children.indexOf(selectedNode.id), 1);
      // 将当前id添加到目标节点的父节点children中
      children.splice(
        type === "next"
          ? children.indexOf(targetNodeId) + 1
          : children.indexOf(targetNodeId),
        0,
        selectedId
      );
    } else {
      // 从选中节点的父节点的children中删除当前id
      let selectedNodeFather = findNodeById(nodes, selectedNode.fatherId);
      let children = selectedNodeFather.children;
      children.splice(children.indexOf(selectedNode.id), 1);
      selectedNode.fatherId = targetNode.fatherId;
      // 将当前id添加到目标节点的父节点children中
      let targetFather = findNodeById(nodes, targetNode.fatherId);
      let children2 = targetFather.children;
      children2.splice(
        type === "next"
          ? children2.indexOf(targetNodeId) + 1
          : children2.indexOf(targetNodeId),
        0,
        selectedId
      );
    }
  }
}

export {
  findNodeById,
  textWidth,
  getNodeWidth,
  getExtInfoWidth,
  nodeLocation,
  changeNodeText,
  addChildNode,
  addNext,
  deleteNode,
  dot,
  checkNode,
  editNode,
  save,
  dragEnd,
  dragSort
};
