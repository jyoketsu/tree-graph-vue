import {
  changeNodeText,
  addNext,
  addChildNode,
  deleteNode,
  findNodeById,
  dot,
  save,
  checkNode,
  editNode,
  dragSort
} from "./util";

var treeMixin = {
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
    // 非受控模式
    uncontrolled: {
      type: Boolean,
      default: true
    },
    // 节点元素高度
    ITEM_HEIGHT: {
      type: Number,
      default: 50
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
      default: 25
    },
    // 头像宽度
    AVATAR_WIDTH: {
      type: Number,
      default: 22
    },
    CHECK_BOX_WIDTH: {
      type: Number,
      default: 18
    },
    PATH_WIDTH: {
      type: Number,
      default: 1.5
    },
    handleClickNode: {
      type: Function,
      default: function(node) {
        console.log("---handleClickNode---", node);
      }
    },
    handleDbClickNode: {
      type: Function,
      default: function(node) {
        console.log("---handleDbClickNode---", node);
      }
    },
    handleClickExpand: {
      type: Function,
      default: function(node) {
        console.log("---handleClickExpand---", node);
      }
    },
    handleCheck: {
      type: Function,
      default: function(node) {
        console.log("---handleCheck---", node);
      }
    },
    handleChangeNodeText: {
      type: Function,
      default: function(nodeId, text) {
        console.log("---handleChangeNodeText---", nodeId, text);
      }
    },
    handleAddNext: {
      type: Function,
      default: function(selected, added) {
        console.log("---handleAddNext---", selected, added);
      }
    },
    handleAddChild: {
      type: Function,
      default: function(selected, added) {
        console.log("---handleAddChild---", selected, added);
      }
    },
    handleDeleteNode: {
      type: Function,
      default: function(selected) {
        console.log("---handleDeleteNode---", selected);
      }
    },
    handleSave: {
      type: Function,
      default: function(nodes) {
        alert(nodes ? JSON.stringify(nodes) : "保存");
      }
    }
  },
  data() {
    return {
      c_nodes: [],
      max_x: 0,
      max_y: 0,
      max_end: 0,
      selected: {},
      showInput: false,
      showNewInput: false,
      showDragNode: false,
      movedNodeX: 0,
      movedNodeY: 0
    };
  },
  methods: {
    clickNode: function(node) {
      // if (this.selected.id === node.id) {
      //   this.showInput = true;
      // } else {
      //   this.$refs.svgEl.focus();
      // }
      clearTimeout(this.clickTimeId);
      let that = this;
      this.clickTimeId = setTimeout(function() {
        that.selected = node;
        that.handleClickNode(node);
      }, 250);
    },
    dbClickNode: function(node) {
      clearTimeout(this.clickTimeId);
      this.selected = node;
      this.showInput = true;
      this.handleDbClickNode(node);
    },
    clickCheck: function(node) {
      if (this.uncontrolled) {
        this.c_nodes = checkNode(this.c_nodes, node.id);
      }
      this.handleCheck(node);
    },
    handleExpand: function(node) {
      if (this.uncontrolled) {
        let nodes = dot(this.c_nodes, node.id);
        this.calculateNodes(nodes, this.startId, this.singleColumn);
      }
      this.handleClickExpand(node);
    },
    handleChangeText: function(nodeId, text) {
      this.showInput = false;
      this.showNewInput = false;
      this.handleChangeNodeText(nodeId, text);
      if (this.uncontrolled) {
        let nodes = changeNodeText(this.c_nodes, nodeId, text);
        this.calculateNodes(nodes, this.startId, this.singleColumn);
        this.$refs.svgEl.focus();
      }
    },
    editNode: function(entity) {
      if (this.uncontrolled) {
        if (!this.selected.id) {
          return alert("请先选中节点！");
        }
        let nodes = editNode(this.c_nodes, this.selected.id, entity);
        this.calculateNodes(nodes, this.startId, this.singleColumn);
      }
    },
    addNext: function() {
      if (!this.selected.id) {
        return alert("请先选中节点！");
      }
      if (this.selected.id === this.startId) {
        return alert("根节点无法添加兄弟节点！");
      }
      if (this.uncontrolled) {
        let res = addNext(this.c_nodes, this.selected.id);
        this.calculateNodes(res.nodes, this.startId, this.singleColumn);
        this.handleAddNext(this.selected, res.addedNode);
        let selected = findNodeById(this.c_nodes, res.addedNode.id);
        this.selected = selected;
        this.showNewInput = true;
      } else {
        this.handleAddNext(this.selected);
      }
    },
    addChild: function(e) {
      e.preventDefault();
      if (!this.selected.id) {
        return alert("请先选中节点！");
      }
      if (this.uncontrolled) {
        let res = addChildNode(this.c_nodes, this.selected.id);
        this.calculateNodes(res.nodes, this.startId, this.singleColumn);
        this.handleAddChild(this.selected, res.addedNode);
        let selected = findNodeById(this.c_nodes, res.addedNode.id);
        this.selected = selected;
        this.showNewInput = true;
      } else {
        this.handleAddChild(this.selected);
      }
    },
    deleteNode: function() {
      if (!this.selected.id) {
        return alert("请先选中节点！");
      }
      if (this.selected.id === this.startId) {
        return alert("根节点不允许删除！");
      }
      if (this.uncontrolled) {
        this.handleDeleteNode(this.selected);
        let nodes = deleteNode(this.c_nodes, this.selected.id, this.startId);
        this.calculateNodes(nodes, this.startId, this.singleColumn);
        this.selected = {};
      } else {
        this.handleDeleteNode(this.selected);
      }
    },
    saveNodes: function() {
      if (this.uncontrolled) {
        const nodes = save(this.c_nodes);
        this.handleSave(nodes);
      } else {
        this.handleSave();
      }
    },
    handleDragStart: function(e) {
      if (e.target.classList.contains("selected")) {
        this.showDragNode = true;
        this.clickX = e.clientX;
        this.clickY = e.clientY;
      }
    },
    handleMoveNode: function(e) {
      if (this.showDragNode) {
        let movedX = 0;
        let movedY = 0;
        movedX = e.clientX - this.clickX;
        movedY = e.clientY - this.clickY;

        this.movedNodeX = this.movedNodeX + movedX;
        this.movedNodeY = this.movedNodeY + movedY;

        this.clickX = e.clientX;
        this.clickY = e.clientY;
      }
    },
    handleDragEnd: function() {
      if (this.showDragNode) {
        this.showDragNode = false;
        const x = this.selected.x + this.movedNodeX;
        const y = this.selected.y + this.movedNodeY;
        this.movedNodeX = 0;
        this.movedNodeY = 0;
        dragSort(this.c_nodes, x, y);
      }
    }
  },
  watch: {
    nodes: {
      immediate: true,
      deep: true,
      handler: function() {
        if (!this.uncontrolled) {
          this.calculateNodes(this.nodes, this.startId, this.singleColumn);
        }
      }
    }
  },
  mounted() {
    this.calculateNodes(this.nodes, this.startId, this.singleColumn);
  }
};

export default treeMixin;
