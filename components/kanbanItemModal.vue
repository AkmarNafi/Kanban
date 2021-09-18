<template>
  <div class="kanban-item-modal " style="">
    <!--====== options dropdown======-->
    <div class="kanban-options">
      <b-dropdown aria-role="list" position="is-bottom-left">
        <template #trigger>
          <b-icon
            style="cursor:pointer"
            icon="dots-horizontal"
            class="option-icon"
          >
          </b-icon>
        </template>

        <b-dropdown-item aria-role="listitem" @click="deleteItem"
          >Delete</b-dropdown-item
        >
      </b-dropdown>
    </div>
    <!--====== title input======-->
    <textarea
      v-model="title"
      placeholder="Untitled"
      @keydown.enter.prevent
      ref="titleTextArea"
    ></textarea>

    <!--====== status picker======-->
    <div class="columns m-0 p-0 ">
      <div class="options-label text-secondary">Status</div>
      <div class="options-body">
        <multiselect
          v-if="columnOptions"
          style="width:500px;"
          v-model="columnValue"
          :options="columnOptions"
          :taggable="true"
          @tag="addStatusTag"
          label="name"
          track-by="id"
          :multiple="true"
          :max="1"
          deselectLabel=""
          selectedLabel=""
          selectLabel=""
          tagPlaceholder=""
          placeholder="Empty"
        >
        </multiselect>
      </div>
    </div>

    <hr />
    <!--====== description input======-->
    <div class="desciption-container">
      <div class="placeholder" v-if="!description">
        Type Here
      </div>
      <div
        class="desciption"
        ref="description"
        contenteditable
        @input="event => onDescriptionInput(event)"
      />
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      title: undefined,

      createMode: true,

      description: "",

      columnValue: [],

      id: undefined,

      deleted: false
    };
  },
  computed: {
    ...mapState({
      columnOptions: "kanbanColumns"
    })
  },
  props: {
    item: {
      Type: Object,
      default: undefined
    },
    column: {
      Type: Object,
      default: undefined
    }
  },

  beforeDestroy() {
    if (this.deleted) {
      //item is deleted, do not set updates
      return;
    }

    //validate inputs
    //save changes
    this.$store.dispatch("addOrUpdateKanbanItem", {
      id: this.createMode ? undefined : this.id,
      title: this.title,
      desc: this.description,
      column: this.columnValue[0] ? this.columnValue[0].id : undefined
    });
  },

  mounted() {
    if (this.$props.item === undefined) {
      //if no item then create mode
      this.createMode = true;

      if (this.$props.column && this.$props.column.id) {
        this.columnValue = [this.$props.column];
      }
    } else {
      //if item then edit  mode
      this.createMode = false;

      let currentItem = this.$props.item;

      this.id = currentItem.id;
      this.title = currentItem.title;
      this.description = currentItem.desc;
      this.columnValue = [this.$props.column];
    }

    this.$refs.description.innerText = this.description;
  },
  methods: {
    deleteItem() {
      this.deleted = true;

      if (this.id) {
        this.$store.commit("deleteKanbanItem", this.id);
      }

      this.$emit("close");
    },
    onDescriptionInput(e) {
      this.description = e.target.innerText;
    },

    addStatusTag(x) {
      const tag = {
        name: x,
        id: uuidv4()
      };

      this.columnOptions.push(tag);
      this.columnValue = [tag];
    }
  }
};
</script>

<style scoped lang="scss">
.kanban-item-modal {
  padding: 100px 100px 20px 100px;
  width: 100%;
  position: relative;
  .kanban-options {
    position: absolute;
    top: 20px;
    right: 30px;
  }
}

.desciption-container {
  position: relative;
  .desciption {
    min-height: 300px;
    margin-top: 10px;
    border: none !important;
    background: red;
    padding-top: 20px;
  }
  .desciption:focus {
    outline: none;
    border: none !important;
  }

  .placeholder {
    padding-top: 20px;
    position: absolute;
    color: rgba(0, 0, 0, 0.5);
  }
}
textarea {
  font-size: 40px;
  font-weight: 700;
  border: none !important;
  resize: none;
  color: $primary-text;
  height: 50px;
  overflow: hidden;
  width: 100%;
}
textarea:focus {
  outline: 0;
}

.options-label {
  width: 150px;
  margin-top: 9px;

  font-size: 17px;
}
</style>
