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

function getStrWidth(str, fontSize, padding) {
  const full = getFullAngleNum(str);
  const punctuation = getHalfAnglePunctuationNum(str);
  const alphabet = getAlphabetNum(str);
  const number = getNumberNum(str);
  const width = textWidth(fontSize);

  const paddingWidth = padding ? padding * 2 : 10;

  return (
    width.fullAngleWidth * full +
    width.halfAnglePunctuationWidth * punctuation +
    width.alphabetWidth * alphabet +
    width.numberWidth * number +
    paddingWidth
  );
}

export { textWidth, getStrWidth };
