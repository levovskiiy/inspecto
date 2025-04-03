<template>
  <div class="flex flex-col gap-4">
    <h1>Список неиспользуемых файлов</h1>
    <input
      v-model="searchText"
      type="text"
      class="input w-full"
      placeholder="Поиск по имени файла"
    />
    <div
      class="rounded-box border-base-content/3 bg-base-100 overflow-auto border h-[calc(100vh-130px)]"
    >
      <table class="table">
        <thead>
          <tr>
            <th class="w-40">Наименование файла</th>
            <th>Полный путь до файла</th>
            <th>Расширение файла</th>
            <th>Размер файла</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(it, id) in filteredFiles"
            :key="id"
            class="hover:bg-base-300 transition"
          >
            <td class="w-40">{{ it }}</td>
            <td>item</td>
            <td>item</td>
            <td>item</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { projectInfo } from "~/store/backend";
import { useDebouncedRef } from "~/composables/useDebounceRef";

const searchText = useDebouncedRef("", 300);

const unusedFiles = computed(() => Array.from(projectInfo.value.unusedFiles));

const filteredFiles = computed(() => {
  const search = searchText.value.toLocaleLowerCase();
  return unusedFiles.value.filter((file) =>
    file.toLocaleLowerCase().includes(search)
  );
});
</script>
