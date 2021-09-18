<template>
  <div class="kanban-item" v-if="itemData">
    <b-dropdown
      aria-role="list"
      position="is-bottom-left"
      class="kanban-item-options"
    >
      <template #trigger class="">
        <b-icon
          style="cursor:pointer"
          icon="dots-horizontal"
          size="is-small"
          class="option-icon"
        >
        </b-icon>
      </template>

      <b-dropdown-item aria-role="listitem" @click="deleteItem"
        >Delete</b-dropdown-item
      >
    </b-dropdown>
    <div @click="open">
      <h3 class="kanban-item-title" v-if="itemData.title">
        {{ itemData.title }}
      </h3>
      <h3 class="kanban-item-title " v-else style="color:rgba(0,0,0,0.3)">
        Untitled
      </h3>

      <div class="kanban-item-body">
        {{ itemData.desc }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemData: undefined
    };
  },

  methods: {
    deleteItem() {
      this.$store.commit("deleteKanbanItem", this.itemData.id);
    },
    open() {
      this.$emit("open");
    }
  },

  mounted() {
    this.itemData = this.$props.data
      ? this.$props.data
      : {
          title: "",
          desc: ""
        };
  },
  props: {
    data: {
      Type: Object,
      default: undefined
    }
  }
};
</script>

<style scoped lang="scss">
.kanban-item:active {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}

.kanban-item:hover {
  background: #f9f9f8;

  .kanban-item-options {
    visibility: visible;
  }
}

.kanban-item {
  position: relative;
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
  .kanban-item-options {
    position: absolute;
    top: 10px;
    right: 10px;
    visibility: hidden;
  }

  .option-icon {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    padding: 10px;
    color: rgba(0, 0, 0, 0.4);
  }

  .option-icon:hover {
    background: $primary-bg;
  }
}
</style>
