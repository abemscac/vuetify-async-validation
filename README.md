# Vuetify Async Validation
A plugin for [Vuetify](https://vuetifyjs.com/en/) 2.x async validation.

![preview](./preview.gif)

<a id="demo"></a>
## Demo
See live demo on [CodeSandbox](https://codesandbox.io/s/vuetify-async-validation-demo-mu0fo).

## Installation
```yarn add vuetify-async-validation```

## Usage
### 1. Import and use the plugin
```javascript
import Vue from "vue";
import App from "./App.vue";
import VuetifyAsyncValidation from "vuetify-async-validation";

Vue.use(VuetifyAsyncValidation);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

If you want to split the plugin import into another file like VueCLI has done for you during the installation of Vuetify, you may also import VuetifyAsyncValidation together.
```javascript
import Vue from "vue";
import Vuetify from "vuetify";
import VuetifyAsyncValidation from "vuetify-async-validation";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);
Vue.use(VuetifyAsyncValidation);

export default new Vuetify({});
```

### 2. Modify \<v-form\> element
Add "v-async-form" directive on \<v-form\> element in template
```html
<v-form
  v-async-form
  ref="formRef"
  @submit.prevent="handleFormSubmit"
>
```

### 3. Modify input element
1. Add "v-async-validate" directive on any input element provided by Vuetify that you want to validate asynchronously. For example, \<v-text-field\>
2. Change property "v-bind:rules" to "v-bind:async-rules" (**although it is called async-rules, you can still use sync rules in the array**)
```html
<v-form
  v-async-form
  ref="formRef"
  @submit.prevent="handleFormSubmit"
>
  <v-text-field
    v-async-validate
    v-model="email"
    label="Email"
    :async-rules="$_rules.email">
  </v-text-field>
</v-form>
```

### 4. Modify form submit method
Change the form submit method to async, and call ```validateAsync()``` instead of ```validate()```.
```javascript
export default {
  // ...
  methods: {
    async handleFormSubmit() {
      const isValid = await this.$refs.formRef.validateAsync();
      if (!isValid) {
        return;
      }
      /**
       * All inputs in the form are validated.
       * You can use those data to do other stuff here.
       */
       console.log("Validated.");
    }
  },
```

### 5. Try it
Your async validation logic should work now.

### 6. Suggestions
Due to the fact that the validate method is now asynchronous, we probably don't want the user to click submit button multiple times before the previous validation process is done. It is recommended to disable the form and the submit-button during validation. You can look into the demo above for sample code.

## Customization
Since the async validation usually means we are calling APIs to do some check, it would be great to use debounce function here.
The default debounce interval is 0, which means no debouncing at all.
The plugin provides 2 ways to add debouncing mechanism.

### 1. Globally
You can achieve this by passing an object as the second argument while ```Vue.use(VuetifyAsyncValidation)```.
```javascript
Vue.use(VuetifyAsyncValidation, {
  debounceInterval: 1000, // ms
});
```
### 2. Individually
You can also set the debounce interval for individual input by using the "debounce" argument on "v-async-validate" directive.
```html
<v-text-field
  v-async-validate:debounce="1000"
  v-model="email"
  label="Email"
  :rules="$_rules.email">
</v-text-field>
```
