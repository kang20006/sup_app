<template>
  <Dialog header="Scheduler" v-model:visible="schedule">
    <ScheduleForm @close="closedialog"></ScheduleForm>
  </Dialog>
  <Toast />
  <DataTable
    :value="schedulelist"
    :paginator="true"
    :rows="10"
    v-model:filters="filters1"
    filterDisplay="menu"
    :globalFilterFields="[
      'schedule_id',
      'create_datetime',
      'interval',
      'day',
      'time',
      'tablename',
      'next_run',
    ]"
  >
    <template #header>
      <div class="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label=""
          class="p-button-outlined"
          @click="clearFilter1()"
        />
        <Button
          type="button"
          icon="pi pi-refresh"
          label=""
          class="p-button-outlined"
          @click="refresh()"
        />
        <Button
          type="button"
          icon="pi pi-clock"
          label="Schedule"
          class="p-button-outlined"
          @click="openschedule()"
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
    <Column field="schedule_id" header="ID" :sortable="true">
      <template #filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by id"
        />
      </template>
    </Column>
    <Column field="create_datetime" header="Creation Date" :sortable="true">
      <template #filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="yyyy-mm-dd"
        />
      </template>
    </Column>
    <Column field="interval" header="Interval" :sortable="true">
      <template #filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by Interval"
        />
      </template>
    </Column>
    <Column field="day" header="Day" :sortable="true">
      <template #filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by Day"
        />
      </template>
    </Column>
    <Column field="time" header="Time" :sortable="true">
      <template #filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by Time"
        />
      </template>
    </Column>
    <Column field="tablename" header="Template Name" :sortable="true">
      <template #filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by Template Name"
        />
      </template>
    </Column>
    <Column field="next_run" header="Next Run Time" :sortable="true">
      <template #filter="{ filterModel }">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="yyyy-mm-dd"
        />
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
          icon="pi pi-play"
          class="p-button-success"
          style="margin-right: 0.5em"
          @click="play(slotProps.data.schedule_id)"
        ></Button>
        <Button
          type="button"
          icon="pi pi-trash"
          class="p-button-warning"
          @click="deleteschedule(slotProps.data.schedule_id)"
        ></Button>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import { storeData } from "../store/data";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import axios from "../plugins/axios.js";
import Button from "primevue/button";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import InputText from "primevue/inputtext";
import ScheduleForm from "./ScheduleForm.vue";
import Dialog from "primevue/dialog";
import Toast from 'primevue/toast';
export default {
  name: "ScheduleList",
  components: {
    DataTable,
    Column,
    Button,
    InputText,
    ScheduleForm,
    Dialog,
    Toast
  },
  data() {
    return {
      schedulelist: null,
      filters1: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        day: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        schedule_id: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        create_datetime: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        interval: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        time: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        next_run: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
      },
      user_id: storeData.user.user_id,
      schedule: false,
    };
  },
  mounted() {
    axios
      .get("/schedule/gettask/" + this.user_id)
      .then((res) => {
        this.schedulelist = eval(res.data);
      })
      .catch((err) => console.log(err.message));
  },
  methods: {
    refresh() {
      axios
        .get("/schedule/gettask/" + this.user_id)
        .then((res) => {
          this.schedulelist = eval(res.data);
        })
        .catch((err) => console.log(err.message));
    },
    closedialog(value) {
      this.schedule = value;
    },
    openschedule() {
      this.schedule = true;
    },
    initFilters1() {
      this.filters1 = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        day: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        schedule_id: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        create_datetime: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        interval: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        time: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        next_run: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
      };
    },
    clearFilter1() {
      this.initFilters1();
    },
    // initFilters1() {
    //     this.filters1= {
    //             'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    //             'day': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
    //             'schedule_id': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
    //             'create_datetime': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
    //             'interval': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
    //             'time': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
    //             'next_run': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}
    //         },
    // },
    play(id) {
      axios
        .get("/schedule/runnow/" + id + "/" + this.user_id)
        .then((res) => {
          console.log(res.data);
          this.$toast.add({severity:'success', summary: 'Run Successfully', detail:'The item id '+id+ ' is running.', life: 3000});
        })
        .catch((err) => {
            console.log(err.message)
            this.$toast.add({severity:'error', summary: 'Fail to Run', detail:'The item id '+id+ ' fail.', life: 3000});
        });
    },
    deleteschedule(id) {
      axios
        .delete("/schedule/delete/" + id + "/" + this.user_id)
        .then((res) => {
          console.log(res.data);
          this.$toast.add({severity:'success', summary: 'Delete Successfully', detail:'The item id '+id+ ' is deleted.', life: 3000});
          axios
            .get("/schedule/gettask/" + this.user_id)
            .then((res) => {
              this.schedulelist = eval(res.data);
            })
            .catch((err) => console.log(err.message));
        })
        .catch((err) => {
            this.$toast.add({severity:'error', summary: 'Error while deleting ', detail:'Error when deleting item id '+id, life: 3000});
            console.log(err.message)});
        
    },
  },
};
</script>

<style>
</style>