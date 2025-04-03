import type { Backend, ProjectScanInfo } from "~~/shared";

export const backend: Ref<Backend | null> = ref(null);

export const projectInfo: Ref<ProjectScanInfo> = ref({
  allFiles: new Set(),
  fileDependencies: new Map(),
  usedFiles: new Set(),
  unusedFiles: new Set(),
});

export async function loadUnusedFiles() {
  const result = await backend.value!.functions.scan();
  projectInfo.value = result;
}
