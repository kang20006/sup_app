<template>
  <div class="card">
    <div class="title">Include</div>
    <div class="grid">
      <div class="col-6">
        <Checkbox
          inputId="SelectAll"
          name="Select All CheckBox"
          v-model="selectAll"
          @click="selectAllClick"
          :binary="true"
        />
        <span class="selectall">Select All</span>

        <!-- <Listbox v-model="selectedColumn" :options="columnData" :multiple="true" :filter="true" optionLabel="label" optionValue="value" listStyle="max-height:20.2vh" style="width:11.5rem" filterPlaceholder="Search">
                        <template #option="slotProps">
                            
                            <div>{{slotProps.option.label}}</div>
                
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
                  :id="i.trim()+'2'"
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
                  :name="i+'2'"
                  @click="additem(k.value)"
                  :id="k.value+'2'"
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
      <div class="col-6">
        <ScrollPanel class="scrollp">
          <span v-for="chip in chips">
            <div class="chip" :id="chip['label']">
              <span class="closebtn" @click="removeChip(chip['label'])"
                >&times;</span
              ><span class="chiptext">{{ chip.value }}</span>
            </div>
          </span>
        </ScrollPanel>
      </div>
    </div>
  </div>

  <!-- <span v-for="chip in chips" >
        <span v-html="chip['html'][0]" @click="removeChip"></span>
    </span> -->
</template>

<script>
import axios from "../plugins/axios.js";
import Listbox from "primevue/listbox";
import Card from "primevue/card";
import Checkbox from "primevue/checkbox";
import ScrollPanel from "primevue/scrollpanel";
import { storeData } from "../store/data";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
export default {
  name: "SelectColumn",
  components: {
    Listbox,
    Card,
    Checkbox,
    ScrollPanel,
    InputText,
    Button,
  },
  emits: ["outputColumn"],
  props: ["isdraft"],
  data() {
    return {
      selectedColumn: [],
      columnData: [],
      selectAll: false,
      chip: [],
      chips: [],
      user_id: storeData.user.user_id,
      permission_id: storeData.user.permission_id,
      search: null,
      searchcol: [],
      isactive: false,
      isinactive: true,
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
  watch: {
    // selectedColumn: function (val) {
    //     this.chips=[]
    //     for (var item in val){
    //         let itemName=this.columnData.find(e => e.value === val[item]);
    //         this.chip = {
    //             html:['<div class="chip" id='+ val[item] +'>'+itemName.label+'<span class="closebtn">&times;</span></div>'],
    //             label:[val[item]]
    //         }
    //         this.chips.push(this.chip);
    //     }

    // },
    selectedColumn: {
      handler: function (val) {
        let groups = [...new Set(this.searchcol.map((item) => item.group))];
        for (let i = 0; i < groups.length; ++i) {
          document.getElementById(groups[i].trim()+'2').className = "active";
          var elements = document.getElementsByName(groups[i]+'2');
          for (let index = 0; index < elements.length; ++index) {
            elements[index].className = "content2";
          }
        }
        var elements = document.getElementsByClassName("focused");
        for (let index = 0; index < elements.length; ++index) {
          elements[index].classList.remove("focused");
        }
        for (let index = 0; index < val.length; ++index) {
          var element = document.getElementById(val[index]+'2');
          element.classList.add("focused");
        }
        this.chips = [];
        this.$emit("outputColumn", val);
        for (var item in val) {
          let itemName = this.columnData.find((e) => e.value === val[item]);
          this.chip = {
            value: itemName.label,
            label: [val[item]],
          };
          this.chips.push(this.chip);
        }
      },
      deep: true,
    },
    // selectedColumn: function (val) {
    //   this.chips = [];
    //   this.$emit("outputColumn", val);
    //   for (var item in val) {
    //     let itemName = this.columnData.find((e) => e.value === val[item]);
    //     this.chip = {
    //       value: itemName.label,
    //       label: [val[item]],
    //     };
    //     this.chips.push(this.chip);
    //   }
    // },
    search: function (val) {
      let groups = [...new Set(this.searchcol.map((item) => item.group))];
      for (let i = 0; i < groups.length; ++i) {
        document.getElementById(groups[i].trim()+'2').className = "active";
        var elements = document.getElementsByName(groups[i]+'2');
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
    isdraft: function (val) {
      this.selectedColumn = storeData.draft.selectedColumn;
      console.log(this.selectedColumn);
    },
  },
  methods: {
    open(group) {
      if (document.getElementById(group.trim()+'2').className === "inactive") {
        document.getElementById(group.trim()+'2').className = "active";
        var elements = document.getElementsByName(group+'2');
        for (let index = 0; index < elements.length; ++index) {
          elements[index].className = "content2";
        }
      } else {
        document.getElementById(group.trim()+'2').className = "inactive";
        var elements = document.getElementsByName(group+'2');
        for (let index = 0; index < elements.length; ++index) {
          elements[index].className = "content";
        }
      }
    },
    additem(val) {
      if (this.selectedColumn.indexOf(val) !== -1) {
        this.selectedColumn = this.selectedColumn.filter(function (value) {
          return value !== val;
        });
      } else {
        this.selectedColumn.push(val);
        // console.log(this.selectedColumn);
      }
      //   var element = document.getElementById(val);
      //   element.className += "focused";
      console.log(this.selectedColumn);
    },
    removeChip(val) {
      this.selectedColumn = this.selectedColumn.filter((item) => {
        return val[0] !== item;
      });
      let index = this.chips.findIndex((e) => e.value === val[0]);
      if (index !== -1) {
        this.chips.slice(index);
      }
    },
    selectAllClick() {
      if (this.selectAll !== true) {
        this.selectedColumn = this.columnData.map(({ value }) => value);
        this.chips = this.columnData;
      } else {
        this.selectedColumn = [];
        this.chips = [];
      }
    },
    collapse() {
      let groups = [...new Set(this.searchcol.map((item) => item.group))];
      for (let i = 0; i < groups.length; ++i) {
        document.getElementById(groups[i].trim()+'2').className = "inactive";
        var elements = document.getElementsByName(groups[i]+'2');
        for (let index = 0; index < elements.length; ++index) {
          elements[index].className = "content";
        }
      }
    },
  },
};
</script>

<style scoped>
.chip {
  display: inline-block;
  padding: 0 25px;
  height: 50px;
  width: 175px;
  font-size: 16px;
  line-height: 50px;
  border-radius: 25px;
  background-color: #f1f1f1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.closebtn {
  padding-left: 10px;
  color: #888;
  font-weight: bold;
  float: right;
  font-size: 20px;
  cursor: pointer;
}

.closebtn:hover {
  color: #000;
}
.card {
  margin-block-start: 20px;
  padding-block-start: 20px;
  padding-inline-start: 20px;
  padding-inline-end: 20px;
  padding-block-end: 20px;
  background-color: #173542;
  border-radius: 20px;
  height: 40vh;
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
.selectall {
  color: white;
}
.scrollp {
  margin-left: 10px;
  width: 100%;
  height: 31vh;
  background-color: #0000004d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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
  margin-top: 0.5em;
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

.focused {
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
    min-height: 15vh;
  }
  [role="listbox"]#ss_elem_list {
    max-height: 15vh;
  }
}
</style>

