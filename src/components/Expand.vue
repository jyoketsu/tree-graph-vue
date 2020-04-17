<template>
  <g>
    <use
      class="dot-action"
      v-if="node.x && node.y && node.children.length && !node.contract"
      key="contract"
      href="#contract"
      :x="x"
      :y="y"
      @click="handleClickExpand(node)"
    />
    <use
      class="dot-action"
      v-if="node.x && node.y && node.children.length && node.contract"
      key="expand"
      href="#expand"
      :x="x"
      :y="y"
      @click="handleClickExpand(node)"
    />
  </g>
</template>
<script>
export default {
  name: "tree-expand",
  props: {
    // 节点
    node: {
      // 文本
      type: Object,
      required: true
    },
    // 位置
    position: {
      type: String,
      default: "right"
    },
    // 节点块高度
    BLOCK_HEIGHT: {
      type: Number,
      required: true
    },
    handleClickExpand: {
      type: Function,
      required: true
    }
  },
  computed: {
    x: function() {
      switch (this.position) {
        case "right":
          return this.node.x + this.node.width;
        case "leftBottom":
          return this.node.x;
        default:
          return this.node.x;
      }
    },
    y: function() {
      switch (this.position) {
        case "right":
          return this.node.y + this.BLOCK_HEIGHT / 2 - 5;
        case "leftBottom":
          return this.node.y + this.BLOCK_HEIGHT;
        default:
          return this.node.y + this.BLOCK_HEIGHT / 2 - 5;
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
