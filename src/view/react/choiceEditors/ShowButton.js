/* eslint-disable no-unused-vars,max-len */
import React, { useMemo } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';

function SearchAndCreateIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        fill="currentColor"
        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      />
      <path
        fill="currentColor"
        d="M 24,6 H 21 V 9 H 19 V 6 H 16 V 4 h 3 V 1 h 2 v 3 h 3 z"
      />
    </SvgIcon>
  );
}
// Original construction for the plus:
// m 24,6 h -3 v 3 h -2 v -3 h -3 v -2 h 3 v -3 h 2 v 3 h 3 v 2 Z
// Result from inkscape:
// M 24,6 H 21 V 9 H 19 V 6 H 16 V 4 h 3 V 1 h 2 v 3 h 3 z

export default (props) => {
  const inlineCreate = useMemo(
    () =>
      props.context.chooser &&
      props.context.chooser.supportsInlineCreate &&
      props.context.chooser.supportsInlineCreate(props.binding)
  );
  const title = inlineCreate
    ? props.context.view.messages.edit_browse_create
    : props.context.view.messages.edit_browse;
  if (props.context.chooser.show) {
    return (
      <IconButton
        disabled={props.disabled}
        aria-label={title}
        title={title}
        onClick={props.onClick}
      >
        {inlineCreate ? <SearchAndCreateIcon /> : <SearchIcon />}
      </IconButton>
    );
  }
  return '';
};
