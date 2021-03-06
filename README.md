```
████████╗██████╗ ███████╗███████╗     ██████╗ ██████╗  █████╗ ██████╗ ██╗  ██╗
╚══██╔══╝██╔══██╗██╔════╝██╔════╝    ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██║  ██║
   ██║   ██████╔╝█████╗  █████╗█████╗██║  ███╗██████╔╝███████║██████╔╝███████║
   ██║   ██╔══██╗██╔══╝  ██╔══╝╚════╝██║   ██║██╔══██╗██╔══██║██╔═══╝ ██╔══██║
   ██║   ██║  ██║███████╗███████╗    ╚██████╔╝██║  ██║██║  ██║██║     ██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝

```

# tree-graph-vue

vue 樹狀思維導圖組件 Dendrogram Component

## [在線 DEMO OnlineDemo](https://jyoketsu.github.io/tree-graph-vue/)

## 編譯 Build Setup

```bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build
```

## 安裝 Install

```
yarn add tree-graph-vue
```

## 用法 Usage

```html
<template>
  <div id="app">
    <h3>脑图</h3>
    <mind :nodes="nodes" :startId="nodes[0].id" :singleColumn="true"/>
    <mind :nodes="nodes" :startId="nodes[0].id" />
    <h3>多列視圖 Multi Column</h3>
    <tree :nodes="nodes" :startId="nodes[0].id" />
    <h3>單列視圖 Single Column</h3>
    <tree :nodes="nodes" :startId="nodes[0].id" :singleColumn="true" />
  </div>
</template>
```

```javascript
import TreeGraph from "tree-graph-vue";
Vue.use(TreeGraph);
```

## 操作

| 操作                | 按鍵             |
| ------------------- | ---------------- |
| 新增子節點          | Tab              |
| 新增兄弟節點        | Enter            |
| 刪除節點            | Delete           |
| 保存樹（file 模式） | Command/Ctrl + S |

## 組件屬性

| 屬性                 | 說明                 | 類型     | 是否必須 | 默認值 |
| -------------------- | -------------------- | -------- | -------- | ------ |
| nodes                | 節點                 | Array    | 是       | -      |
| startId              | 根節點 id            | String   | 是       | -      |
| singleColumn         | 是否是單列視圖       | Boolean  | 否       | false  |
| uncontrolled         | 是否為非受控組件     | Boolean  | 否       | true   |
| ITEM_HEIGHT          | 節點元素高度         | Number   | 否       | 50     |
| BLOCK_HEIGHT         | 節點塊高度           | Number   | 否       | 30     |
| FONT_SIZE            | 節點字體大小         | Number   | 否       | 14     |
| INDENT               | 縮進                 | Number   | 否       | 25     |
| AVATAR_WIDTH         | 頭像寬度             | Number   | 否       | 22     |
| CHECK_BOX_WIDTH      | 勾選框寬度           | Number   | 否       | 18     |
| handleClickNode      | 點擊節點事件         | Function | 否       | -      |
| handleDbClickNode      | 雙擊節點事件         | Function | 否       | -      |
| handleClickExpand       | 點擊收起/展開事件    | Function | 否       | -      |
| handleCheck          | 點擊勾選框事件       | Function | 否       | -      |
| handleChangeNodeText | 更改節點名事件       | Function | 否       | -      |
| handleAddNext        | 向後添加兄弟節點事件 | Function | 否       | -      |
| handleAddChild       | 添加子節點事件       | Function | 否       | -      |
| handleDeleteNode     | 刪除節點事件         | Function | 否       | -      |
| handleSave           | 保存樹               | Function | 否       | -      |
| handleDrag           | 拖拽节点               | Function | 否       | -      |

## 節點屬性

| 屬性         | 說明                 | 類型    |
| ------------ | -------------------- | ------- |
| id           | 節點 id              | String  |
| text         | 節點文本             | String  |
| fatherId     | 父節點 id            | String  |
| children     | 子節點 id            | Array   |
| contract     | 是否收起子節點       | Boolean |
| showAvatar   | 是否顯示頭像         | Boolean |
| avatarUri    | 頭像地址             | String  |
| showCheckbox | 是否顯示勾選框       | Boolean |
| checked      | 是否勾選             | Boolean |
| showStatus   | 是否顯示節點狀態     | Boolean |
| hour         | 節點（任務）工時     | Number  |
| limitDay     | 節點（任務）剩余天數 | Number  |
