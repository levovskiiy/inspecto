<script lang="ts" setup>
import { createBackend } from "~/backend";
import { backend, loadUnusedFiles } from "~/store/backend";

const router = useRouter();

createBackend()
  .then((back) => {
    back.connect();
    backend.value = back;
    return back;
  })
  .then(async () => {
    await loadUnusedFiles();
    router.replace("/list");
  });
</script>
