<template>
  <div>
    <section class="main-content columns m-0 p-0">
      <div class="sidebar">
        <p class="menu-label is-hidden-touch">
          Pages
        </p>

        <ul class="menu-list">
          <li class="active">
            💪 Tasks
          </li>
        </ul>
      </div>

      <div class="">
        <Nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: []
    };
  },

  methods: {
    addpage() {
      let newPage = {
        id: uuidv4(),
        name: undefined
      };
    }
  },
  async mounted() {
    const loadingComponent = this.$buefy.loading.open();

    await this.$store.dispatch("loadFromLocalStorage");

    loadingComponent.close();
  }
};
</script>

<style scoped lang="scss">
.sidebar {
  background: $secondary-bg;
  height: 100vh;
  min-width: 250px !important;
  width: 250px !important;
  padding: 20px 0;

  .menu-label {
    padding: 0 20px;
  }

  .menu-list {
    li {
      font-size: 16px;
      padding: 5px 20px;
      font-weight: 500;
      color: $primary-text;
    }

    .active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
