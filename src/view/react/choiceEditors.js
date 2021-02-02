/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';
import BuildIcon from '@material-ui/icons/Build';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import RadioButtonsEditor from './RadioButtonsEditor';
import renderingContext from '../renderingContext';
import { useLocalizedSortedChoices, useLocalizedChoice, loadLocalizedChoice, localizedChoice } from './hooks';
import utils from '../../utils';

function SearchAndCreateIcon(props) {
  return (
    <SvgIcon {...props}>
      <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      <path fill="currentColor" d="M 24,6 H 21 V 9 H 19 V 6 H 16 V 4 h 3 V 1 h 2 v 3 h 3 z" />
    </SvgIcon>
  );
}
// Original construction for the plus:
// m 24,6 h -3 v 3 h -2 v -3 h -3 v -2 h 3 v -3 h 2 v 3 h 3 v 2 Z
// Result from inkscape:
// M 24,6 H 21 V 9 H 19 V 6 H 16 V 4 h 3 V 1 h 2 v 3 h 3 z

/**
 * Checks if the current item can be rendered as radiobuttons.
 * @param {rdforms/item}
 * @returns {boolean}
 */
const radioCheck = (item) => {
  const choices = item.getChoices();
  const hierarchy = item.getHierarchyProperty() || item.hasStyle('tree');
  return !hierarchy && item.getCardinality().max === 1
    && (!item.hasStyle('dropDown')
      && ((choices != null && choices.length < 5) || item.hasStyle('verticalRadioButtons')
        || item.hasStyle('horizontalRadioButtons')));
};


/**
 * Autocomplete with fixed choices.
 *
 * @param props Component props
 * @param {Binding} props.binding the binding for which to render an autocomplete
 * @example (<ChoiceSelector binding={binding}>)
 * @return {React.FunctionComponentElement}
 */
const ChoiceSelector = (props) => {
  const binding = props.binding;
  const choices = useLocalizedSortedChoices(binding);
  const [value, setValue] = useLocalizedChoice(binding, choices);
  useEffect(() => {
    props.context.clear = () => setValue(null);
  }, []);

  const labelledBy = props.context.view.getLabelIndex(binding);

  const renderInput = (params) => {
    params.inputProps = params.inputProps || {};
    params.inputProps['aria-labelledby'] = labelledBy;
    return (<TextField {...params} {...(value && value.mismatch ? { error: true } : {})}
                       variant={renderingContext.materialVariant}/>);
  };

  return <Autocomplete
    className="rdformsSearch"
    disableClearable={true}
    value={value}
    options={choices}
    onChange={ (event, newChoice) => { binding.setChoice(newChoice.original); setValue(newChoice); }}
    getOptionSelected={ (option, choice) => option.value === choice.value }
    getOptionLabel={ choice => (choice === null ? '' : choice.label) }
    getOptionDisabled={ option => option.mismatch === true}
    filterSelectedOptions
    renderInput={renderInput}
  />;
};

const ShowButton = (props) => {
  const inlineCreate = useMemo(() => (props.context.chooser && props.context.chooser.supportsInlineCreate &&
    props.context.chooser.supportsInlineCreate(props.binding)));
  const title = inlineCreate ? props.context.view.messages.edit_browse_create :
    props.context.view.messages.edit_browse;
  if (props.context.chooser.show) {
    return <IconButton
      aria-label={title}
      title={title}
      onClick={props.onClick}
    >{inlineCreate ? (<SearchAndCreateIcon/>) : (<SearchIcon/>)}</IconButton>;
  }
  return '';
};

const ChoiceLookup = (props) => {
  const [choice, setChoice] = useState(props.binding.getChoice());
  useEffect(() => {
    props.context.clear = () => setChoice(null);
  }, []);
  let title = '';
  let label = '';
  if (choice) {
    title = choice.description ? utils.getLocalizedValue(choice.description).value : choice.seeAlso || choice.value;
    label = choice.label ? utils.getLocalizedValue(choice.label).value : choice.value;
  }

  const labelledBy = context.view.getLabelIndex(binding);

  return <><TextField
    inputProps={{ 'aria-labelledby': labelledBy }}
    className="rdformsSearch"
    disabled {...(choice && choice.mismatch ? { mismatch: true } : {})}
    title={title}
    value={label}
    variant={renderingContext.materialVariant}
  /><ShowButton
    {... props}
    onClick={() => renderingContext.openChoiceSelector(props.binding, (newChoice) => {
      props.binding.setChoice(newChoice);
      setChoice(newChoice);
    }, props.field)}/></>;
};

let globalChoiceQueryThrottle;

const ChoiceLookupAndInlineSearch = (props) => {
  const binding = props.binding;
  const [options, setOptions] = useState([]);
  const [value, setValue] = loadLocalizedChoice(binding, options);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    props.context.clear = () => setValue(null);
  }, []);

  const onChange = (event, newChoice) => {
    if (newChoice === null) {
      binding.setChoice(null);
      setValue(null);
    } else {
      binding.setChoice(newChoice.original);
      setValue(newChoice);
    }
  };

  useEffect(() => {
    let active = true;
    if (open) {
      if (globalChoiceQueryThrottle) {
        clearTimeout(globalChoiceQueryThrottle);
      }
      globalChoiceQueryThrottle = setTimeout(() => {
        globalChoiceQueryThrottle = undefined;
        props.context.chooser.search(binding.getItem(), inputValue).then((results) => {
          if (active) {
            setOptions(results.map(localizedChoice));
          }
        });
      }, 200);
    }

    return () => {
      active = false;
    };
  }, [inputValue, open]);

  const labelledBy = props.context.view.getLabelIndex(binding);
  const renderInput = (params) => {
    params.inputProps = params.inputProps || {};
    params.inputProps['aria-labelledby'] = labelledBy;
    return <TextField aria-labelledby={labelledBy}
               {...params} { ...(value && value.mismatch ? { error: true } : {}) }
               variant={renderingContext.materialVariant} />;
  };

  return <><Autocomplete
    className="rdformsSearch"
    disableClearable={true}
    fullWidth={false}
    value={value}
    options={options}
    filterOptions={fopts => fopts}
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
    onChange={onChange}
    getOptionSelected={ (option, choice) => option.value === choice.value }
    getOptionLabel={ choice => (choice === null ? '' : choice.label || choice.value) }
    getOptionDisabled={ option => option.mismatch === true}
    renderInput={renderInput}
  /><ShowButton
    {...props}
    onClick={() => renderingContext.openChoiceSelector(props.binding,
      (choice) => { binding.setChoice(choice); setValue(localizedChoice(choice)); }, props.field)}
  />{value && value.original.upgrade && (
    <IconButton
      aria-label={props.context.view.messages.edit_upgrade}
      title={props.context.view.messages.edit_upgrade}
      onClick={() => value.original.upgrade(props.binding,
        choice => setValue(localizedChoice(choice)))}
    ><BuildIcon/></IconButton>
  )}</>;
};

const editors = renderingContext.editorRegistry;
editors.itemtype('choice').choices().check(radioCheck).register((fieldDiv, binding, context) => {
  // eslint-disable-next-line no-new
  fieldDiv.appendChild(<RadioButtonsEditor key={binding.getHash()} binding={binding} context={context}/>);
});

editors.itemtype('choice').choices().register((fieldDiv, binding, context) => {
  fieldDiv.appendChild(<ChoiceSelector key={binding.getHash()} binding={binding} context={context}/>);
});

editors.itemtype('choice').choices('none').register((fieldDiv, binding, context) => {
  context.chooser = renderingContext.chooserRegistry.getComponent(binding.getItem());
  if (typeof context.chooser.search === 'function') {
    fieldDiv.appendChild(<ChoiceLookupAndInlineSearch key={binding.getHash()} binding={binding} context={context}
                                                      field={fieldDiv}/>);
  } else {
    fieldDiv.appendChild(<ChoiceLookup key={binding.getHash()} binding={binding} context={context} field={fieldDiv}/>);
  }
});
