<script lang="ts">
  export let num: number;
  export let id: string;
</script>

<input {id} bind:value={num} on:change type="number" />
