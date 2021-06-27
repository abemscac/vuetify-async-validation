import type { DirectiveOptions } from "vue";

const AsyncForm: DirectiveOptions = {
  bind: (element, binding, vnode) => {
    const { componentInstance } = vnode;
    /**
     * For reference, please see
     * @see {@link https://github.com/vuetifyjs/vuetify/blob/4bf78761cc7abcf4719985d8cf5d63cab6b901c2/packages/vuetify/src/components/VForm/VForm.ts#L90}
     */
    componentInstance.validateAsync = async function () {
      const results = await Promise.all(
        this.$data.inputs.map((input) =>
          input.validateAsync ? input.validateAsync(true) : input.validate(true)
        )
      );

      return results.filter((x) => !x).length === 0;
    };
  },
};

export default AsyncForm;
