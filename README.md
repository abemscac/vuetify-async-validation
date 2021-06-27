# vuetify-async-validation
A plugin for [Vuetify](https://vuetifyjs.com/en/) 2.x async validation.

![preview](./preview.gif)

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
2. Change property "v-bind:rules" to "v-bind:async-rules"
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
    v-bind:async-rules="$_validationRules.email">
  </v-text-field>
</v-form>
```

### 4. Try it
Your async validation rules should work now.
