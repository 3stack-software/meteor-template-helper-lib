template-helper-libs
=======================

A collection of helpers for templates.


Usage
---------------------

### op (binary / two argument)
```handlebars
{{! Use to return kwargs/hash values for properties, or a #with block}}
<div {{op left operator right prop=value}} />

{{#with op left operator right a=1 b=2}}
  {{a}} + {{a}} = {{b}}
{{/with}}

{{! OR, in a conditional}}
{{#if op left operator right}}
  eval true
{{else}}
  eval false
{{/if}}
```

Evaluates left & right with operator, returning all keyword arguments.

eg. to mark an item selected

```handlebars
<select>
{{#each items}}
<option {{op selectedItemId 'eq' _id selected=true}}>{{value}}</option>
{{/each}}
```

or, to mark a radio checked:

```handlebars
<input type="radio" {{op selectedRadio 'eq' _id checked=true}} />
```

Operators available

 * `eq` - equals
 * `ne`, `neq` - not equals
 * `gt` - greater than
 * `gte` - greater than, or equal
 * `lt` - less than
 * `lte` - less than, or equal
 * `or` - `left || right`
 * `and` - `left && right`
 * `ejson` - `EJSON.equals(left, right)`
 * `nejson` - `!EJSON.equals(left, right)`
 * `in` - `right.indexOf(left) !== -1`
 * `nin` - `right.indexOf(left) === -1`


### uop (unary / single argument)

```handlebars
{{uop operator operand}}
```

or shorthand:

```handlebars
{{<operator> operand}}
```

operators are:

 * `truthy` - `if(value)`
 * `falsey` - `if(!value)`
 * `empty`  - `if(value == null)`
 * `notEmpty` - `if (value != null)`

### filesizeFormat

Formats bytes as human readable amount.

### capitalize

Converts the first character to uppercase


### placeholder

Puts a placeholder span if the current value is falsey

```handlebars
{{placeholder myHelper 'PlaceholderText'}}
```


## Date/Time Helpers

If the package `momentjs:moment` is available, the following helpers can be used:

### Date formatting

 * `HelperLib.DATE_FORMATS[NAME]` - insert new date formats by name, defaults for `LONG` and `SHORT`

 * `dateFormatCalendar(date, placeholder)` - performs `moment.calendar()`

 * `dateFormat(NAME, date, placeholder)` - looks up the date format name in `DATE_FORMATS`

 * `dateFormatShort(date, placeholder)` - formats as per `DATE_FORMATS.SHORT` - defaults to `'DD/MM/YYYY'`

 * `dateFormatLong(date, placeholder)` - formats as per `DATE_FORMATS.LONG` - defaults to `'DD/MM/YYYY h:mm A'`


### Temporal Highlighting

Need to highlight an element based on it's age? use-

`timestampRange(date, rangeType)`

configure `HelperLib.timestampRanges[rangeType]` with your rules

Will return the corresponding rule where `$between[0] < (now - date) < $between[1]` is true

eg.

```js
HelperLib.timestampRanges.myranges = [
  /* 0 */ {props: {title: "More than 3 days left", style: 'color:auto;'}, $between: [(86400 * 3), Infinity]},
  /* 1 */ {props: {title: "Less than 3 days left", style: 'color:#d58512;'}, $between: [0, (86400 * 3)]},
  /* 2 */ {props: {title: "Overdue", style: 'color:#d9534f;'}, $between: [-Infinity, 0] }
]

// finds the entry in 'myranges' where (2 days) is within `$between`
// result  /*1*/ {props: {title: "Less than 3 days left", style: 'color:#d58512;'}, $between: [0, (86400 * 3)]},
console.log(HelperLib.timestampRange(new Date() - (86400 * 2), 'myranges'))
```

