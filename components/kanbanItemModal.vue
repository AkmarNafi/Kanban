<template>
  <div class="createNewItem " style="">
    <textarea
      v-model="title"
      placeholder="Untitled"
      @keydown.enter.prevent
    ></textarea>

    <div class="columns m-0 p-0 ">
      <div class="options-label text-secondary">Column</div>
      <div class="options-body">
        <multiselect
          v-if="columnOptions"
          style="width:500px;"
          v-model="columnValue"
          :options="columnOptions"
          :taggable="true"
          @tag="addTag"
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
    <div
      class="desciption"
      ref="description"
      contenteditable
      @input="event => onInput(event)"
    />
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
      id: undefined
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

    //validate inputs
    this.$store.dispatch("addOrUpdateKanbanItem", {
      id: this.createMode ? undefined : this.id,
      title: this.title,
      desc: this.description,
      column: this.columnValue[0] ? this.columnValue[0].id : undefined
    });
  },

  mounted() {
    if (this.$props.item === undefined) {
      this.createMode = true;

      if (this.$props.column && this.$props.column.id) {
        this.columnValue = [this.$props.column];
      }
    } else {
      this.createMode = false;

      let currentItem = this.$props.item;

      console.log(currentItem);
      this.id = currentItem.id;
      this.title = currentItem.title;
      this.description = currentItem.desc;
      this.columnValue = [this.$props.column];
    }

    this.$refs.description.innerText = this.description;
  },
  methods: {
    onInput(event, index) {
      const value = event.target.innerText;
      this.content[index].value = value;
    },

    // },
    onInput(e) {
      this.description = e.target.innerText;
    },

    addTag(x) {
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
.createNewItem {
  background: blue;
  width: 100%;
}
.desciption {
  margin-top: 10px;
  border: none !important;
}
.desciption:focus {
  outline: none;
  border: none !important;
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
