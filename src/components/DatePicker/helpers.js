import { listShiftLeft } from '../../utils/helpers'

export const getTranslatedMonths = (language = 'en', monthFormat = 'long') =>
  [...Array(12)].map((_, index) => new Date(0, index, 1).toLocaleString(language, { month: monthFormat }))

export const getTranslatedLocaleDays = (language = 'en', locale = 'en-IN', localeToFirstDayMap = defaultLocaleToFirstDayMap) => {
  const calendarStartingDay = localeToFirstDayMap[locale]
  const translatedDays = [...Array(7)].map((_, index) => new Date(0, 0, index).toLocaleString(language, { weekday: 'short' }))
  return listShiftLeft(translatedDays, calendarStartingDay)
}

export const shortMonths = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
}

export const classList = (...classes) => classes.filter((item) => !!item).join(' ')

export const getDaysOfMonth = (year, month) => {
  return new Date(year, month, 0).getDate()
}

export const dateFormats = {
  'mm/dd/yyyy': {
    regex: /^(((0)[0-9])|((1)[0-2]))(\/)([0-2][0-9]|(3)[0-1])(\/)\d{4}$/,
    separator: '/',
  },
  'dd/mm/yyyy': {
    regex: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
    separator: '/',
  },
  'dd-mm-yyyy': {
    regex: /^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)\d{4}$/,
    separator: '-',
  },
  'yyyy-mm-dd': {
    regex: /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/,
    separator: '-',
  },
  'dd/mm/yy': {
    regex: /^\d{2}\/\d{2}\/\d{2}$/,
    separator: '/',
  },
}

export const formatDate = (date, format, separator) => {
  // const separator = dateFormats[format].separator;
  const splitDateArray = date
  const splitFormat = format.split(separator)
  let formattedDate = ''
  splitFormat.forEach((value, index) => {
    if (value.includes('m')) {
      formattedDate = formattedDate + shortMonths[splitDateArray[1]]
    } else if (value.includes('d')) {
      formattedDate = formattedDate + splitDateArray[2]
    } else if (value.includes('yyyy')) {
      formattedDate = formattedDate + splitDateArray[3]
    } else if (value.includes('yy')) {
      const year = splitDateArray[3]
      formattedDate += year?.length === 4 && year[2] + year[3]
    }
    index !== splitFormat.length - 1 && (formattedDate += separator)
  })
  return formattedDate
}

export const ISOFormat = (date, format, separator) => {
  // const separator = dateFormats[format].separator;
  const splitDateArray = date.toString().split(separator)
  const splitFormat = format.split(separator)
  const day = splitDateArray[splitFormat.findIndex((item) => item.includes('d'))]
  const month = splitDateArray[splitFormat.findIndex((item) => item.includes('m'))]
  const year = splitDateArray[splitFormat.findIndex((item) => item.includes('y'))]
  return `${year}${separator}${month}${separator}${day}`
}
// console.log(ISOFormat('31/12/2020', 'dd/mm/yyyy'))
// console.log(ISOFormat('31-12-2020', 'dd-mm-yyyy'))
// console.log(ISOFormat('12/31/2020', 'mm/dd/yyyy'))
// console.log(ISOFormat('2020-12-31', 'yyyy-mm-dd'))

export const isBefore = (date, dateToCompare) => {
  return date.getTime() < dateToCompare.getTime()
}

export const isWithinInterval = (date, dateInterval) => {
  if (!date || !dateInterval.start || !dateInterval.end) {
    return false
  }
  var interval = dateInterval
  var time = date.getTime()
  var startTime = interval.start.getTime()
  var endTime = interval.end.getTime()
  return time >= startTime && time <= endTime
}

/**
 * Contains locale to first day of the week mapping
 * 0 -> Sunday, 1 -> Monday, 2 -> Tuesday, 3 -> Wednesday
 * 4 -> Thursday, 5 -> Friday, 6 -> Saturday
 */
export const defaultLocaleToFirstDayMap = {
  // Monday
  'de-AT': 1,
  'cs-CZ': 1,
  'pl-PL': 1,
  'ro-RO': 1,

  // Else Sunday
}

export const getLocaleDaySequence = (locale, localeToFirstDayMap = defaultLocaleToFirstDayMap) => {
  const calendarStartingDay = localeToFirstDayMap[locale]
  let initialSequence = [...Array(7).keys()]
  return listShiftLeft(initialSequence, calendarStartingDay)
}
