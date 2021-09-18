<template>
  <div class="body">
    <h1>💪 Tasks</h1>

    <div class="kanban">
      <div class="kanban-col-container columns is-mobile m-0 p-0">
        <div
          class="kanban-col  "
          @drop="onDrop($event, col.id)"
          @dragover.prevent
          @dragenter.prevent
          v-for="col in kanbanColumns"
          :key="col.id"
        >
          <div class="kanban-col-header">
            <div class="columns  is-mobile is-vcentered m-0 p-0">
              <div class="kanban-col-name tag">
                {{ col.name }}
              </div>
              <div class="kanban-col-count text-secondary">
                {{ kanbanRenderList[col.id].length }}
              </div>

              <div class="kanban-col-options">
                <b-dropdown aria-role="list" position="is-bottom-left">
                  <template #trigger>
                    <b-icon
                      style="cursor:pointer"
                      icon="dots-horizontal"
                      size="is-small"
                      class="option-icon"
                    >
                    </b-icon>
                  </template>

                  <b-dropdown-item
                    aria-role="listitem"
                    @click="deleteCol(col.id)"
                    >Delete</b-dropdown-item
                  >
                </b-dropdown>
              </div>
            </div>
          </div>
          <div class="kanban-col-body">
            <div
              :key="item.id"
              v-for="item in kanbanRenderList[col.id]"
              draggable
              @dragend="endDrag"
              @dragstart="startDrag($event, item, col.id)"
              @drop="insertAbove($event, col.id, item.id)"
            >
              <kanban-item
                :data="item"
                @open="editKanbanItem(col, item)"
                class="kanban-item"
              >
              </kanban-item>
            </div>
          </div>

          <!--====== new item button ======-->

          <b-button
            class="add-item-btn"
            icon-left="plus"
            @click="openNewItemModal(col)"
          >
            New
          </b-button>
        </div>

        <!--====== new column button ======-->
        <div class="kanban-col">
          <b-button
            v-if="!states.addNewColumnInputVisible"
            @click="showNewColumnInput"
            class="add-column-btn"
            icon-left="plus"
          >
            Add a group
          </b-button>

          <b-input
            v-show="states.addNewColumnInputVisible"
            @blur="crateColumn"
            ref="add-new-column-input"
            @keyup.native.enter="crateColumn"
            v-model="newColumnValue"
            class="add-new-column-input"
            placeholder="New Column"
          ></b-input>
        </div>
      </div>
    </div>

    <b-modal v-model="states.newItemModal" :can-cancel="['escape', 'outside']">
      <kanban-item-modal
        @close="states.newItemModal = false"
        style="width:100%;"
        :column="currentSelectedColumn"
      ></kanban-item-modal>
    </b-modal>
    <b-modal v-model="states.editItemModal" :can-cancel="['escape', 'outside']">
      <kanban-item-modal
        @close="states.editItemModal = false"
        style="width:100%;"
        :column="currentSelectedColumn"
        :item="currentSelectedItem"
      ></kanban-item-modal>
    </b-modal>
  </div>
</template>

<script>
import KanbanItemModal from "~/components/kanbanItemModal.vue";
import { v4 as uuidv4 } from "uuid";
import { mapState, mapGetters } from "vuex";
import KanbanItem from "~/components/kanbanItem.vue";
export default {
  name: "HomePage",
  data() {
    return {
      states: {
        addNewColumnInputVisible: false,
        newItemModal: false,
        editItemModal: false
      },

      currentSelectedColumn: {},
      currentSelectedItem: {},
      newColumnValue: "",
      pageID: undefined
    };
  },
  mounted() {
    if (this.$route.params) {
      this.pageID = this.$route.params;
    } else {
      this.pageID = "default";
    }
  },
  components: {
    KanbanItemModal,
    KanbanItem
  },

  computed: {
    ...mapState({
      kanbanColumns: "kanbanColumns",
      kanbanItems: "kanbanItems"
    }),
    ...mapGetters(["kanbanRenderList"])
  },

  methods: {
    /*------- kanban item menthods -------*/

    editKanbanItem(column, item) {
      this.currentSelectedColumn = column;
      this.currentSelectedItem = item;
      this.states.editItemModal = true;
    },
    openNewItemModal(column) {
      this.currentSelectedColumn = column;
      this.states.newItemModal = true;
    },

    /*------- column menthods -------*/

    showNewColumnInput() {
      this.states.addNewColumnInputVisible = true;

      this.$refs.addNewColumnInput.focus();
      // this.$refs.addNewColumnInput.focus;
    },
    crateColumn() {
      if (this.newColumnValue.trim().length > 0) {
        this.$store.dispatch("createNewColumn", this.newColumnValue);
      }
      this.newColumnValue = "";
      this.states.addNewColumnInputVisible = false;
    },
    deleteCol(columnID) {
      this.$buefy.dialog.confirm({
        message: "Are you sure you want to Delete this column",
        cancelText: "Cancel",
        confirmText: "Delete",
        type: "is-danger",
        onConfirm: () => {
          this.$store.dispatch("deleteColumn", columnID);
        }
      });
    },

    /*------- drag handlers -------*/

    startDrag(evt, item, colID) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("itemID", item.id);

      this.dragging = true;
    },
    endDrag() {
      this.dragging = false;
    },
    onDrop(evt, toColumnID) {
      const itemID = evt.dataTransfer.getData("itemID");

      this.$store.dispatch("moveKanbanItem", { itemID, toColumnID });
    },

    insertAbove(evt, toColumnID, insertAboveID) {
      const itemID = evt.dataTransfer.getData("itemID");

      this.$store.dispatch("moveKanbanItem", {
        itemID,
        toColumnID,
        insertAboveID
      });
    }
  }
};
</script>

<style scoped lang="scss">

.body {
  height: 100vh;

  padding: 100px 0 0 100px;
  max-height: 100vh;
  // background: red;
  overflow: auto;
}

/*======= kanban styles =======*/

.kanban {
  padding-top: 20px;
  margin-top: 20px;
  .kanban-col {
    margin-right: 15px;
    width: 320px !important;
    min-width: 320px !important;
    min-height: 500px;
  }
  .kanban-col-container {
    border-top: 1px solid $border-color;
    padding-top: 20px !important;
    padding-left: 1px !important;
    width: calc(100vw - 250px);
    overflow-x: auto;
    padding-right: 100px !important;
    min-height: calc(100vh - 200px);
    padding-bottom: 50px !important;
  }

  .kanban-col-header {
    margin-bottom: 20px;
    .kanban-col-name {
      font-size: 0.9rem;
      color: $secondary-text;
      margin-right: 10px;
    }
  }
}

/*======= column styles =======*/

.kanban-col-options {
  margin-left: auto;
  margin-right: 10px;
}

.add-new-column-input {
  height: 35px;
  margin-top: -5px;
  font-size: 15px !important;
}

.add-column-btn {
  border: none;
  box-shadow: none;
  width: 100%;
  text-align: left !important;
  color: $light-text;
  margin-top: -5px;
  justify-content: start;
  height: 40px;
}

.add-item-btn {
  height: 40px;
  border: none;
  box-shadow: none;
  width: 100%;
  text-align: left !important;
  color: $secondary-text;
  margin-top: 10px;
  justify-content: start;
}
.add-item-btn:hover {
  background: #efefef;
}

/*======= others =======*/
.option-icon {
  color: $secondary-text;
  font-size: 18px;
}
</style>

<style lang="scss">
.add-new-column-input input {
  font-size: 15px !important;
}
</style>
