// In ESM mode Jest no longer injects the `jest` object as a global; expose it so specs can keep using it.
globalThis.jest = import.meta.jest;
