import type { PluginObject } from "vue";
import AsyncValidate from "./directives/async-validate";
import AsyncForm from "./directives/async-form";

interface Options {
  /**
   * @default 0
   */
  debounceInterval?: number;
}

const VuetifyAsyncValidation: PluginObject<Options> = {
  install: (Vue, options = {}) => {
    Vue.directive(
      "async-validate",
      AsyncValidate(options.debounceInterval ?? 0)
    );
    Vue.directive("async-form", AsyncForm);
  },
};

export default VuetifyAsyncValidation;
