<template>
  <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :on-cancel="onCancel"
      :is-full-page="true"
    />
  <Dialog v-model:visible="error">
    <template #header>
      <h3>
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />{{message.header}}
      </h3>
    </template>
    {{message.body}}
  </Dialog>
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
    <!-- <div class="listbox-area">
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
      <FileUpload
        mode="basic"
        name="demo[]"
        :customUpload="true"
        @uploader="onUpload($event)"
      /> 
    </div> -->
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
          <div
            v-for="i in [...new Set(searchcol.map((item) => item.group))]"
            role="group"
            aria-labelledby="cat1"
          >
            <div class="dropdown" @click="showDropdown($event,i)" :id="i.trim() + '1'" >
              <div class="overselect"></div>
              <select class="c-form-input" style="width: 350px !important">
                <option>{{ i }}</option>
              </select>
            </div>
            <div class="multiselect" v-if="show[i]" @mouseleave="closeall" :style="{'top':position+'px !important'}">
            <!-- <div class="multiselect" v-if="show[i]" @mouseleave="closeall"> -->
              <ul>
                <li
                  v-for="k in searchcol.filter(function (e) {
                    return e.group === i;
                  })"
                  :name="i + '1'"
                  :id="k.value + '1'"
                  class="listing"
                  
                >
                  <!-- <input type="checkbox" :value="checkbox(k.value)" /> -->
                  <input
                    type="checkbox"
                    :checked="checkbox(k.value)"
                    @click="additem(k.value)"
                  />
                  <label>{{ k.label }}</label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <label>Upload filter criteria using Excel file</label>
        <FileUpload
              mode="basic"
              name="demo[]"
              :customUpload="true"
              @uploader="onUpload($event)"
            />
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import axios from "../plugins/axios.js";
import Listbox from "primevue/listbox";
import Checkbox from "primevue/checkbox";
import { storeData } from "../store/data";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import Dialog from "primevue/dialog";
export default {
  name: "SelectFilter",
  components: {
    Listbox,
    Checkbox,
    InputText,
    Button,
    FileUpload,
    Dialog,
    Loading
  },
  props: ["selectedFilter"],
  emits: ["output","yesFile"],
  data() {
    return {
      isLoading: false,
      search: null,
      searchcol: [],
      isactive: false,
      isinactive: true,
      columnData: [],
      selectAll: false,
      user_id: storeData.user.user_id,
      permission_id: storeData.user.permission_id,
      file: null,
      show: {},
      error: null,
      message:{header:null,
      body:null},
      position:0
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
    let temp_group = [...new Set(this.searchcol.map((item) => item.group))];
    for (let i = 0; i < temp_group.length; ++i) {
      this.show[temp_group[i]] = false;
    }
  },
  methods: {
    onCancel() {
      console.log("cancelled");
    },
    checkbox(k) {
      // console.log(this.selectedColumn.indexOf(k))
      if (this.selectedFilter.indexOf(k) >= 0) {
        return true;
      } else {
        return false;
      }
    },
    showDropdown(e,i) {
      let original = this.show[i];
      Object.keys(this.show).forEach((key) => {
        this.show[key] = false;
      });
      this.show[i] = !original;
      this.position=e.screenY
      // console.log(this.position)
    },
    closeall() {
      Object.keys(this.show).forEach((key) => {
        this.show[key] = false;
      });
    },
    onUpload(events) {
      this.file = events.files;
      this.isLoading=true
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "/filterupload/" + this.user_id +"/"+this.permission_id,
          this.file,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          this.isLoading=false
          if (res.data['Error']){
            this.error=true,
            this.message['body']=res.data["Error"]
            this.message.header="Error in processing file"
          }
          else{
            storeData.draft.selectedFilter_simple=res.data.selectedFilter_simple
            storeData.draft.selectedFilter=res.data.selectedFilter
            this.$emit("yesFile", true);
          }
        })
        .catch(error=> {
          this.isLoading=false;
          this.error=true;
          this.message['body']="Error in file processing, please try another file."
          this.message.header="Error in processing file"
        });
    },
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
        document.getElementById(groups[i].trim() + "1").className = "inactive";
        var elements = document.getElementsByName(groups[i] + "1");
        for (let index = 0; index < elements.length; ++index) {
          elements[index].className = "content";
        }
      }
    },
  },
  watch: {
    selectedFilter: {
      handler: function (val) {
        // let groups = [...new Set(this.searchcol.map((item) => item.group))];
        // for (let i = 0; i < groups.length; ++i) {
        //   document.getElementById(groups[i].trim() + "1").className = "active";
        //   var elements = document.getElementsByName(groups[i] + "1");
        //   for (let index = 0; index < elements.length; ++index) {
        //     elements[index].className = "content2";
        //   }
        // }
        // try {
        //   var elements = document.getElementsByClassName("focused1");
        //   for (let index = 0; index < elements.length; ++index) {
        //     elements[index].classList.remove("focused1");
        //   }
        //   for (let index = 0; index < val.length; ++index) {
        //     var element = document.getElementById(val[index] + "1");
        //     element.classList.add("focused1");
        //   }
        // } catch (err) {
        //   let extract = this.searchcol.map((a) => a.value);
        //   let newgroup = val.filter((x) => extract.includes(x));
        //   var elements = document.getElementsByClassName("focused");
        //   for (let index = 0; index < elements.length; ++index) {
        //     elements[index].classList.remove("focused");
        //   }
        //   for (let index = 0; index < newgroup.length; ++index) {
        //     var element = document.getElementById(newgroup[index] + "1");
        //     element.classList.add("focused");
        //   }
        // }
        // this.$emit("output", val);
      },
      deep: true,
    },
    search: function (val) {
      // let groups = [...new Set(this.searchcol.map((item) => item.group))];
      // for (let i = 0; i < groups.length; ++i) {
      //   document.getElementById(groups[i].trim() + "1").className = "active";
      //   var elements = document.getElementsByName(groups[i] + "1");
      //   for (let index = 0; index < elements.length; ++index) {
      //     elements[index].className = "content2";
      //   }
      // }

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
.listing{
  display: flex;
  justify-content: left;
}
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
  /* position:static; */
}

.multiselect {
  position: fixed;
  width: 350px;
  height: 10%;
  z-index: 99999;
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
  max-height: 200px;
  overflow: auto;
  background: #2a323d;
}

.overselect {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /* position: fixed; */
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
  width: 100%;
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
  width: 23rem;
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
  z-index: 1;
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