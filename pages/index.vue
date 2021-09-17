<template>
  <div class="body">
    <h1>💪 Tasks</h1>

    <div class="kanban">
      <div class="kanban-col-container columns m-0 p-0">
        <div
          class="kanban-col  "
          @drop="onDrop($event, col.id)"
          @dragover.prevent
          @dragenter.prevent
          v-for="col in kanbanColumns"
          :key="col.id"
        >
          <div class="kanban-col-header">
            <div class="columns is-vcentered m-0 p-0">
              <div class="kanban-col-name tag">
                {{ col.name }}
              </div>
              <div class="kanban-col-count">
                {{ kanbanRenderList[col.id].length }}
              </div>
            </div>
          </div>
          <div class="kanban-col-body drop-zone">
            <div
              @click="editKanbanItem(col, item)"
              v-for="item in kanbanRenderList[col.id]"
              :key="item.id"
              class="kanban-item drag-el"
              draggable
              @dragstart="startDrag($event, item, col.id)"
              @dragend="endDrag"
            >
              <h3 class="kanban-item-title" v-if="item.title">
                {{ item.title }}
              </h3>
              <h3
                class="kanban-item-title "
                v-else
                style="color:rgba(0,0,0,0.3)"
              >
                Untitled
              </h3>

              <div class="kanban-item-body">
                {{ item.desc }}
              </div>
            </div>
          </div>

          <b-button
            class="addItemBtn"
            icon-left="plus"
            @click="openNewItemModal(col)"
          >
            New
          </b-button>
        </div>

        <div class="kanban-col">
          <b-button
            v-if="!states.addNewColumnInputVisible"
            @click="showNewColumnInput"
            class="addColumnBtn"
            icon-left="plus"
          >
            Add a group
          </b-button>

          <b-input
            v-show="states.addNewColumnInputVisible"
            @blur="crateColumn"
            ref="addNewColumnInput"
            @keyup.native.enter="crateColumn"
            v-model="newColumnValue"
            class="addNewColumnInput"
            placeholder="New Column"
          ></b-input>
        </div>
      </div>
    </div>

    <b-modal v-model="states.newItemModal" :can-cancel="['escape', 'outside']">
      <kanban-item-modal
        style="width:100%;"
        :column="currentSelectedColumn"
      ></kanban-item-modal>
    </b-modal>
    <b-modal v-model="states.editItemModal" :can-cancel="['escape', 'outside']">
      <kanban-item-modal
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
      newColumnValue: ""
    };
  },
  methods: {
    showNewColumnInput() {
      this.states.addNewColumnInputVisible = true;

      console.log(this.$refs.addNewColumnInput.focus());
      // this.$refs.addNewColumnInput.focus;
    },
    editKanbanItem(column, item) {
      this.currentSelectedColumn = column;
      this.currentSelectedItem = item;
      this.states.editItemModal = true;
    },

    crateColumn() {
      if (this.newColumnValue.trim().length > 0) {
        this.$store.dispatch("createNewColumn", this.newColumnValue);
      }
      this.newColumnValue = "";
      this.states.addNewColumnInputVisible = false;
    },

    openNewItemModal(column) {
      this.currentSelectedColumn = column;
      this.states.newItemModal = true;
    },
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

      // item.list = list;
    }
  },
  components: {
    KanbanItemModal
  },

  computed: {
    ...mapState({
      kanbanColumns: "kanbanColumns",
      kanbanItems: "kanbanItems"
    }),
    ...mapGetters(["kanbanRenderList"])
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

.addNewColumnInput {
  height: 35px;
  margin-top: -5px;
  font-size: 15px !important;
}

.createNewItem {
  background: white;
  width: 500px;
}

.addColumnBtn {
  border: none;
  box-shadow: none;
  width: 100%;
  text-align: left !important;
  color: rgba(55, 53, 47, 0.4);
  margin-top: -5px;
  justify-content: start;
  height: 40px;
}
.addColumnBtn:hover {
  background: #efefef;
}

.addItemBtn {
  height: 40px;
  border: none;
  box-shadow: none;
  width: 100%;
  text-align: left !important;
  color: rgba(55, 53, 47, 0.4);
  margin-top: 10px;
  justify-content: start;
}
.addItemBtn:hover {
  background: #efefef;
}
.kanban {
  padding-top: 20px;
  margin-top: 20px;
  .kanban-col {
    margin-right: 15px;
    width: 320px !important;
    min-width: 320px !important;

    // border: 1px solid blue;

    min-height: 500px;
  }
  .kanban-col-container {
    border-top: 1px solid rgb(223, 223, 222);
    padding-top: 20px !important;
    padding-left: 1px !important;
    width: calc(100vw - 250px);
    overflow-x: auto;
    padding-right: 100px !important;
    min-height: calc(100vh - 200px);
    padding-bottom: 50px !important;
    // background: red;
  }

  .kanban-col-header {
    margin-bottom: 20px;
    .kanban-col-name {
      font-size: 0.9rem;
      color: $secondary-text;
      margin-right: 10px;
    }
  }

  @mixin grabbing-cursor {
    cursor: url("https://www.google.com/intl/en_ALL/mapfiles/closedhand.cur"),
      all-scroll;
    cursor: -webkit-grabbing;
    cursor: -moz-grabbing;
    cursor: -o-grabbing;
    cursor: -ms-grabbing;
    cursor: grabbing;
  }

  .kanban-item:active {
    @include grabbing-cursor;
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }

  .kanban-item:hover {
    background: #f9f9f8;
  }
  .kanban-item {
    cursor: pointer;

    display: block;
    width: 100%;

    box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px,
      rgb(15 15 15 / 10%) 0px 2px 4px;
    border-radius: 4px;
    padding: 10px;
    margin-top: 10px;
    .kanban-item-title {
      font-weight: 500;

      font-size: 17px;
      margin-bottom: 5px;
    }

    .kanban-item-body {
      font-size: 15px;
      color: $secondary-text;
    }
  }
}

.shot {
  position: absolute;
}
</style>

<style lang="scss">
.addNewColumnInput input {
  font-size: 15px !important;
}
</style>
