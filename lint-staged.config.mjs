// Pre-commit lint: run ESLint over only the JS files staged in the commit, so
// lint/style errors are caught before they land in history. Scoping to staged
// files keeps the hook fast on the large tree.
export default {
  '**/*.{js,cjs,mjs}': (stagedFiles) => {
    // Temporarily skip the src/view/react tree — it still has ESLint errors
    // tracked in RDFORMS-175, which removes this carve-out once fixed. The
    // exclusion lives only here; eslint.config.mjs still lints React so
    // `pnpm lint` and RDFORMS-175 continue to see those errors.
    const filesToLint = stagedFiles.filter(
      (file) => !file.includes('/src/view/react/')
    );
    if (filesToLint.length === 0) {
      return [];
    }
    const quotedFiles = filesToLint.map((file) => `"${file}"`).join(' ');
    // --fix auto-applies fixable issues (incl. prettier formatting) and
    // lint-staged re-stages them; genuine errors still block the commit.
    // --no-warn-ignored silences the "File ignored" notice for any
    // config-ignored file (samples/html/config/tests) that happens to be staged.
    return [`eslint --fix --no-warn-ignored ${quotedFiles}`];
  },
};
