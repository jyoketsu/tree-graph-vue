<template>
  <input
    class="node-input"
    ref="inputEl"
    :style="{
      width: `${selected.width}px`,
      height: `${BLOCK_HEIGHT}px`,
      fontSize: `${FONT_SIZE}px`,
      top: `${selected.y}px`,
      left: `${selected.x}px`
    }"
    placeholder="请输入节点名"
    :value="selected.text"
    @keydown.enter="handleCommit()"
  />
</template>
<script>
export default {
  name: "node-input",
  props: {
    // 节点
    selected: {
      // 文本
      type: Object,
      required: true
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
    handleChangeNodeText: {
      type: Function,
      required: true
    }
  },
  methods: {
    handleCommit: function(e) {
      this.handleChangeNodeText(this.selected.id, this.$refs.inputEl.value);
    },
    handleClick: function(e) {
      if (e.type === "touchend") this.isTouch = true;
      if (e.type === "click" && this.isTouch) return;
      const el = this.$refs.inputEl;
      if (el && !el.contains(e.target)) {
        this.handleChangeNodeText(this.selected.id, this.$refs.inputEl.value);
      }
    }
  },
  mounted() {
    this.$refs.inputEl.focus();
    document.addEventListener("touchend", this.handleClick, true);
    document.addEventListener("click", this.handleClick, true);
  },
  destroyed() {
    document.removeEventListener("touchend", this.handleClick, true);
    document.removeEventListener("click", this.handleClick, true);
  }
};
</script>
<style scoped>
.node-input {
  box-sizing: border-box;
  border: 1px solid #000000;
  border-radius: 4px;
  padding: 0 5px;
  position: absolute;
}
.node-input:focus {
  outline: none;
}
</style>
