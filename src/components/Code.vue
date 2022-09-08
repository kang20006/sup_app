<template>
  <Dialog v-model:visible="error">
    <template #header>
      <h3>
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />{{message.header}}
      </h3>
    </template>
    {{message.body}}
  </Dialog>
  <Dialog v-model:visible="success">
    <template #header>
      <h3>
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />A New Table
        Created
      </h3>
    </template>
    Proceed to download the created file ?
    <template #footer>
      <Button
        label="Download"
        icon="pi pi-download"
        class="p-button-text"
        @click="handleClick()"
      />
    </template>
  </Dialog>
  <div class="card">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :on-cancel="onCancel"
      :is-full-page="fullPage"
    />
    <TabView>
      <TabPanel header="Code">
        <SelectButton
          v-model="style"
          :options="options"
          aria-labelledby="single"
        />
        <div class="container">
          <div class="editor-wrapper">
            <div class="menu">
              <span
                class="icon"
                id="run"
                title="Generate Code"
                @click="submit('run')"
              >
                <font-awesome-icon icon="fa-solid fa-code" />
              </span>
              <span class="icon" title="Run SAS" @click="submit('sas')">
                <font-awesome-icon icon="fa-solid fa-person-running" />
              </span>
              <span class="icon" id="copy" title="Copy" @click="copy">
                <font-awesome-icon icon="fa-solid fa-copy" />
              </span>
            </div>

            <div id="editor" contenteditable="true">
              <ScrollPanel style="width: 630px; height: 95%">
                <p v-if="code === []">Code Show Here</p>
                <p :id="'text' + index" v-for="(item, index) in code">
                  {{ item }}
                </p>
              </ScrollPanel>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel header="SAS Log">
        <ScrollPanel class="saslog">
          <div style="width: 630px" v-html="log"></div>
        </ScrollPanel>
      </TabPanel>
    </TabView>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import axios from "../plugins/axios.js";
import SelectButton from "primevue/selectbutton";
import ScrollPanel from "primevue/scrollpanel";
import Dialog from "primevue/dialog";
import { storeData } from "../store/data";
import Button from "primevue/button";

export default {
  name: "Code",
  components: {
    TabView,
    TabPanel,
    SelectButton,
    ScrollPanel,
    Loading,
    Dialog,
    Button,
  },
  // note that the newTableName is an object {newTableName:name,error:true}
  props: ["filterCriteria", "selectedColumn", "newTableName"],
  emits: ["warn"],
  data() {
    return {
      code: [],
      textout: "",
      options: ["PROC SQL", "DATA STEP"],
      style: "PROC SQL",
      log: "",
      isLoading: false,
      fullPage: true,
      submitted: false,
      error: false,
      success: false,
      user_id: storeData.user.user_id,
      permission_id: storeData.user.permission_id,
      path: storeData.user.file_path,
      message:{header:null,
      body:null}
      
      
    };
  },
  methods: {
    handleClick() {
      this.isLoading = true;
      axios({
        url:
          process.env.VUE_APP_BASE_URL +
          "/download/bypath?path=" +
          this.path +
          "&table=" +
          this.newTableName["newTableName"] +
          "&user_id=" +
          this.user_id,
        method: "GET",
        responseType: "blob", // important
      })
        .then((res) => {
          // download file
          const href = URL.createObjectURL(res.data);
          // create "a" HTLM element with href to file & click
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute(
            "download",
            this.newTableName["newTableName"] + ".csv"
          ); //or any other extension
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
          this.isLoading = false;
          this.success = false;
        })
        .catch((err) => {console.log(err.message)
          this.isLoading=false;
          this.error=true;
          this.message.header="Error in Downloading File";
          this.message.body="The file may not exist";

        }
        );
    },
    submit(type) {
      this.isLoading = true;
      this.submitted = true;
      // send to tablename.vue the submitted is true
      this.$emit("warn", this.submitted);
      try {
        this.error = this.newTableName["error"];
      } catch (err) {
        this.error = true;
        this.message.header="The New Output Table Name is Empty";
        this.message.body="Please fill the the output table name!";
      }

      // if error which is user not filled in the name then raise error

      if (this.error === true) {
        this.isLoading = false;
        console.log("error");
      } else {
        axios({
          method: "post",
          url:
            process.env.VUE_APP_BASE_URL +
            "/runcode/" +
            this.user_id +
            "/" +
            this.permission_id +
            "/" +
            this.path,
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            filter: this.filterCriteria,
            column: this.selectedColumn,
            tableName: this.newTableName["newTableName"],
            style: this.style,
            type: type,
          },
        })
          .then((response) => {
            if (type === "sas") {
              this.success = true;
            }
            this.code = response.data.code;
            this.log = response.data.log;
            this.isLoading = false;
            
          })
          .catch(function (error) {
            this.isLoading=false;
            this.error=true;
            this.message.header="Error in Running SAS";
            this.message.body="Please check the log for further info or contact the related person.";
          });
      }
    },
    copy() {
      for (var i in this.code) {
        let copyText = document.getElementById("text" + i).textContent;
        this.textout = this.textout + "\r\n" + copyText;
      }
      this.$copyText(this.textout).then(
        function (e) {
          alert("Copied");
          console.log(e);
        },
        function (e) {
          alert("Can not copy");
          console.log(e);
        }
      );
    },
    onCancel() {
      console.log("cancelled");
    },
  },
  validations() {
    return {
      newTableName: {
        required,
      },
    };
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  box-sizing: border-box;
}
.container {
  display: flex;
  padding: 10px;
  height: 77vh;
  width: 100%;
  background-color: #0000004d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.editor-wrapper {
  width: 100%;
  background-color: #312f2f;
  display: flex;
  flex-direction: column;
  height: 75vh;
  border-radius: 15px;
}
#editor {
  width: 100%;
  height: 100%;
  color: white;
  padding: 10px;
  outline: none;
  overflow-y: auto;
  overflow-x: visible;
  white-space: pre;
  text-align: left;
}
.menu {
  margin: 0 auto;
  padding: 5px 10px;
  display: flex;
  height: 45px;
  background-color: white;
  width: 100%;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}
.icon {
  color: black;
  font-size: 30px;
  width: 50px;
  border: 1px solid rgb(201, 200, 200);
  margin-inline-end: 10px;
  border-radius: 5px;
  background-color: #799fab;
}
.icon:hover {
  color: white;
  background-color: #194755;
  cursor: pointer;
}
.saslog {
  text-align: left;
  width: 100%;
  height: 830px;
}
.card {
  padding-block-start: 20px;
  padding-inline-start: 20px;
  padding-inline-end: 20px;
  padding-block-end: 20px;
  background-color: #173542;
  border-radius: 20px;
  height: 93vh;
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
@media only screen and (max-width: 1600px) {
  .card {
    padding-block-start: 5px;
  }
  .saslog {
    height: 650px;
  }
}
</style>