var treeMixin = {
  data() {
    return {
      test: "test----------"
    };
  },
  created: function() {
    this.hello();
  },
  methods: {
    hello: function() {
      console.log("hello from mixin!");
    }
  }
};

export default treeMixin;
