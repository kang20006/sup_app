<template>
  <div>
    <div class="dropdown" @click="showDropdown">
      <div class="overselect"></div>
      <select class="c-form-input">
        <option value="">Please Select One</option>
      </select>
    </div>
    <div class="multiselect" v-if="show">
      <ul >
        <li v-for="(option, index) in options" :key="index">
          <input type="checkbox" :id="index" :value="option.value" v-model="selected">
          <label :for="index">{{ option.text }}</label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
    name: "test",
    data(){
        return{
            show: false,
            selected: [],
            options: [
      {
        text: 'Uno',
        value: 1
      },
      {
        text: 'Dos',
        value: 'dos'
      },
      {
        text: 'Tres',
        value: 'Tres'
      }
    ]
        };

    },
    methods: {
    onCheck(val) {
      this.selected = val;
    },
    showDropdown() {
      this.show = !this.show
    }
  },
  }

</script>

<style scoped>

.col {
  flex: 0 0 50%;
  max-width: 50%;
  padding-left: 1rem;
  padding-right: 1rem;
}


/*****
- MultiSelect 
*****/

.dropdown { 
  position: relative; 
  cursor: pointer;
}

.multiselect{
    position: relative;
}
ul {
    border: 1px solid #ddd;
    border-top: 0;
    border-radius: 0 0 3px 3px;
    left: 0px;
    padding: 8px 8px;
    position: absolute;
    top: -1rem;
    width: 100%;
    list-style: none;
    max-height: 150px;
    overflow: auto;
  }


.overselect {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>