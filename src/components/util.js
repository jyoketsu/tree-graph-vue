function textWidth(fontSize) {
  const ele = document.createElement("span");
  ele.innerText = "傑";
  ele.fontSize = `${fontSize}px`;
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
  const full = getFullAngleNum(str);
  const punctuation = getHalfAnglePunctuationNum(str);
  const alphabet = getAlphabetNum(str);
  const number = getNumberNum(str);
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

export { textWidth, getNodeWidth, getExtInfoWidth, nodeLocation };
