import IconButton from '@mui/material/IconButton';

/**
 * Icon buttons for the actions an application put on the current choice, see
 * the chooserRegistry documentation in renderingContext.
 *
 * @param {object} props
 * @param {object[]} [props.actions]
 * @param {import('../../../model/Binding').default} props.binding
 * @param {object} props.field
 * @param {boolean} props.readOnly true when the field is disabled by a named graph
 * @returns {import('react').ReactElement[]}
 */
const ChoiceActions = ({ actions = [], binding, field, readOnly }) =>
  actions.map((action, index) => (
    <IconButton
      key={action.id ?? index}
      aria-label={action.label}
      title={action.label}
      disabled={readOnly && !action.enabledWhenReadOnly}
      onClick={() => action.onClick(binding, field)}
    >
      {action.icon}
    </IconButton>
  ));

export default ChoiceActions;
