/**
 * Autocomplete hands `renderInput` the HTML input's props as `inputProps`
 * (MUI 7) or as `slotProps.htmlInput` (MUI 9), and TextField only accepts
 * the latter from MUI 9 on. Folds both into `slotProps.htmlInput` together
 * with the label reference, so the result works on either version.
 *
 * @param {object} params - The `renderInput` params from Autocomplete
 * @param {string} labelledBy - Id of the element labelling the input
 * @returns {object} Props to spread on the TextField
 */
const labelledInputParams = (params, labelledBy) => {
  const { inputProps, slotProps, ...rest } = params;
  return {
    ...rest,
    slotProps: {
      ...slotProps,
      htmlInput: {
        ...inputProps,
        ...slotProps?.htmlInput,
        'aria-labelledby': labelledBy,
      },
    },
  };
};

export default labelledInputParams;
