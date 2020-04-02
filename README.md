```
████████╗██████╗ ███████╗███████╗     ██████╗ ██████╗  █████╗ ██████╗ ██╗  ██╗
╚══██╔══╝██╔══██╗██╔════╝██╔════╝    ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██║  ██║
   ██║   ██████╔╝█████╗  █████╗█████╗██║  ███╗██████╔╝███████║██████╔╝███████║
   ██║   ██╔══██╗██╔══╝  ██╔══╝╚════╝██║   ██║██╔══██╗██╔══██║██╔═══╝ ██╔══██║
   ██║   ██║  ██║███████╗███████╗    ╚██████╔╝██║  ██║██║  ██║██║     ██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝

```

# tree-graph-vue

树状思维导图组件 for vue

## 编译 Build Setup

```bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build
```
## 安装 Install
```
yarn add tree-graph-vue
```

## 用法 Usage

```html
<template>
  <div id="app">
    <h3>多列视图</h3>
    <tree :nodes="nodes" :startId="nodes[0].id" />
    <h3>单列视图</h3>
    <tree-single :nodes="nodes" :startId="nodes[0].id" />
  </div>
</template>
```

```javascript
import TreeGraph from "tree-graph-vue";
Vue.use(TreeGraph);
```

## 组件属性

| 属性                 | 说明              | 类型     | 是否必须 | 默认值 |
| -------------------- | ----------------- | -------- | -------- | ------ |
| nodes                | 节点              | Array    | 是       | -      |
| startId              | 根节点 id         | String   | 是       | -      |
| ITEM_HEIGHT          | 节点元素高度      | Number   | 否       | 50     |
| BLOCK_HEIGHT         | 节点块高度        | Number   | 否       | 30     |
| FONT_SIZE            | 节点字体大小      | Number   | 否       | 14     |
| INDENT               | 缩进              | Number   | 否       | 25     |
| AVATAR_WIDTH         | 头像宽度          | Number   | 否       | 22     |
| CHECK_BOX_WIDTH      | 勾选框宽度        | Number   | 否       | 18     |
| handleClickNode      | 点击节点事件      | Function | 否       | -      |
| handleClickDot       | 点击收起/展开事件 | Function | 否       | -      |
| handleChangeNodeText | 更改节点名事件    | Function | 否       | -      |

## 节点属性

| 属性         | 说明                 | 类型    |
| ------------ | -------------------- | ------- |
| id           | 节点 id              | String  |
| text         | 节点文本             | String  |
| fatherId     | 父节点 id            | String  |
| children     | 子节点 id            | Array   |
| contract     | 是否收起子节点       | Boolean |
| showAvatar   | 是否显示头像         | Boolean |
| showCheckbox | 是否显示勾选框       | Boolean |
| checked      | 是否勾选             | Boolean |
| showStatus   | 是否显示节点状态     | Boolean |
| hour         | 节点（任务）工时     | Number  |
| limitDay     | 节点（任务）剩余天数 | Number  |
