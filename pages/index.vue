<template>
  <div class="body">
    <h1 class="mt-6">💪 Tasks</h1>

    <div class="kanban">
      <div class="columns m-0 p-0">
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
              v-for="item in kanbanRenderList[col.id]"
              :key="item.id"
              class="kanban-item drag-el"
              draggable
              @dragstart="startDrag($event, item, col.id)"
              @dragend="endDrag"
            >
              <h3 class="kanban-item-title">{{ item.title }}</h3>

              <div class="kanban-item-body">
                {{ item.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "~/components/Card";

export default {
  name: "HomePage",
  data() {
    return {
      dragging: false,
      kanbanColumns: [
        { id: "NOT_STARTED", name: "Not Started" },
        { id: "STARTED", name: "Started" },
        { id: "COMPLETED", name: "Completed" }
      ],

      kanbanItems: [
        {
          status: "NOT_STARTED",
          id: 1,
          title: "hello world ",
          desc: "lorem ipsume"
        },

        {
          status: "STARTED",
          id: 2323,
          title: "hello world ",
          desc: "lorem ipsume"
        },

        {
          status: "COMPLETED",
          id: 23255,
          title: "hello world ",
          desc: "lorem ipsume"
        }
      ]
    };
  },
  methods: {
    startDrag(evt, item, colID) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("itemID", item.id);
      evt.dataTransfer.setData("fromColumn", colID);

      this.dragging = true;
    },
    endDrag() {
      this.dragging = false;
    },
    onDrop(evt, toColumnID) {
      const itemID = evt.dataTransfer.getData("itemID");
      const fromColumn = evt.dataTransfer.getData("fromColumn");

      console.log(itemID, fromColumn);
      const item = this.kanbanItems.find(item => item.id == itemID);

      item.status = toColumnID;

      // item.list = list;
    }
  },
  components: {
    Card
  },
  computed: {
    kanbanRenderList() {
      let renderList = {};

      for (let i = 0; i < this.kanbanColumns.length; i++) {
        let currentColumn = this.kanbanColumns[i];
        renderList[currentColumn.id] = this.kanbanItems.filter(item => {
          return item.status == currentColumn.id;
        });
      }
      return renderList;
    }
  }
};
</script>

<style scoped lang="scss">
.body {
  // padding:100px 0 0 100px;;
}

.drop-zone {
}

.drag-el {
}

.kanban {
  border-top: 1px solid rgb(223, 223, 222);
  padding-top: 20px;
  margin-top: 20px;
  .kanban-col {
    margin-right: 20px;
    width: 360px;

    // border: 1px solid blue;

    min-height: 500px;
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
