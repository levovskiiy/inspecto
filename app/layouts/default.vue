<script lang="ts" setup>
const routes = [
  {
    to: "/list",
    icon: "list",
    title: "Список неиспользуемых файлов",
  },
  {
    to: "/graph",
    icon: "graph",
    title: "Граф зависимостей",
  },
];

const route = useRoute();
</script>

<template>
  <div
    class="bg-base-200 grid min-h-screen grid-cols-[minmax(300px,min-content)_1fr]"
  >
    <div class="border-base-100 flex flex-col items-center border-r">
      <header class="p-4">
        <p>Inspecto</p>
      </header>
      <main class="mt-8 flex w-full flex-col">
        <RouterLink
          v-for="it in routes"
          :key="it.to"
          role="button"
          :to="it.to"
          class="btn btn-ghost btn-block justify-start rounded-none"
          :class="{
            'btn-active': route.path === it.to,
          }"
        >
          {{ it.title }}
        </RouterLink>
      </main>
    </div>
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
