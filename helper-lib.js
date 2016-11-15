"use strict";

HelperLib = {
  "op": function(leftOperand, operator, rightOperand, kwargs){
    var result;
    switch (operator){
      case 'eq':
        result = leftOperand === rightOperand;
        break;
      case 'ne':
      case 'neq':
        result = leftOperand !== rightOperand;
        break;
      case 'gt':
        result = leftOperand > rightOperand;
        break;
      case 'gte':
        result = leftOperand >= rightOperand;
        break;
      case 'lt':
        result = leftOperand < rightOperand;
        break;
      case 'lte':
        result = leftOperand <= rightOperand;
        break;
      case 'or':
        result = leftOperand || rightOperand;
        break;
      case 'and':
        result = leftOperand && rightOperand;
        break;
      case 'ejson':
        result = EJSON.equals(leftOperand, rightOperand);
        break;
      case 'nejson':
        result = !EJSON.equals(leftOperand, rightOperand);
        break;
      case 'in':
        result = _.indexOf(rightOperand, leftOperand) !== -1;
        break;
      case 'nin':
        result = _.indexOf(rightOperand, leftOperand) === -1;
        break;
      default:
        throw new Error('Unhandled operation ' + operator);
        break;
    }
    if (result){
      return kwargs.hash;
    } else {
      return null;
    }
  },
  "uop": function(operator, operand, kwargs){
    var result;
    switch (operator){
      case 'truthy':
        result = !!operand;
        break;
      case 'falsey':
        result = !operand;
        break;
      case 'empty':
        result = operand == null;
        break;
      case 'notEmpty':
        result = operand != null;
        break;
      default:
        throw new Error('Unhandled operation ' + operator);
        break;
    }
    if (result){
      return kwargs.hash;
    } else {
      return null;
    }
  },
  "truthy": function(operand, kwargs){
    if (!!operand){
      return kwargs.hash;
    } else {
      return null;
    }
  },
  "falsey": function(operand, kwargs){
    if (!operand){
      return kwargs.hash;
    } else {
      return null;
    }
  },
  "empty": function(operand, kwargs){
    if (operand == null){
      return kwargs.hash;
    } else {
      return null;
    }
  },
  "notEmpty": function(operand, kwargs){
    if (operand != null){
      return kwargs.hash;
    } else {
      return null;
    }
  },
  "fileSizeFormat": function (fileSizeInBytes) {
    var sizeNameIndex, sizeNames;
    sizeNames = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    sizeNameIndex = Math.floor(Math.log(fileSizeInBytes) / Math.log(1024));
    return Math.round((fileSizeInBytes / Math.pow(1024, Math.floor(sizeNameIndex))) * 100) / 100 + " " + sizeNames[sizeNameIndex];
  },
  "capitalize": function (text) {
    if (!((text != null) && text.length > 0)) {
      return text;
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  "placeholder": function (text, placeholder, kwargs) {
    if (!text) {
      if (kwargs.hash.html){
        return new Spacebars.SafeString("<span class=\"placeholder\">" + (_.escape(placeholder)) + "</span>");
      } else {
        return placeholder;
      }
    } else {
      return text;
    }
  }
};

var moment;

function makeMoment(ts) {
  if ((ts == null) || ts === '') {
    return;
  }
  return moment(ts);
}

if (Package['momentjs:moment'] != null) {
  moment = Package['momentjs:moment'].moment;

  _.extend(HelperLib, {
    DATE_FORMATS: {
      LONG: 'DD/MM/YYYY h:mm A',
      SHORT: 'DD/MM/YYYY',
      TIME: 'h:mm A'
    },

    "dateFormatCalendar": function (ts, placeholder) {
      var momentTs = makeMoment(ts);
      if (placeholder == null) {
        placeholder = '';
      }
      if (momentTs == null) {
        return placeholder;
      }
      return momentTs.calendar(null, {
        sameElse: HelperLib.DATE_FORMATS.SHORT
      });
    },
    "dateFormat": function(fmt, ts, placeholder){
      if (HelperLib.DATE_FORMATS[fmt] == null){
        throw new Error('Unknown date format ' + fmt);
      }
      var momentTs = makeMoment(ts);
      if (placeholder == null) {
        placeholder = '';
      }
      if (momentTs == null) {
        return placeholder;
      }
      return momentTs.format(HelperLib.DATE_FORMATS[fmt]);
    },
    "dateFormatShort": function (ts, placeholder) {
      return HelperLib.dateFormat('SHORT', ts, placeholder);
    },
    "dateFormatLong": function (ts, placeholder) {
      return HelperLib.dateFormat('LONG', ts, placeholder);
    },
    "dateFormatTime": function(ts, placeholder){
      return HelperLib.dateFormat('TIME', ts, placeholder);
    },
    "timestampRanges": {
      "default": [
        {props: {title: "More than 3 days left", style: 'color:auto;'}, $between: [(86400 * 3), Infinity]},
        {props: {title: "Less than 3 days left", style: 'color:#d58512;'}, $between: [0, (86400 * 3)]},
        {props: {title: "Overdue", style: 'color:#d9534f;'}, $between: [-Infinity, 0] }
      ]
    },
    "timestampRange": function (ts, rangeType) {
      var momentTs = makeMoment(ts), delta;
      if (rangeType == null) {
        rangeType = "default";
      }
      if (momentTs == null) {
        return null;
      }
      delta = momentTs.diff(moment(), 'seconds');

      return _.find(HelperLib.timestampRanges[rangeType], function (r) {
        var $between = r.$between, $gt = $between[0], $lte = $between[1];
        return $gt < delta && delta <= $lte;
      });
    }
  });

  _.each({
    "dateFormatCalendar": "formatTimestampCalendar",
    "dateFormatShort": "formatTimestampDate",
    "dateFormatLong": "formatTimestampDateTime"
  }, function(oldName, newName){
    HelperLib[oldName] = function(ts, placeholder){
      Log.warn("Warning: HelperLib." + oldName + " is deprecated, please use " + newName + "instead");
      return HelperLib[newName](ts, placeholder);
    }
  })
}

if (Meteor.isClient) {
  _.each(HelperLib, function (fn, name) {
    Template.registerHelper(name, fn);
  });
}
