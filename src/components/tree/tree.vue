<template>
  <Drag>
    <div>{{test}}</div>
    <div
      class="svg-wrapper"
      tabindex="-1"
      @keydown.enter="addNext"
      @keydown.tab="addChild"
      @keydown.delete="deleteNode"
      v-on:keydown.ctrl.83.prevent="saveNodes"
      v-on:keydown.meta.83.prevent="saveNodes"
      ref="svgEl"
    >
      <svg
        class="tree-svg"
        :viewBox="`0 0 ${max_end} ${max_y + ITEM_HEIGHT}`"
        :width="max_end"
        :height="max_y + ITEM_HEIGHT"
      >
        <defs>
          <g
            id="contract"
            width="10"
            height="10"
            viewBox="0,0,10,10"
            preserveAspectRatio="xMinYMin meet"
          >
            <circle cx="5" cy="5" r="5" fill="#F0F0F0" stroke="#BFBFBF" />
            <path d="M 2 5 H 8 5" stroke="#666" stroke-width="1.6" />
          </g>
          <g
            id="expand"
            width="10"
            height="10"
            viewBox="0,0,10,10"
            preserveAspectRatio="xMinYMin meet"
          >
            <circle cx="5" cy="5" r="5" fill="#F0F0F0" stroke="#BFBFBF" />
            <path d="M 2 5 H 8 5" stroke="#666" stroke-width="1.6" />
            <path d="M 5 2  V 5 8" stroke="#666" stroke-width="1.6" />
          </g>
          <g
            id="checkbox-checked"
            width="18"
            height="18"
            viewBox="0,0,18,18"
            preserveAspectRatio="xMinYMin meet"
          >
            <circle cx="9" cy="9" r="9" fill="rgb(85, 85, 85)" />
            <path d="M 4 9 L 8 13 L 14 5" stroke="#fff" stroke-width="1.6" />
          </g>
          <g
            id="checkbox-uncheck"
            width="18"
            height="18"
            viewBox="0,0,18,18"
            preserveAspectRatio="xMinYMin meet"
          >
            <circle
              cx="9"
              cy="9"
              r="9"
              fill="rgb(216, 216, 216)"
              stroke="#000000"
            />
          </g>
          <g
            id="status"
            width="22"
            height="22"
            viewBox="0,0,22,22"
            preserveAspectRatio="xMinYMin meet"
          >
            <path d="M0 0 H 11 L 22 11 V 22 H 0 Z" fill="rgb(85, 85, 85)" />
            <path d="M 11 0 H 22 V 11 Z" fill="rgb(53, 166, 248)" />
          </g>
          <g
            id="status-overdue"
            width="22"
            height="22"
            viewBox="0,0,22,22"
            preserveAspectRatio="xMinYMin meet"
          >
            <path d="M0 0 H 11 L 22 11 V 22 H 0 Z" fill="rgb(221, 53, 53)" />
            <path d="M 11 0 H 22 V 11 Z" fill="rgb(53, 166, 248)" />
          </g>
        </defs>
        <g
          v-for="(node, index) in c_nodes"
          :key="index"
          :class="`node-group-${index}`"
        >
          <Node
            :node="node"
            :BLOCK_HEIGHT="BLOCK_HEIGHT"
            :FONT_SIZE="FONT_SIZE"
            :startId="startId"
            :alias="new Date().getTime()"
            :selected="selected"
            :handleClickNode="clickNode"
            :handleCheck="clickCheck"
          />
          <g class="multi-column" v-if="isSingle">
            <path
              v-if="node.x && node.y"
              :d="fatherPath(node)"
              fill="none"
              stroke="rgb(215, 215, 215)"
            />
            <path
              v-if="node.x && node.y && node.children.length && !node.contract"
              :d="childPath(node)"
              fill="none"
              stroke="rgb(215, 215, 215)"
            />
          </g>
          <g class="single-column" v-else>
            <!-- 线条：左侧横线 -->
            <path
              v-if="
                node.x && node.y && node.fatherId && node.fatherId !== startId
              "
              :d="fatherPath(node)"
              fill="none"
              stroke="rgb(215, 215, 215)"
            />
            <!-- 线条：纵线 -->
            <path
              v-if="
                node.x &&
                  node.y &&
                  node.children.length &&
                  !node.contract &&
                  node.id !== startId
              "
              :d="childPath(node)"
              fill="none"
              stroke="rgb(215, 215, 215)"
            />
            <!-- 根节点底部线条 -->
            <path
              v-if="
                node.id === startId && node.children.length && !node.contract
              "
              :d="rootHpaht(node)"
              fill="none"
              stroke="rgb(215, 215, 215)"
            />
            <path
              v-if="
                node.id === startId && node.children.length && !node.contract
              "
              :d="rootVpath(node)"
              fill="none"
              stroke="rgb(215, 215, 215)"
            />
            <path
              v-if="
                node.x && node.y && node.fatherId && node.fatherId === startId
              "
              :d="rootBottomVpath(node)"
              fill="none"
              stroke="rgb(215, 215, 215)"
            />
          </g>
          <Dot
            :node="node"
            :BLOCK_HEIGHT="BLOCK_HEIGHT"
            :handleClickDot="handleDot"
          />
        </g>
      </svg>
    </div>
    <Input
      v-if="showInput || showNewInput"
      :selected="selected"
      :handleChangeNodeText="handleChangeText"
    />
  </Drag>
</template>

<script>
import Drag from "../Drag";
import Node from "../Node";
import Dot from "../Dot";
import Input from "../NodeInput";
import calculate from "./treeService";
import treeMixin from "../TreeMixin";
import {
  changeNodeText,
  addNext,
  addChildNode,
  deleteNode,
  findNodeById,
  dot,
  save,
  checkNode,
  editNode
} from "../util";
export default {
  name: "tree",
  mixins:[treeMixin],
  components: { Drag, Node, Dot, Input },
  props: {
    // 节点
    nodes: {
      // 文本
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    // 根节点id
    startId: {
      type: String,
      required: true
    },
    // 单列视图
    singleColumn: {
      type: Boolean,
      default: false
    },
    // 非受控模式
    uncontrolled: {
      type: Boolean,
      default: true
    },
    // 节点元素高度
    ITEM_HEIGHT: {
      type: Number,
      default: 50
    },
    // 节点块高度
    BLOCK_HEIGHT: {
      type: Number,
      default: 30
    },
    // 节点字体大小
    FONT_SIZE: {
      type: Number,
      default: 14
    },
    // 缩进
    INDENT: {
      type: Number,
      default: 25
    },
    // 头像宽度
    AVATAR_WIDTH: {
      type: Number,
      default: 22
    },
    CHECK_BOX_WIDTH: {
      type: Number,
      default: 18
    },
    handleClickNode: {
      type: Function,
      default: function(node) {
        console.log("---handleClickNode---", node);
      }
    },
    handleClickDot: {
      type: Function,
      default: function(node) {
        console.log("---handleClickDot---", node);
      }
    },
    handleCheck: {
      type: Function,
      default: function(node) {
        console.log("---handleCheck---", node);
      }
    },
    handleChangeNodeText: {
      type: Function,
      default: function(nodeId, text) {
        console.log("---handleChangeNodeText---", nodeId, text);
      }
    },
    handleAddNext: {
      type: Function,
      default: function(selected, added) {
        console.log("---handleAddNext---", selected, added);
      }
    },
    handleAddChild: {
      type: Function,
      default: function(selected, added) {
        console.log("---handleAddChild---", selected, added);
      }
    },
    handleDeleteNode: {
      type: Function,
      default: function(selected) {
        console.log("---handleDeleteNode---", selected);
      }
    },
    handleSave: {
      type: Function,
      default: function(nodes) {
        alert(nodes ? JSON.stringify(nodes) : "保存");
      }
    }
  },
  data() {
    return {
      c_nodes: [],
      max_x: 0,
      max_y: 0,
      max_end: 0,
      second_start_x: 0,
      second_end_x: 0,
      selected: {},
      showInput: false,
      showNewInput: false,
      isSingle: this.singleColumn
    };
  },
  methods: {
    // 有父节点时的左侧水平线条
    fatherPath: function(node) {
      const M = `M ${node.x} ${node.y + this.BLOCK_HEIGHT / 2}`;
      const H = `H ${node.x - (this.INDENT - 5)}`;
      return `${M} ${H}`;
    },
    // 有子节点时的下部线条
    childPath: function(node) {
      const M = `M ${node.x + 5} ${node.y + this.BLOCK_HEIGHT}`;
      const V = `V ${node.last_child_y + this.BLOCK_HEIGHT / 2}`;
      return `${M} ${V}`;
    },
    // 根节点底部水平线
    rootHpaht: function(node) {
      const M = `M ${this.second_start_x} ${this.ITEM_HEIGHT * 1.5 -
        (this.ITEM_HEIGHT * 1.5 - this.BLOCK_HEIGHT) / 2}`;
      const H = `H ${this.second_end_x}`;
      return `${M} ${H}`;
    },
    // 根节点底部纵线
    rootVpath: function(node) {
      const M = `M ${node.x + node.width / 2} ${node.y + this.BLOCK_HEIGHT}`;
      const V = `V ${this.ITEM_HEIGHT * 1.5 -
        (this.ITEM_HEIGHT * 1.5 - this.BLOCK_HEIGHT) / 2}`;
      return `${M} ${V}`;
    },
    // 第二层节点头部纵线
    rootBottomVpath: function(node) {
      const M = `M ${node.x + node.width / 2} ${node.y}`;
      const V = `V ${node.y -
        (this.ITEM_HEIGHT * 1.5 - this.BLOCK_HEIGHT) / 2}`;
      return `${M} ${V}`;
    },
    clickNode: function(node) {
      if (this.selected.id === node.id) {
        this.showInput = true;
      } else {
        this.$refs.svgEl.focus();
      }
      this.selected = node;
      this.handleClickNode(node);
    },
    clickCheck: function(node) {
      if (this.uncontrolled) {
        this.c_nodes = checkNode(this.c_nodes, node.id);
      }
      this.handleCheck(node);
    },
    handleDot: function(node) {
      if (this.uncontrolled) {
        let nodes = dot(this.c_nodes, node.id);
        this.calculateNodes(nodes, this.startId, this.singleColumn);
      }
      this.handleClickDot(node);
    },
    handleChangeText: function(nodeId, text) {
      this.showInput = false;
      this.showNewInput = false;
      this.handleChangeNodeText(nodeId, text);
      if (this.uncontrolled) {
        let nodes = changeNodeText(this.c_nodes, nodeId, text);
        this.calculateNodes(nodes, this.startId, this.singleColumn);
        this.$refs.svgEl.focus();
      }
    },
    editNode: function(entity) {
      if (this.uncontrolled) {
        if (!this.selected.id) {
          return alert("请先选中节点！");
        }
        let nodes = editNode(this.c_nodes, this.selected.id, entity);
        this.calculateNodes(nodes, this.startId, this.singleColumn);
      }
    },
    addNext: function() {
      if (!this.selected.id) {
        return alert("请先选中节点！");
      }
      if (this.selected.id === this.startId) {
        return alert("根节点无法添加兄弟节点！");
      }
      if (this.uncontrolled) {
        let res = addNext(this.c_nodes, this.selected.id);
        this.calculateNodes(res.nodes, this.startId, this.singleColumn);
        this.handleAddNext(this.selected, res.addedNode);
        let selected = findNodeById(this.c_nodes, res.addedNode.id);
        this.selected = selected;
        this.showNewInput = true;
      } else {
        this.handleAddNext(this.selected);
      }
    },
    addChild: function(e) {
      e.preventDefault();
      if (!this.selected.id) {
        return alert("请先选中节点！");
      }
      if (this.uncontrolled) {
        let res = addChildNode(this.c_nodes, this.selected.id);
        this.calculateNodes(res.nodes, this.startId, this.singleColumn);
        this.handleAddChild(this.selected, res.addedNode);
        let selected = findNodeById(this.c_nodes, res.addedNode.id);
        this.selected = selected;
        this.showNewInput = true;
      } else {
        this.handleAddChild(this.selected);
      }
    },
    deleteNode: function() {
      if (!this.selected.id) {
        return alert("请先选中节点！");
      }
      if (this.selected.id === this.startId) {
        return alert("根节点不允许删除！");
      }
      if (this.uncontrolled) {
        this.handleDeleteNode(this.selected);
        let nodes = deleteNode(this.c_nodes, this.selected.id, this.startId);
        this.calculateNodes(nodes, this.startId, this.singleColumn);
        this.selected = {};
      } else {
        this.handleDeleteNode(this.selected);
      }
    },
    saveNodes: function() {
      if (this.uncontrolled) {
        const nodes = save(this.c_nodes);
        this.handleSave(nodes);
      } else {
        this.handleSave();
      }
    },
    calculateNodes: function(nodes, startId, singleColumn) {
      const cal = calculate(
        nodes,
        startId,
        singleColumn,
        this.ITEM_HEIGHT,
        this.INDENT,
        this.FONT_SIZE
      );
      this.c_nodes = cal.nodes;
      this.max_x = cal.max_x;
      this.max_y = cal.max_y;
      this.max_end = cal.max_end;
      this.second_start_x = cal.second_start_x;
      this.second_end_x = cal.second_end_x;
      this.isSingle = cal.isSingle;
    }
  },
  watch: {
    nodes: {
      immediate: true,
      deep: true,
      handler: function() {
        if (!this.uncontrolled) {
          this.calculateNodes(this.nodes, this.startId, this.singleColumn);
        }
      }
    },
    selected: function(val, oldVal) {
      if (val && oldVal && val.id !== oldVal.id) {
        this.showInput = false;
      }
    }
  },
  mounted() {
    this.calculateNodes(this.nodes, this.startId, this.singleColumn);
  }
};
</script>
<style scoped>
.svg-wrapper:focus {
  outline: none;
}
/* path{
  transition: all 0.5s;
} */
</style>
