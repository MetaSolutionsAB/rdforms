import { fromDuration, toDuration, getNamedGraphId } from '../viewUtils';

let counter = 0;
export default (fieldDiv, binding, context) => {
  const bundle = context.view.messages;
  let data = fromDuration(binding.getValue());

  const wrapper = jquery('<div>')
    .addClass('rdformsDuration rdformsFieldInput')
    .appendTo(fieldDiv);
  const disabledAttr = getNamedGraphId(binding, context) ? 'disabled' : '';
  const render = () => {
    wrapper.empty();
    ['years', 'months', 'days', 'hours', 'minutes'].forEach((key) => {
      const div = jquery('<div>').appendTo(wrapper);
      const group = jquery('<div>').addClass('input-group').appendTo(div);
      const id = `duration_${counter}`;
      counter += 1;
      jquery('<span>')
        .addClass('input-group-addon')
        .attr('id', id)
        .text(bundle[`duration_${key}`])
        .appendTo(group);
      const inp = jquery(`<input ${disabledAttr}>`)
        .addClass('form-control')
        .attr('type', 'number')
        .attr('aria-describedby', id)
        .appendTo(group);
      if (data[key]) {
        inp.val(data[key]);
      }
      inp.change(function () {
        data[key] = jquery(this).val();
        binding.setValue(toDuration(data));
      });
    });
  };
  render();

  context.clear = () => {
    data = {};
    render();
  };
};
