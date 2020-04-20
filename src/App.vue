<template>
  <div id="app">
    <h2>樹狀思維導圖組件 Dendrogram Component</h2>
    <h3>操作 Operation</h3>
    <div class="operation-wrapper">
      <span>添加子節點：Tab</span>
      <span>向後添加兄弟節點：Enter</span>
      <span>刪除節點：Delete</span>
      <span>編輯節點名：雙擊進入編輯狀態，按下Enter完成</span>
      <span>保存數據：Command + S / Ctrl + S</span>
      <hr />
      <span>Add Child Node：Tab</span>
      <span>Add sibling nodes backward：Enter</span>
      <span>Delete Nodes：Delete</span>
      <span>
        Edit Node：Double-click to enter edit state and press Enter to finish</span
      >
      <span>Save Data：Command + S / Ctrl + S</span>
    </div>
    <h3>脑图 Mind</h3>
    <mind :nodes="nodes" :startId="nodes[0].id" :singleColumn="true"/>
    <mind :nodes="nodes" :startId="nodes[0].id" />
    <h3>多列視圖 Multi Column</h3>
    <tree :nodes="nodes" :startId="nodes[0].id" />
    <h3>單列視圖 Single Column</h3>
    <tree :nodes="nodes" :startId="nodes[0].id" :singleColumn="true" />
    <h3>Only Root</h3>
    <button @click="changeNode" :style="{ margin: '15px' }">
      設為任務 Set as Task
    </button>
    <tree :nodes="one" :startId="one[0].id" ref="treeRef" />
  </div>
</template>

<script>
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
          text: "項目管理",
          fatherId: "",
          children: ["002", "003", "004", "005"],
          contract: false,
          showAvatar: true,
          avatarUri: "https://psnine.com/Upload/game/11003.png",
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: -23
        },
        {
          id: "002",
          text: "計劃進度",
          fatherId: "001",
          children: ["006", "007"],
          contract: false,
          showAvatar: true,
          avatarUri: "https://psnine.com/Upload/game/11003.png",
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: -23
        },
        {
          id: "003",
          text: "項目狀態",
          fatherId: "001",
          children: ["010", "011"],
          showAvatar: true,
          avatarUri: "https://psnine.com/Upload/game/11003.png",
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "004",
          text: "項目會議",
          fatherId: "001",
          children: [],
          showAvatar: true,
          avatarUri:
            "http://tva2.sinaimg.cn/thumb150/bfae17b6ly1fgkhutulafj20sg0sge81",
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "005",
          text: "驗收",
          fatherId: "001",
          children: [],
          showAvatar: true,
          avatarUri:
            "http://tva2.sinaimg.cn/thumb150/bfae17b6ly1fgkhutulafj20sg0sge81",
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "006",
          text: "階段壹",
          fatherId: "002",
          contract: false,
          children: ["008", "009"],
          showAvatar: true,
          avatarUri: "https://psnine.com/Upload/game/11003.png",
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "007",
          text: "階段二",
          fatherId: "002",
          children: [],
          showAvatar: true,
          avatarUri: "https://psnine.com/Upload/game/11003.png",
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "008",
          text: "備份json文件",
          fatherId: "006",
          children: [],
          showAvatar: true,
          avatarUri: "https://psnine.com/Upload/game/11003.png",
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "009",
          text: "還原數據",
          fatherId: "006",
          children: ["015"],
          showAvatar: true,
          avatarUri: "https://psnine.com/Upload/game/11003.png",
          showCheckbox: true,
          checked: false,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "010",
          text: "4月計劃",
          fatherId: "003",
          children: [],
          showAvatar: true,
          avatarUri: "https://psnine.com/Upload/game/11003.png",
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "011",
          text: "5月計劃",
          fatherId: "003",
          children: ["012", "013", "014"],
          contract: false,
          showAvatar: true,
          avatarUri: "https://psnine.com/Upload/game/11003.png",
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "012",
          text: "原型&界面設計",
          fatherId: "011",
          children: [],
          showAvatar: true,
          avatarUri: "https://psnine.com/Upload/game/11003.png",
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "013",
          text: "開發",
          fatherId: "011",
          children: [],
          showAvatar: true,
          avatarUri: "https://psnine.com/Upload/game/11003.png",
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "014",
          text: "測試",
          fatherId: "011",
          children: [],
          showAvatar: true,
          avatarUri:
            "http://tva2.sinaimg.cn/thumb150/bfae17b6ly1fgkhutulafj20sg0sge81",
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        },
        {
          id: "015",
          text: "還原數據-還原數據",
          fatherId: "009",
          children: [],
          showAvatar: true,
          avatarUri:
            "http://tva2.sinaimg.cn/thumb150/bfae17b6ly1fgkhutulafj20sg0sge81",
          showCheckbox: true,
          checked: true,
          showStatus: true,
          hour: 0.1,
          limitDay: 2
        }
      ],
      one: [
        {
          id: "001",
          text: "根节点",
          fatherId: "",
          children: [],
          contract: false
        }
      ]
    };
  },
  methods: {
    changeNode: function() {
      this.$refs.treeRef.editNode({
        showAvatar: true,
        avatarUri:
          "http://tva2.sinaimg.cn/thumb150/bfae17b6ly1fgkhutulafj20sg0sge81",
        showCheckbox: true,
        checked: true,
        showStatus: true,
        hour: 0.1,
        limitDay: 2
      });
    }
  },
  mounted() {
    let that = this;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}
html {
  background-color: rgb(238, 238, 238);
}
.operation-wrapper {
  padding: 15px;
}
.operation-wrapper > span {
  display: block;
  text-align: left;
}
</style>
