template-helper-libs
=======================

A collection of helpers for templates.


Usage
---------------------

###op

```
{{op left operator right hash=value}}
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

for a full list of operators, read the source

###uop

```
{{uop operator operand}}
```

or shorthand:

```
{{<operator> operand}}
```

operators are `truthy`, `falsey`, `empty`, `notEmpty`.

###filesizeFormat

Formats bytes as human readable amount.

###capitalize

Converts the first character to uppercase


###placeholder

Puts a placeholder span if the current value is falsey

```handlebars
{{placeholder myHelper 'PlaceholderText'}}
```


## Date/Time Helpers

If the package `momentjs:moment` is available, the following helpers can be used:

 * `HelperLib.SHORT_DATE_FORMAT` - set to your preferred date format, defaults to `'DD/MM/YYYY'`

 * `HelperLib.LONG_DATE_FORMAT` - likewise , defaults to: `'DD/MM/YYYY h:mm A'`

### dateFormatCalendar(date, placeholder)

### dateFormatShort(date, placeholder)

### dateFormatLong(date, placeholder)


### timestampRange(date, rangeType)

configure `HelperLib.timestampRanges.(rangeType)` with your rules

Will return the corresponding rule where `$gt < (now - date) < $lte` is true

eg.

```js
HelperLib.timestampRanges.myranges = [
  /*0*/ {props: {title: "More than 3 days left", style: 'color:auto;'}, $lte: Infinity, $gt: (86400 * 3)},
  /*1*/ {props: {title: "Less than 3 days left", style: 'color:#d58512;'}, $lte: (86400 * 3), $gt: 0},
  /*2*/ {props: {title: "Overdue", style: 'color:#d9534f;'}, $lte: 0, $gt: -Infinity}
]

console.log(HelperLib.timestampRange(new Date() - (86400 * 2), 'myranges'))
// returns element 1
```

