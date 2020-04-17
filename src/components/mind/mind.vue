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
      ref="svgEl"
    >
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
            :handleCheck="clickCheck"
          />
          <path
            v-for="(dotY, index) in node.dots"
            :key="index"
            :d="path(node, dotY)"
            stroke="rgb(192,192,192)"
            fill="transparent"
          />
          <Dot :node="node" :BLOCK_HEIGHT="BLOCK_HEIGHT" />
          <Expand
            :node="node"
            :BLOCK_HEIGHT="BLOCK_HEIGHT"
            :handleClickExpand="handleExpand"
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
import treeMixin from "../TreeMixin";
import calculate from "./mindService";
import Drag from "../Drag";
import Node from "../Node";
import Dot from "../Dot";
import Expand from "../Expand";
import Input from "../NodeInput";
export default {
  name: "mind",
  mixins: [treeMixin],
  components: { Drag, Node, Dot, Expand, Input },
  methods: {
    calculateNodes: function(nodes, startId, singleColumn) {
      const cal = calculate(
        nodes,
        startId,
        this.ITEM_HEIGHT,
        this.INDENT,
        this.FONT_SIZE
      );
      console.log("cal------", cal);

      this.c_nodes = cal.nodes;
      this.max_x = cal.max_x;
      this.max_y = cal.max_y;
      this.max_end = cal.max_end;
    },
    path: function(node, dotY) {
      const startX = node.x + node.width;
      const startY = node.y + this.BLOCK_HEIGHT / 2;

      const endX = node.x + node.width + this.INDENT * 2 - 8;
      const endY = dotY + this.BLOCK_HEIGHT / 2;

      const x1 = (startX + endX) / 2;
      const y1 = startY;
      const x2 = x1;
      const y2 = endY;

      const M = `M ${startX} ${startY}`;
      const C = `C ${x1} ${y1},${x2} ${y2}, ${endX} ${endY}`;
      return `${M} ${C}`;
    }
  }
};
</script>
<style scoped>
.svg-wrapper:focus {
  outline: none;
}
</style>
