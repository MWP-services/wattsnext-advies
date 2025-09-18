// Global polyfills used before the app boots

// Some dependencies (e.g. Firebase on Hermes) try to call a global `Compare`
// helper. Hermes does not expose this function, so provide a minimal
// implementation that mirrors the behaviour of `Intl.Collator#compare`.
if (typeof global.Compare !== 'function') {
  try {
    const collator = typeof Intl !== 'undefined' && typeof Intl.Collator === 'function'
      ? new Intl.Collator()
      : null;
    if (collator && typeof collator.compare === 'function') {
      global.Compare = collator.compare.bind(collator);
    } else {
      global.Compare = (a, b) => {
        if (a === b) return 0;
        // Handle numeric comparisons first to preserve ordering.
        if (typeof a === 'number' && typeof b === 'number') {
          return a < b ? -1 : 1;
        }
        const valueA = String(a);
        const valueB = String(b);
        if (valueA === valueB) return 0;
        return valueA < valueB ? -1 : 1;
      };
    }
  } catch (error) {
    global.Compare = (a, b) => {
      if (a === b) return 0;
      if (typeof a === 'number' && typeof b === 'number') {
        return a < b ? -1 : 1;
      }
      const valueA = String(a);
      const valueB = String(b);
      if (valueA === valueB) return 0;
      return valueA < valueB ? -1 : 1;
    };
  }
}
