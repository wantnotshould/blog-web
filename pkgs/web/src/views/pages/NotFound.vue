<script setup lang="ts"></script>

<template>
  <div class="container">
    <div class="terminal">
      <p class="error">cat: read failed</p>
      <p class="hint">No matching entry found.</p>

      <p class="hint">Try: <a href="/ls">ls</a></p>
    </div>
  </div>
</template>

<style scoped lang="scss">
:global(:root) {
  --cdme-404-error: #cf222e;
}

:global([data-theme='dark']) {
  --cdme-404-error: #da3633;
}

.container {
  width: 100%;
  font-size: 1.6rem;

  .terminal {
    position: relative;
    color: var(--cdme-text);
    padding: 1rem;
    border-radius: var(--cdme-radius);
    border: 1px solid var(--cdme-border);

    .error {
      color: var(--cdme-404-error);
      margin: 0.5rem 0;
    }

    .hint a {
      color: var(--cdme-a);
      text-decoration: underline;
    }

    .hint a:hover {
      color: var(--cdme-accent);
    }
  }
}
</style>
