<template>
  <div>
    <section class="main-content columns m-0 p-0">
      <div class="sidebar">
        <p class="menu-label is-hidden-touch"></p>
        <ul class="menu-list">
          <!-- <li v-for="(item, key) of items" :key="key">
            <NuxtLink :to="item.to" exact-active-class="is-active">
              <b-icon :icon="item.icon" /> {{ item.title }}
            </NuxtLink>
          </li> -->
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
}
</style>
