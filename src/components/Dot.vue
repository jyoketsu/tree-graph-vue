<template>
  <g>
    <!-- 圆点 -->
    <circle
      v-if="node.x && node.y"
      id="dot"
      :cx="x"
      :cy="node.y + BLOCK_HEIGHT / 2"
      r="4"
      fill="#666"
    />
  </g>
</template>
<script>
export default {
  name: "tree-node",
  props: {
    // 节点
    node: {
      // 文本
      type: Object,
      required: true
    },
    // 节点块高度
    BLOCK_HEIGHT: {
      type: Number,
      required: true
    },
    // 位置
    position: {
      type: String,
      default: "left"
    }
  },
  computed: {
    x: function() {
      switch (this.position) {
        case "left":
          return this.node.x - 4;
        case "right":
          return this.node.x + this.node.width + 4;
        default:
          return this.node.x - 4;
      }
    }
  }
};
</script>
<style scoped>
.dot-action:hover {
  cursor: pointer;
}
</style>
