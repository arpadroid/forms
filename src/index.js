export * from './exports.js';
import * as forms from './exports.js';

export const FieldsByType = {
    array: forms.ArrayField,
    checkbox: forms.CheckboxField,
    checkboxes: forms.CheckboxesField,
    color: forms.ColorField,
    date: forms.DateField,
    dateTime: forms.DateTimeField,
    email: forms.EmailField,
    file: forms.FileField,
    group: forms.GroupField,
    hidden: forms.HiddenField,
    image: forms.ImageField,
    month: forms.MonthField,
    number: forms.NumberField,
    options: forms.OptionsField,
    password: forms.PasswordField,
    radio: forms.RadioField,
    range: forms.RangeField,
    search: forms.SearchField,
    select: forms.SelectField,
    selectCombo: forms.SelectCombo,
    tag: forms.TagField,
    tel: forms.TelField,
    text: forms.TextField,
    textarea: forms.TextAreaField,
    time: forms.TimeField,
    url: forms.UrlField,
    week: forms.WeekField
};
