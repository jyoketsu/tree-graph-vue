<template>
  <g class="drag-node" v-if="Math.abs(x) > 5 || Math.abs(y) > 5">
    <rect
      v-if="node.x && node.y"
      :x="node.x + x"
      :y="node.y + y"
      rx="4"
      ry="4"
      :width="node.width"
      :height="BLOCK_HEIGHT"
      fill="rgba(255,255,255,0.1)"
      stroke="rgb(192, 192, 192)"
    />
    <text
      :x="location(node, 'text').x + x"
      :y="location(node, 'text').y + y"
      font-size="14"
      dominant-baseline="middle"
    >
      {{ node.text }}
    </text>
  </g>
</template>
<script>
import { nodeLocation } from "./util";
export default {
  name: "drag-node",
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    // 节点块高度
    BLOCK_HEIGHT: {
      type: Number,
      default: 30
    },
    // 节点
    node: {
      // 文本
      type: Object,
      required: true
    }
  },
  methods: {
    location: function(node, type) {
      return nodeLocation(node, type, this.BLOCK_HEIGHT);
    }
  }
};
</script>
<style scoped>
text {
  fill: #999;
}
.drag-node {
  pointer-events: none;
}
.drag-node:hover {
  cursor: move;
}
</style>
