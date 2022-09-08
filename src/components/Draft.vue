<template>
  <TreeTable
    :value="draft"
    sortMode="single"
    :filters="filters1"
    filterMode="lenient"
    :paginator="true" :rows="10"
  >
    <template #header>
      <div class="text-right">
        <div class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <InputText
            v-model="filters1['global']"
            placeholder="Global Search"
            size="50"
          />
        </div>
      </div>
    </template>
    <Column field="id" header="ID" :expander="true" :sortable="true">
      <template #filter>
        <InputText
          type="text"
          v-model="filters1['id']"
          class="p-column-filter"
          placeholder="Filter by id"
        />
      </template>
    </Column>
    <Column field="name" header="Name" :sortable="true">
      <template #filter>
        <InputText
          type="text"
          v-model="filters1['name']"
          class="p-column-filter"
          placeholder="Filter by name"
        />
      </template>
    </Column>
    <Column field="datetime" header="Date Time" :sortable="true">
      <template #filter>
        <InputText
          type="text"
          v-model="filters1['datetime']"
          class="p-column-filter"
          placeholder="Filter by datetime"
        />
      </template>
    </Column>
    <Column field="criteria" header="Criteria"></Column>
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
          icon="pi pi-arrow-right"
          class="p-button-success"
          style="margin-right: 0.5em"
          @click="opendraft(slotProps.node.data.id)"
        ></Button>
        <Button
          type="button"
          icon="pi pi-trash"
          class="p-button-warning"
          @click="deletedraft(slotProps.node.data.id)"
        ></Button>
      </template>
    </Column>
    <template #footer>
      <div style="text-align: left">
        <Button icon="pi pi-refresh" @click="refresh" />
      </div>
    </template>
  </TreeTable>
</template>

<script>
import TreeTable from "primevue/treetable";
import Column from "primevue/column";
import { storeData } from "../store/data";
import axios from "../plugins/axios.js";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
export default {
  name: "draft",
  components: {
    TreeTable,
    Column,
    Button,
    InputText
  },
  emits: ["yesDraft"],
  data() {
    return {
      draft: [],
      user_id: storeData.user.user_id,
      select_draft: null,
      filters1: {},
    };
  },
  mounted() {
    axios
      .get("/draftlog/getdraft/" + this.user_id)
      .then((res) => {
        this.draft = res.data.root;
      })
      .catch((err) => console.log(err.message));
  },
  methods: {
    opendraft(id) {
      axios
        .get("/draftlog/getdraft_byid/" + id)
        .then((res) => {
          this.select_draft = {
            selectedColumn: res.data.selectedColumn,
            selectedFilter: res.data.selectedFilter,
            tableName: res.data.tableName,
            selectedFilter_simple: res.data.selectedFilter_simple,
          };
          storeData.updateDraft(this.select_draft);
          this.$emit("yesDraft", true);
        })
        .catch((err) => console.log(err.message));
    },
    deletedraft(id) {
      axios
        .delete("/draftlog/deletedraft/" + id)
        .then((res) => {
          console.log(res.data);
          axios
            .get("/draftlog/getdraft/" + this.user_id)
            .then((res) => {
              this.draft = res.data.root;
            })
            .catch((err) => console.log(err.message));
        })
        .catch((err) => console.log(err.message));
    },
    refresh() {
      axios
        .get("/draftlog/getdraft/" + this.user_id)
        .then((res) => {
          this.draft = res.data.root;
        })
        .catch((err) => console.log(err.message));
    },
  },
};
</script>

<style>
</style>
