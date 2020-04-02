<template>
  <div id="app">
    <h2>树状思维导图组件 for Vue</h2>
    <h3>多列视图</h3>
    <tree :nodes="nodes" :startId="nodes[0].id" />
    <h3>单列视图</h3>
    <tree-single :nodes="nodes" :startId="nodes[0].id" />
  </div>
</template>

<script>
// import tree from "./components/tree/tree";
import Vue from "vue";
import TreeGraph from "./index";
Vue.use(TreeGraph);
export default {
  name: "app",
  data() {
    return {
      nodes: [
        {
          id: "001",
          text: "项目管理",
          fatherId: "001",
          children: ["002", "003", "004", "005"],
          contract: false,
          showAvatar: true
        },
        {
          id: "002",
          text: "计划进度",
          fatherId: "001",
          children: ["006", "007"],
          contract: false,
          showAvatar: true,
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: -23
        },
        {
          id: "003",
          text: "项目状态",
          fatherId: "001",
          children: ["010", "011"],
          showAvatar: true,
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "004",
          text: "项目会议",
          fatherId: "001",
          children: [],
          showAvatar: true,
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "005",
          text: "项目验收",
          fatherId: "001",
          children: [],
          showAvatar: true,
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "006",
          text: "阶段一",
          fatherId: "002",
          contract: false,
          children: ["008", "009"],
          showAvatar: true,
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "007",
          text: "阶段二",
          fatherId: "002",
          children: [],
          showAvatar: true,
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "008",
          text: "备份json文件",
          fatherId: "006",
          children: [],
          showAvatar: true,
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "009",
          text: "还原数据",
          fatherId: "006",
          children: [],
          showAvatar: true,
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "010",
          text: "4月计划",
          fatherId: "003",
          children: [],
          showAvatar: true,
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "011",
          text: "5月计划",
          fatherId: "003",
          children: ["012", "013", "014"],
          showAvatar: true,
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "012",
          text: "原型&界面设计",
          fatherId: "011",
          children: [],
          showAvatar: true,
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "013",
          text: "开发",
          fatherId: "011",
          children: [],
          showAvatar: true,
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "014",
          text: "测试",
          fatherId: "011",
          children: [],
          showAvatar: true,
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        }
      ]
    };
  }
};
</script>

<style>
body {
  margin: unset;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}
html {
  background-color: rgb(238, 238, 238);
}
</style>
