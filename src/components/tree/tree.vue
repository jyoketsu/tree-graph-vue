<template>
  <Drag>
    <div
      class="svg-wrapper"
      tabindex="-1"
      @keydown.enter="addNext"
      @keydown.tab="addChild"
      @keydown.delete="deleteNode"
      v-on:keydown.ctrl.83.prevent="saveNodes"
      v-on:keydown.meta.83.prevent="saveNodes"
      @mousedown="handleDragStart"
      @mousemove="handleMoveNode"
      @mouseup="handleDragEnd"
      @mouseleave="handleDragEnd"
      ref="svgEl"
    >
      <svg
        class="tree-svg"
        :viewBox="`0 0 ${max_end + 15} ${max_y + ITEM_HEIGHT}`"
        :width="max_end + 15"
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
            :handleDbClickNode="dbClickNode"
            :handleCheck="clickCheck"
          />
          <g class="multi-column" v-if="isSingle">
            <path
              v-if="node.x && node.y"
              :d="fatherPath(node)"
              fill="none"
              stroke="rgb(192,192,192)"
              :stroke-width="PATH_WIDTH"
            />
            <path
              v-if="node.x && node.y && node.children.length && !node.contract"
              :d="childPath(node)"
              fill="none"
              stroke="rgb(192,192,192)"
              :stroke-width="PATH_WIDTH"
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
              stroke="rgb(192,192,192)"
              :stroke-width="PATH_WIDTH"
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
              stroke="rgb(192,192,192)"
              :stroke-width="PATH_WIDTH"
            />
            <!-- 根节点底部线条 -->
            <path
              v-if="
                node.id === startId && node.children.length && !node.contract
              "
              :d="rootHpaht(node)"
              fill="none"
              stroke="rgb(192,192,192)"
              :stroke-width="PATH_WIDTH"
            />
            <path
              v-if="
                node.id === startId && node.children.length && !node.contract
              "
              :d="rootVpath(node)"
              fill="none"
              stroke="rgb(192,192,192)"
              :stroke-width="PATH_WIDTH"
            />
            <path
              v-if="
                node.x && node.y && node.fatherId && node.fatherId === startId
              "
              :d="rootBottomVpath(node)"
              fill="none"
              stroke="rgb(192,192,192)"
              :stroke-width="PATH_WIDTH"
            />
          </g>
          <Dot
            :node="node"
            :BLOCK_HEIGHT="BLOCK_HEIGHT"
            :handleClickExpand="handleExpand"
          />
          <Expand
            :node="node"
            :BLOCK_HEIGHT="BLOCK_HEIGHT"
            :handleClickExpand="handleExpand"
            :position="
              node.id === startId && !singleColumn
                ? 'bottomCenter'
                : 'leftBottom'
            "
          />
          <DragNode
            v-if="showDragNode"
            :node="selected"
            :x="movedNodeX"
            :y="movedNodeY"
            :BLOCK_HEIGHT="BLOCK_HEIGHT"
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
import Expand from "../Expand";
import Input from "../NodeInput";
import calculate from "./treeService";
import treeMixin from "../TreeMixin";
import DragNode from "../DragNode";
export default {
  name: "tree",
  mixins: [treeMixin],
  components: { Drag, Node, Dot, Expand, Input, DragNode },
  props: {
    // 单列视图
    singleColumn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      second_start_x: 0,
      second_end_x: 0,
      isSingle: this.singleColumn
    };
  },
  methods: {
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
    },
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
    }
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
