<template>
  <div
    class="move-tree"
    :style="{ transform: `translate(${translateX}px,${translateY}px)` }"
    @touchstart="handleMoveStart"
    @touchend="handleMoveEnd"
    @mousedown="handleMoveStart"
    @mousemove="handleMove"
    @mouseup="handleMoveEnd"
    @mouseleave="handleMoveEnd"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "move-tree",
  data() {
    return {
      translateX: 0,
      translateY: 0
    };
  },
  methods: {
    handleMoveStart: function(e) {
      let touch;
      if (e.touches) {
        touch = e.touches[0];
      } else {
        touch = e;
      }
      this.clickX = touch.clientX;
      this.clickY = touch.clientY;
      this.started = true;
    },
    handleMove: function(e) {
      e.preventDefault();
      if (this.started) {
        let touch;
        if (e.touches) {
          touch = e.touches[0];
        } else {
          touch = e;
        }

        let movedX = 0;
        let movedY = 0;
        movedX = touch.clientX - this.clickX;
        movedY = touch.clientY - this.clickY;

        this.translateX = this.translateX + movedX;
        this.translateY = this.translateY + movedY;

        this.clickX = touch.clientX;
        this.clickY = touch.clientY;
      }
    },
    handleMoveEnd: function(e) {
      this.started = false;
    }
  }
};
</script>
<style scoped>
.move-tree {
  position: relative;
  width: fit-content;
}
</style>
