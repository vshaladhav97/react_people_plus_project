export const getTimings = (time, operator) => {
  let timings = []
  for (let i = 0; i < 24; i++) {
    if (operators[operator](i, time)) {
      timings.push(('0' + (i % 24)).slice(-2) + ':00')
    }
  }
  return timings
}

const operators = {
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
}

export const getWeekDays = () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const trimValues = (object) => {
  //trims trailing and leading spaces
  let newObject = {}
  Object.keys(object).forEach((key) => {
    newObject[key] = typeof object[key] === 'string' ? object[key].trim() : object[key]
  })
  return newObject
}

export const getFields = (data) => {
  let arr = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      arr[data[key].name] = data[key].defaultValue || ''
    }
  }
  return arr
}
export const getRegex = (data) => {
  let arr = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key].regex) {
        arr[data[key].name] = data[key].regex
      }
    }
  }
  return arr
}
export const getAllRegex = (data) => {
  let arr = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      for (var innerKey in data[key]) {
        if (data[key][innerKey].regex) {
          arr[data[key][innerKey].name] = data[key][innerKey].regex
        }
      }
    }
  }
  return arr
}
export const getAllMaxLength = (data) => {
  let arr = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      for (var innerKey in data[key]) {
        if (data[key][innerKey].maxLength) {
          arr[data[key][innerKey].name] = data[key][innerKey].maxLength
        }
      }
    }
  }
  return arr
}

export const getAllMinLength = (data) => {
  let arr = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      for (var innerKey in data[key]) {
        if (data[key][innerKey].minLength) {
          arr[data[key][innerKey].name] = data[key][innerKey].minLength
        }
      }
    }
  }
  return arr
}

export const getAllNonMandatoryFields = (data) => {
  let arr = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      for (var innerKey in data[key]) {
        if (data[key][innerKey].optional) {
          arr[data[key][innerKey].name] = data[key][innerKey].optional
        }
      }
    }
  }
  return arr
}
export const getAllFieldErrors = (data) => {
  let arr = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      for (var innerKey in data[key]) {
        if (data[key][innerKey].error) {
          arr[data[key][innerKey].name] = data[key][innerKey].error
        }
      }
    }
  }
  return arr
}
export const getFieldLabels = (data) => {
  let arr = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      for (var innerKey in data[key]) {
        if (data[key][innerKey].label) {
          arr[data[key][innerKey].name] = data[key][innerKey].label
        }
      }
    }
  }
  return arr
}
export const getFieldPlaceholders = (data) => {
  let arr = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      for (var innerKey in data[key]) {
        if (data[key][innerKey].placeholder) {
          arr[data[key][innerKey].name] = data[key][innerKey].placeholder
        }
      }
    }
  }
  return arr
}
export const getFieldNotes = (data) => {
  let arr = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      for (var innerKey in data[key]) {
        if (data[key][innerKey].note) {
          arr[data[key][innerKey].name] = data[key][innerKey].note
        }
      }
    }
  }
  return arr
}
export const getFieldExt = (data) => {
  let arr = {}
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      for (var innerKey in data[key]) {
        if (data[key][innerKey].ext) {
          arr[data[key][innerKey].name] = data[key][innerKey].ext
        }
      }
    }
  }
  return arr
}
export const getTzOffset = () => {
  let offset = new Date().getTimezoneOffset()
  let sign = '-'
  let offsetInHours
  let offsetInHoursDecimal = offset / 60 // -5.5
  if (offset < 0) {
    sign = '+'
    offsetInHours = Math.ceil(offsetInHoursDecimal)
  } else {
    offsetInHours = Math.floor(offsetInHoursDecimal)
  }

  let offsetInHoursStr = Math.abs(offsetInHours)
  if (offsetInHours < 10) {
    offsetInHoursStr = '0' + offsetInHoursStr
  }
  let mins = '00'
  if (offset % 60) {
    mins = (Math.abs(offsetInHoursDecimal) - Math.abs(offsetInHours)) * 60
    if (mins < 10) {
      mins = '0' + mins
    }
  }
  return sign + offsetInHoursStr + ':' + mins
}

export const parseISOString = (s) => {
  let date = new Date(s)
  return date
}

export const formatTime = (date) => {
  var timeString = date.split(':')
  return `${('0' + (timeString[0] % 12 || 12)).slice(-2)}:${timeString[1]} ${timeString[0] < 12 ? 'AM' : 'PM'}`
}

export const getValueFromAdressComponent = (addressComponents, field, nameType = 'long_name') => {
  if (!Array.isArray(addressComponents) || addressComponents.length <= 0) return ''
  for (let component of addressComponents) {
    if (component.types.includes(field)) {
      return component[nameType]
    }
  }
  return ''
}
