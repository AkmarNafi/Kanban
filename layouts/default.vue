<template>
  <div>
    <section class="main-content columns">
      <aside class="column is-2 section sidebar">
        <p class="menu-label is-hidden-touch">
          General
        </p>
        <ul class="menu-list">
          <!-- <li v-for="(item, key) of items" :key="key">
            <NuxtLink :to="item.to" exact-active-class="is-active">
              <b-icon :icon="item.icon" /> {{ item.title }}
            </NuxtLink>
          </li> -->
        </ul>
      </aside>

      <div class="container column is-10">
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
  }
};
</script>

<style scoped lang="scss">
aside.sidebar {
  background: $secondary-bg;
  height: 100vh;
}
</style>
