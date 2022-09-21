<template>
  <Toast/>
  <Dialog v-model:visible="error">
    <template #header>
      <h3>
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />{{message.header}}
      </h3>
    </template>
    {{message.body}}
  </Dialog>
  <loading
    v-model:active="isLoading"
    :can-cancel="true"
    :on-cancel="onCancel"
    :is-full-page="fullPage"
  />
  <DataTable
    :value="file"
    :paginator="true"
    :rows="10"
    v-model:filters="filters1"
    filterDisplay="menu"
    :globalFilterFields="['datetime', 'file_id', 'tablename']"
  >
    <template #header>
      <div class="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          class="p-button-outlined"
          @click="clearFilter1()"
        />
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="filters1['global'].value"
            placeholder="Keyword Search"
          />
        </span>
      </div>
    </template>
    <Column field="datetime" header="Date Time" :sortable="true">
      <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="yyyy-mm-dd" />
      </template>
    </Column>
    <Column field="file_id" header="File ID" :sortable="true">
      <template #filter="{filterModel}">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by file id"/>
      </template>
    </Column>
    <Column field="tablename" header="Name" :sortable="true">
      <template #filter="{filterModel}">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by table name"/>
      </template>
    </Column>
    <Column
      headerStyle="width: 10rem"
      headerClass="text-center"
      bodyClass="text-center"
    >
      <template #header>
        <span class="pi pi-cog"></span>
      </template>

      <template #body="slotProps">
        <Button
          type="button"
          icon="pi pi-download"
          class="p-button-success"
          style="margin-right: 0.5em"
          @click="
            downloadfile(slotProps.data.file_id, slotProps.data.tablename)
          "
        ></Button>
        <Button
          type="button"
          icon="pi pi-trash"
          class="p-button-warning"
          @click="deletefile(slotProps.data.file_id)"
        ></Button>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { storeData } from "../store/data";
import axios from "../plugins/axios.js";
import Button from "primevue/button";
import Loading from "vue-loading-overlay";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import {FilterMatchMode,FilterOperator} from 'primevue/api';
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
export default {
  name: "file",
  components: {
    DataTable,
    Column,
    Button,
    Loading,
    InputText,
    Calendar,
    Dialog,
    InputText,
    Toast
  },
  data() {
    return {
      file: [],
      user_id: storeData.user.user_id,
      isLoading: false,
      fullPage: true,
      filters1:  {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                'datetime': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
                'file_id': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
                'tablename': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
                
            },
      error: false,
      message:{
        header:null,
        body:null
      }
    };
  },
  mounted() {
    axios
      .get("/download/loadfile/" + this.user_id)
      .then((res) => {
        this.file = res.data;
      })
      .catch((err) => console.log(err.message));
  },
  methods: {
    clearFilter1() {
            this.initFilters1();
        },
        initFilters1() {
            this.filters1 = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                'datetime': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
                'file_id': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
                'tablename': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
                
            }
        },
    downloadfile(id, name) {
      this.isLoading = true;
      axios({
        url:
          process.env.VUE_APP_BASE_URL +
          "/download/byid?file_id=" +
          id +
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
          link.setAttribute("download", name + ".csv"); //or any other extension
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
          this.isLoading = false;
          this.success = false;
        })
        .catch((err) => {
          this.isLoading=false;
          this.error=true;
          this.message.body="File might not exist due to error"
          this.message.header="Download fail"

        });
    },
    deletefile(id) {
      axios
        .delete(
          "/download/deletefile?file_id=" + id + "&user_id=" + this.user_id
        )
        .then((res) => {
          console.log(res.data);
          axios
            .get("/download/loadfile/" + this.user_id)
            .then((res) => {
              this.file = res.data;
              this.$toast.add({severity:'success', summary: 'Delete Successfully', detail:'The item id '+id+ ' is deleted.', life: 3000});
            })
            .catch((err) => {console.log(err.message)
              });
        })
        .catch((err) => {console.log(err.message)
          this.$toast.add({severity:'error', summary: 'Fail to delete', detail:'The item id '+id+ ' fail to delete. File might not exist.', life: 3000});});
    },
    refresh() {
      axios
        .get("/download/loadfile/" + this.user_id)
        .then((res) => {
          this.file = res.data;
        })
        .catch((err) => {console.log(err.message)
          this.$toast.add({severity:'error', summary: 'Fail to Download', detail:'The item fail to download.', life: 3000});
        });
    },
    onCancel() {
      console.log("cancelled");
    },
  },
};
</script>

<style>
</style>