import numFormat from 'vue-filter-number-format';
import { format as formatDate, parse as parseDate } from 'date-fns';

export default {
  date: (dateString: string, format: string = 'MMM dd, YYYY') => {
    let date = parseDate(dateString);
    return formatDate(date, format);
  },
  lowercase: (str: string) => {
    return str.toLowerCase();
  },
  numFormat,
  pluralize: (
    noun: string,
    count: number,
    substitutions = {},
    pluralSuffix = 's'
  ) => {
    return (
      `${substitutions[count] || count} ` +
      (count !== 1 ? `${noun}${pluralSuffix}` : noun)
    );
  },
  round: (value, decimals) => {
    return (
      Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
    ).toFixed(decimals);
  },
  variablePrecisionNumber: (value, minPrecision, maxPrecision) => {
    let maximallyPreciseDecimal = value | numFormat(maxPrecision);
    let superfluousZeros = new RegExp(`0{1,${maxPrecision - minPrecision}}$`);
    return maximallyPreciseDecimal.toString().replace(superfluousZeros, '');
  }
};