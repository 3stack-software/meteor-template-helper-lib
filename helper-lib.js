"use strict";

HelperLib = {
  "or": function (value, instead) {
    return value != null ? value : instead;
  },
  "loggedIn": function () {
    return Meteor.userId() != null;
  },
  "prop": function (obj, k) {
    return obj[k];
  },
  "propOr": function (obj, k, instead) {
    if ((obj != null) && k in obj && (obj[k] != null)) {
      return obj[k];
    } else {
      return instead;
    }
  },
  "arrayJoin": function (array, glue) {
    return array != null ? array.join(glue) : void 0;
  },
  "arrayGtLen": function (array, size) {
    return (array != null ? array.length : void 0) > size;
  },
  "arrayGteLen": function (array, size) {
    return (array != null ? array.length : void 0) >= size;
  },
  "arrayLtLen": function (array, size) {
    return (array != null ? array.length : void 0) < size;
  },
  "arrayLteLen": function (array, size) {
    return (array != null ? array.length : void 0) <= size;
  },
  "arrayEqLen": function (array, size) {
    return (array != null ? array.length : void 0) === size;
  },
  "eq": function (a, b) {
    return a === b;
  },
  "checked": function (x) {
    if (x) {
      return {
        checked: true
      };
    } else {
      return {};
    }
  },
  "notChecked": function (x) {
    if (x) {
      return {};
    } else {
      return {
        checked: true
      };
    }
  },
  "disabled": function (x) {
    if (x) {
      return {
        disabled: true
      };
    } else {
      return {};
    }
  },
  "notDisabled": function (x) {
    if (x) {
      return {};
    } else {
      return {
        disabled: true
      };
    }
  },
  "disabledClass": function (x) {
    if (x) {
      return ' disabled';
    } else {
      return '';
    }
  },
  "notDisabledClass": function (x) {
    if (x) {
      return '';
    } else {
      return ' disabled';
    }
  },
  "activeClass": function (x) {
    if (x) {
      return ' active';
    } else {
      return '';
    }
  },
  "notActiveClass": function (x) {
    if (x) {
      return '';
    } else {
      return ' active';
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
  "placeholder": function (text, placeholder) {
    if (!text) {
      return new Spacebars.SafeString("<span class=\"placeholder\">" + (_.escape(placeholder)) + "</span>");
    } else {
      return text;
    }
  }
};

var moment;

function makeMoment(ts) {
  var momentTs;
  if ((ts == null) || ts === '') {
    return;
  }
  return moment(ts);
}

if (Package['momentjs:moment'] != null) {
  moment = Package['momentjs:moment'].moment;

  _.extend(HelperLib, {
    DATE_FORMAT: 'DD/MM/YYYY',
    DATE_TIME_FORMAT: 'DD/MM/YYYY h:mm A',

    "formatTimestampCalendar": function (ts, placeholder) {
      var momentTs = makeMoment(ts);
      if (placeholder == null) {
        placeholder = '';
      }
      if (momentTs == null) {
        return placeholder;
      }
      return momentTs.calendar();
    },
    "formatTimestampDate": function (ts, placeholder) {
      var momentTs = makeMoment(ts);
      if (placeholder == null) {
        placeholder = '';
      }
      if (momentTs == null) {
        return placeholder;
      }
      return momentTs.format(HelperLib.DATE_FORMAT);
    },
    "formatTimestampDateTime": function (ts, placeholder) {
      var momentTs = makeMoment(ts);
      if (placeholder == null) {
        placeholder = '';
      }
      if (momentTs == null) {
        return placeholder;
      }
      return momentTs.format(HelperLib.DATE_TIME_FORMAT);

    },
    "timestampRanges": {
      "default": [
        {props: {title: "More than 3 days left", style: 'color:auto;'}, $lte: Infinity, $gt: (86400 * 3)},
        {props: {title: "Less than 3 days left", style: 'color:#d58512;'}, $lte: (86400 * 3), $gt: 0},
        {props: {title: "Overdue", style: 'color:#d9534f;'}, $lte: 0, $gt: -Infinity}
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
        return r.$gt < delta && delta <= r.$lte;
      });
    }
  });
}

if (Meteor.isClient) {
  _.each(HelperLib, function (fn, name) {
    Template.registerHelper(name, fn);
  });
}
