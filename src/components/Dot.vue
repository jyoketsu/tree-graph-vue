<template>
  <g>
    <!-- 圆点 -->
    <circle
      v-if="node.x && node.y"
      id="dot"
      :cx="node.x - 4"
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
    }
  }
};
</script>
<style scoped>
.dot-action:hover {
  cursor: pointer;
}
</style>
