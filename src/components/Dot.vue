<template>
  <g>
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
      class="dot-action"
      v-if="node.x && node.y && node.children.length && !node.contract"
      key="contract"
      href="#contract"
      :x="node.x - 10"
      :y="node.y + BLOCK_HEIGHT / 2 - 5"
      @click="handleClickDot(node)"
    />
    <use
      class="dot-action"
      v-if="node.x && node.y && node.children.length && node.contract"
      key="expand"
      href="#expand"
      :x="node.x - 10"
      :y="node.y + BLOCK_HEIGHT / 2 - 5"
      @click="handleClickDot(node)"
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
    handleClickDot: {
      type: Function,
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
