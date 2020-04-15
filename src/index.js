import tree from "./components/tree/index";
import mind from "./components/mind/index";

const components = [tree, mind];
const install = function(Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component);
  });
};

/* 支持使用标签的方式引入 */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default { install, tree, mind };
