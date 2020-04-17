<template>
  <g @click="handleClickNode(node)">
    <!-- 节点 -->
    <rect
      v-if="node.x && node.y"
      :class="`node-rect ${rectClassName(node)}`"
      :x="node.x"
      :y="node.y"
      rx="4"
      ry="4"
      :width="node.width"
      :height="BLOCK_HEIGHT"
    />
    <clipPath
      v-if="node.x && node.y && node.showAvatar"
      :id="`${alias}-avatar-clip-${node.id}`"
    >
      <circle
        :cx="location(node, 'avatar').x + 11"
        :cy="location(node, 'avatar').y + 11"
        r="11"
      />
    </clipPath>
    <!-- 头像/图片 -->
    <image
      v-if="node.x && node.y && node.showAvatar"
      :x="location(node, 'avatar').x"
      :y="location(node, 'avatar').y"
      width="22"
      height="22"
      :xlink:href="node.avatarUri"
      :clip-path="`url(#${alias}-avatar-clip-${node.id})`"
    />
    <!-- 勾选框 -->
    <use
      v-if="node.x && node.y && node.showCheckbox"
      key="checkbox"
      :href="`#checkbox-${node.checked ? 'checked' : 'uncheck'}`"
      :x="location(node, 'checkbox').x"
      :y="location(node, 'checkbox').y"
      v-on:click.stop="handleCheck(node)"
    />
    <!-- 任务状态 -->
    <use
      v-if="node.x && node.y && node.showStatus"
      key="status"
      :href="`#status${node.limitDay < 0 ? '-overdue' : ''}`"
      :x="location(node, 'status').x"
      :y="location(node, 'status').y"
    />
    <g
      v-if="node.x && node.y && node.showStatus"
      fill="#fff"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      <text
        :x="location(node, 'status').x + 11"
        :y="location(node, 'status').y + 13"
        font-size="10"
        font-weight="800"
      >
        {{ Math.abs(node.limitDay) }}
      </text>
      <text
        :x="location(node, 'status').x + 18"
        :y="location(node, 'status').y + 5"
        font-size="6"
        font-weight="800"
      >
        {{ node.hour }}
      </text>
    </g>

    <!-- 文字 -->
    <text
      v-if="node.x && node.y"
      :class="`node-text ${rectClassName(node)}`"
      :x="location(node, 'text').x"
      :y="location(node, 'text').y"
      dominant-baseline="middle"
      :font-size="FONT_SIZE"
    >
      {{ node.text }}
    </text>
  </g>
</template>
<script>
import { nodeLocation } from "./util";
export default {
  name: "tree-node",
  props: {
    // 节点
    node: {
      // 文本
      type: Object,
      required: true
    },
    // 根节点id
    startId: {
      type: String,
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
    // 别名
    alias: {
      required: true
    },
    selected: {
      type: Object,
      required: true
    },
    handleClickNode: {
      type: Function,
      required: true
    },
    handleCheck: {
      type: Function,
      required: true
    }
  },
  methods: {
    location: function(node, type) {
      return nodeLocation(node, type, this.BLOCK_HEIGHT);
    },
    rectClassName: function(node) {
      // 选中的节点
      if (this.selected.id === node.id) {
        return "selected";
      } else if (
        // 有边框的节点
        node.children.length ||
        node.fatherId === this.startId ||
        node.id === this.startId
      ) {
        return "border-rect";
      } else return "";
    }
  }
};
</script>
<style scoped>
.node-rect {
  fill: none;
  stroke-width: 1;
}
.node-rect.border-rect {
  fill: #fff;
  stroke: rgb(192,192,192);
}
.node-rect.selected {
  fill: rgb(238, 238, 238);
  stroke: #000000;
}
.node-text {
  fill: #999;
}
.node-text:hover {
  cursor: pointer;
}
.node-text.selected {
  fill: #000000;
}
text {
  user-select: none;
}
/* rect,
circle,
image,
.node-text {
  transition: all 0.5s;
} */
</style>
