import type { DirectiveOptions } from "vue";
import debounce from "lodash.debounce";

const EXAMPLE_USAGE = 'v-asyc-validate:debounce="3000"';
const DEFAULT_DEBOUNCE_INTERVAL = 0;
const RULES_PROP_NAME = "async-rules";
const DEBOUNCE_CHECK_NAME = "$_vuetifyAsyncValidation_debounceCheck";

const validateDebounceInterval = ({
  arg,
  value,
}: {
  arg?: string;
  value?: any;
}): number => {
  if (arg && arg !== "debounce") {
    throw new Error(
      `The argument of async-validate directive must be "debounce", but received "${arg}"`
    );
  }

  if (value !== undefined) {
    if (!arg) {
      throw new Error(
        `Value can only be used with debounce argument. For example, ${EXAMPLE_USAGE}`
      );
    } else if (typeof value !== "number") {
      throw new Error(
        `The type of value must be a number, but received ${typeof value}`
      );
    } else if (isNaN(value) || value < 0) {
      throw new Error(
        `The value of debounce must be a number >= 0, but received ${value}`
      );
    }
  } else if (arg) {
    console.warn(
      `This warning is shown because you used the debounce argument on a v-async-validate directive without value. To remove this warning, either add a value to the directive (for example, ${EXAMPLE_USAGE}) or remove the debounce argument from the directive.`
    );
  }

  return value;
};

const AsyncValidate = (pluginDebounceInterval?: number): DirectiveOptions => {
  if (
    typeof pluginDebounceInterval == "number" &&
    (isNaN(pluginDebounceInterval) || pluginDebounceInterval < 0)
  ) {
    throw new Error(
      `The value of debounceInterval option in Vue.use(VuetifyAsyncValidation) must be >= 0, but received ${pluginDebounceInterval}`
    );
  }

  return {
    bind: (element, binding, vnode) => {
      const { componentInstance } = vnode;
      if (!componentInstance) return;

      const validateAsync = function (force?: boolean) {
        return new Promise((resolve) => {
          const { attrs } = vnode?.data || {};
          if (!attrs) return;

          const rules = attrs[RULES_PROP_NAME];
          if (!rules) {
            return;
          } else if (!Array.isArray(rules)) {
            throw new Error(
              `The type of property ${RULES_PROP_NAME} must be array, but received ${typeof rules}`
            );
          }

          const value = this.internalValue;
          const nextErrorBucket: string[] = [];

          if (force) {
            this.$data.hasInput = true;
            this.$data.hasFocused = true;
          }

          Promise.all(rules.map((rule) => rule(value))).then((results) => {
            results.forEach((result) => {
              const resultType = typeof result;
              if (result === false || resultType === "string") {
                nextErrorBucket.push(result || "");
              } else if (resultType !== "boolean") {
                throw new Error(
                  `The return value of ${RULES_PROP_NAME} should be either a string or a boolean, but received "${resultType}".`
                );
              }
            });

            const nextValid = nextErrorBucket.length === 0;

            if (componentInstance.validateAsync === validateAsync) {
              this.$data.errorBucket = nextErrorBucket;
              this.$data.valid = nextValid;
              return resolve(nextValid);
            }
          });
        });
      };

      componentInstance.validateAsync = validateAsync;
    },
    componentUpdated: (element, binding, vnode, oldNode) => {
      const { componentInstance } = vnode;
      if (!componentInstance) return;

      const debounceInterval =
        validateDebounceInterval(binding) ??
        pluginDebounceInterval ??
        DEFAULT_DEBOUNCE_INTERVAL;

      const { attrs } = vnode?.data || {};
      if (!attrs) return;

      // Check rules
      const rules = attrs[RULES_PROP_NAME];
      if (!rules) {
        return;
      } else if (!Array.isArray(rules)) {
        throw new Error(
          `The type of property ${RULES_PROP_NAME} must be an array, but received ${typeof rules}`
        );
      }

      const { value: currentValue } = vnode?.componentOptions?.propsData || {};
      const { value: previousValue } =
        oldNode?.componentOptions?.propsData || {};
      if (currentValue === previousValue) {
        return;
      }

      const validateAsync = function (force?: boolean) {
        return new Promise((resolve) => {
          const { attrs } = vnode?.data || {};
          if (!attrs) return;

          const rules = attrs[RULES_PROP_NAME];
          if (!rules) {
            return;
          } else if (!Array.isArray(rules)) {
            throw new Error(
              `The type of property ${RULES_PROP_NAME} must be array, but received ${typeof rules}`
            );
          }

          const value = this.internalValue;
          const nextErrorBucket: string[] = [];

          if (force) {
            this.$data.hasInput = true;
            this.$data.hasFocused = true;
          }

          Promise.all(rules.map((rule) => rule(value))).then((results) => {
            results.forEach((result) => {
              const resultType = typeof result;
              if (result === false || resultType === "string") {
                nextErrorBucket.push(result || "");
              } else if (resultType !== "boolean") {
                throw new Error(
                  `The return value of ${RULES_PROP_NAME} should be either a string or a boolean, but received "${resultType}".`
                );
              }
            });

            const nextValid = nextErrorBucket.length === 0;

            if (componentInstance.validateAsync === validateAsync) {
              this.$data.errorBucket = nextErrorBucket;
              this.$data.valid = nextValid;
              return resolve(nextValid);
            }
          });
        });
      };

      componentInstance.validateAsync = validateAsync;

      const debounceCheck = debounce(function (force) {
        if (componentInstance[DEBOUNCE_CHECK_NAME] !== debounceCheck) return;
        componentInstance.validateAsync(force);
      }, debounceInterval);

      componentInstance[DEBOUNCE_CHECK_NAME] = debounceCheck;

      debounceCheck();
    },
  };
};

export default AsyncValidate;
