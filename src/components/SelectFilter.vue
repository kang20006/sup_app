<template>
  <div class="card">
    <div class="title">Filter</div>
    <!-- <Listbox
        v-model="selectedFilter"
        :options="columnData"
        :multiple="true"
        :filter="true"
        optionLabel="label"
        optionValue="value"
        listStyle="max-height:23.3vh"
        style="width: 12rem"
        filterPlaceholder="Search"
    >
        <template #option="slotProps">
        <div>{{ slotProps.option.label }}</div>
        </template>
    </Listbox> -->
    <div class="listbox-area">
      <div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-search"></i>
          </span>
          <InputText placeholder="Search" v-model="search" />
        </div>
        <div
          id="ss_elem_list"
          tabindex="0"
          role="listbox"
          aria-labelledby="ss_elem"
        >
          <ul
            v-for="i in [...new Set(searchcol.map((item) => item.group))]"
            role="group"
            aria-labelledby="cat1"
          >
            <li
              role="presentation"
              @click="open(i)"
              :id="i.trim() + '1'"
              class="inactive"
            >
              {{ i }}
            </li>
            <li
              v-for="k in searchcol.filter(function (e) {
                return e.group === i;
              })"
              role="option"
              class="content"
              :name="i + '1'"
              @click="additem(k.value)"
              :id="k.value + '1'"
            >
              {{ k.label }}
            </li>
          </ul>
        </div>
      </div>
      <Button
              label="Collapse All"
              class="p-button-text p-button-sm"
              @click="collapse"
            />
    </div>
  </div>
</template>

<script>
import axios from "../plugins/axios.js";
import Listbox from "primevue/listbox";
import Checkbox from "primevue/checkbox";
import { storeData } from "../store/data";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
export default {
  name: "SelectFilter",
  components: {
    Listbox,
    Checkbox,
    InputText,
    Button
  },
  props: ["selectedFilter"],
  emits: ["output"],
  data() {
    return {
      search: null,
      searchcol: [],
      isactive: false,
      isinactive: true,
      columnData: [],
      selectAll: false,
      user_id: storeData.user.user_id,
      permission_id: storeData.user.permission_id,
    };
  },
  mounted() {
    axios
      .get("/columndata/simple/" + this.user_id + "/" + this.permission_id)
      .then((res) => {
        this.columnData = res.data;
        this.searchcol = this.columnData;
      })
      .catch((err) => console.log(err.message));
  },
  methods: {
    open(group) {
      if (
        document.getElementById(group.trim() + "1").className === "inactive"
      ) {
        document.getElementById(group.trim() + "1").className = "active";
        var elements = document.getElementsByName(group + "1");
        for (let index = 0; index < elements.length; ++index) {
          elements[index].className = "content2";
        }
      } else {
        document.getElementById(group.trim() + "1").className = "inactive";
        var elements = document.getElementsByName(group + "1");
        for (let index = 0; index < elements.length; ++index) {
          elements[index].className = "content";
        }
      }
    },
    additem(val) {
      this.$emit("output", val);
      //   if (this.selectedFilter.indexOf(val) !== -1) {
      // this.selectedFilter = this.selectedFilter.filter(function (value) {
      //   return value !== val;
      // });
      //   } else {
      // this.selectedFilter.push(val);

      //   }
      //   var element = document.getElementById(val);
      //   element.className += "focused";
    },
    collapse() {
      let groups = [...new Set(this.searchcol.map((item) => item.group))];
      for (let i = 0; i < groups.length; ++i) {
        document.getElementById(groups[i].trim()+"1").className = "inactive";
        var elements = document.getElementsByName(groups[i]+"1");
        for (let index = 0; index < elements.length; ++index) {
          elements[index].className = "content";
        }
      }
    },
  },
  watch: {
    selectedFilter: {
      handler: function (val) {
        let groups = [...new Set(this.searchcol.map((item) => item.group))];
        for (let i = 0; i < groups.length; ++i) {
          document.getElementById(groups[i].trim() + "1").className = "active";
          var elements = document.getElementsByName(groups[i] + "1");
          for (let index = 0; index < elements.length; ++index) {
            elements[index].className = "content2";
          }
        }
        var elements = document.getElementsByClassName("focused1");
        for (let index = 0; index < elements.length; ++index) {
          elements[index].classList.remove("focused1");
        }
        for (let index = 0; index < val.length; ++index) {
          var element = document.getElementById(val[index] + "1");
          element.classList.add("focused1");
        }

        // this.$emit("output", val);
      },
      deep: true,
    },
    search: function (val) {
      let groups = [...new Set(this.searchcol.map((item) => item.group))];
      for (let i = 0; i < groups.length; ++i) {
        document.getElementById(groups[i].trim() + "1").className = "active";
        var elements = document.getElementsByName(groups[i] + "1");
        for (let index = 0; index < elements.length; ++index) {
          elements[index].className = "content2";
        }
      }

      if (val !== null || val !== "") {
        this.searchcol = this.columnData.filter((x) =>
          x["label"].toLowerCase().includes(val.toLowerCase())
        );
      } else {
        this.searchcol = this.columnData;
      }
    },
  },

  // selectedFilter: function (val) {
  //   this.$emit("output", val);
  //   // console.log(val)
  // },
  //   isdraft: function () {
  //     // console.log(this.selectedFilter)
  //     // this.selectedFilter=storeData.draft.selectedFilter_simple
  //     this.$emit("output", storeData.draft.selectedFilter_simple);
  //   },
};
</script>

<style scoped>
.card {
  margin-block-start: 20px;
  padding-block-start: 20px;
  padding-inline-start: 20px;
  padding-inline-end: 20px;
  padding-block-end: 20px;
  background-color: #173542;
  border-radius: 20px;
  height: 40vh;
  width: 125%;
}
.card .title {
  display: flex;
  align-items: center;
  padding-inline-start: 20px;
  margin-inline-start: -15px;
  margin-inline-end: -15px;
  margin-block-end: 10px;
  background-color: #799fab;
  border-radius: 20px;
  color: white;
  height: 4.5vh;
  font-size: x-large;
  font-weight: bold;
}
.listbox-area {
  padding: 5px;
  border: 1px solid #aaa;
  border-radius: 4px;
  background: #2a323d;
  width: 15rem;
  color: #e1e2e4;
}

[role="listbox"] {
  margin: 1em 0 0;
  padding: 0;
  min-height: 20.2vh;
  border: 1px solid #10252e;
  background: #2a323d;
  cursor: pointer;
}

[role="listbox"]#ss_elem_list {
  position: relative;
  max-height: 20.2vh;
  overflow-y: auto;
  cursor: pointer;
}

[role="listbox"] + *,
.listbox-label + * {
  margin-top: 1em;
}

[role="group"] {
  margin: 0;
  padding: 0;
}

[role="group"] > [role="presentation"] {
  display: block;
  margin: 0;
  padding: 0 0.5em;
  font-weight: bold;
  line-height: 2;
  background-color: #20262e;
}
[role="presentation"]:hover {
  background-color: #3e454e;
}

[role="option"] {
  position: relative;
  display: block;
  padding: 0 1em 0 1.5em;
  line-height: 1.8em;
}

.focused1 {
  background-color: #64bfff !important;
  color: #355a74 !important;
}

.content {
  padding: 0 18px;
  display: none;
  overflow: hidden;
  background-color: #2a323d;
  border: 1px solid rgb(110, 108, 108);
}
.content2 {
  padding: 0 18px;
  display: block;
  overflow: hidden;
  background-color: #2a323d;
  border: 1px solid rgb(110, 108, 108);
}
[role="option"]:hover {
  background-color: #575d66;
}

.inactive:after {
  content: "\02795"; /* Unicode character for "plus" sign (+) */
  font-size: 13px;
  color: white;
  float: right;
  margin-left: 5px;
}
.active:after {
  content: "\2796"; /* Unicode character for "plus" sign (-) */
  font-size: 13px;
  color: white;
  float: right;
  margin-left: 5px;
}
@media only screen and (max-width: 1600px) {
  .chip {
    width: 155px;
  }
  [role="listbox"] {
    min-height: 16vh;
  }
  [role="listbox"]#ss_elem_list {
    max-height: 16vh;
  }
}
</style>