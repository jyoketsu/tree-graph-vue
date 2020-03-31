<template>
  <div class="tree-graph">
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
      </defs>
      <g
        v-for="(node, index) in c_nodes"
        :key="index"
        :class="`node-group-${index}`"
      >
        <!-- 节点 -->
        <rect
          v-if="node.x && node.y"
          class="node-rect"
          :x="node.x"
          :y="node.y"
          rx="4"
          ry="4"
          :width="node.width"
          :height="BLOCK_HEIGHT"
          stroke="rgb(215, 215, 215)"
        />
        <text
          v-if="node.x && node.y"
          class="node-text"
          :x="node.x + 5"
          :y="node.y + BLOCK_HEIGHT / 2"
          dominant-baseline="middle"
          :font-size="FONT_SIZE"
          @click="handleClickNode(node)"
        >
          {{ node.text }}
        </text>
        <path
          v-if="node.x && node.y && node.fatherId && node.fatherId !== startId"
          :d="fatherPath(node)"
          fill="none"
          stroke="rgb(215, 215, 215)"
        />
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
        <!-- 圆点 -->
        <circle
          v-if="node.x && node.y && !node.children.length"
          id="dot"
          :cx="node.x - 4"
          :cy="node.y + BLOCK_HEIGHT / 2"
          r="4"
          fill="#666"
        />
        <use
          v-if="node.x && node.y && node.children.length && !node.contract"
          key="contract"
          href="#contract"
          :x="node.x - 10"
          :y="node.y + BLOCK_HEIGHT / 2 - 5"
          @click="handleClickNode(node)"
        />
        <use
          v-if="node.x && node.y && node.children.length && node.contract"
          key="expand"
          href="#expand"
          :x="node.x - 10"
          :y="node.y + BLOCK_HEIGHT / 2 - 5"
          @click="handleClickNode(node)"
        />

        <!-- 根节点底部线条 -->
        <path
          v-if="node.id === startId && node.children.length && !node.contract"
          :d="rootHpaht(node)"
          fill="none"
          stroke="rgb(215, 215, 215)"
        />
        <path
          v-if="node.id === startId && node.children.length && !node.contract"
          :d="rootVpath(node)"
          fill="none"
          stroke="rgb(215, 215, 215)"
        />
        <path
          v-if="node.x && node.y && node.fatherId && node.fatherId === startId"
          :d="rootBottomVpath(node)"
          fill="none"
          stroke="rgb(215, 215, 215)"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import calculate from "./treeService";
export default {
  name: "tree",
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
    // 节点元素高度
    ITEM_HEIGHT: {
      type: Number,
      default: 80
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
    }
  },
  data() {
    return {
      c_nodes: [],
      max_x: 0,
      max_y: 0,
      max_end: 0,
      second_start_x: 0,
      second_end_x: 0
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
      const V = `V ${node.max_child_y + this.BLOCK_HEIGHT / 2}`;
      return `${M} ${V}`;
    },
    // 根节点底部水平线
    rootHpaht: function(node) {
      const M = `M ${this.second_start_x} ${this.ITEM_HEIGHT - 25}`;
      const H = `H ${this.second_end_x}`;
      return `${M} ${H}`;
    },
    // 根节点底部纵线
    rootVpath: function(node) {
      const M = `M ${node.x + node.width / 2} ${node.y + this.BLOCK_HEIGHT}`;
      const V = `V ${this.ITEM_HEIGHT - 25}`;
      return `${M} ${V}`;
    },
    // 第二层节点头部纵线
    rootBottomVpath: function(node) {
      const M = `M ${node.x + node.width / 2} ${node.y}`;
      const V = `V ${node.y - 25}`;
      return `${M} ${V}`;
    }
  },
  mounted() {
    const cal = calculate(
      this.nodes,
      this.startId,
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
  }
};
</script>
<style scoped>
.node-rect {
  /* fill: none; */
  fill: #f2f2f2;
  stroke-width: 1;
}
.node-text {
  user-select: none;
}
</style>
