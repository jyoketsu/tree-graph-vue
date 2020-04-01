<template>
  <Drag>
    <svg
      class="tree-svg-single"
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
      </g>
    </svg>
  </Drag>
</template>
<script>
import calculate from "./treeService";
import Drag from "../Drag";
export default {
  name: "tree-single",
  components: { Drag },
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
      default: 30
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
      second_end_x: 0,
      translateX: 0,
      translateY: 0
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
