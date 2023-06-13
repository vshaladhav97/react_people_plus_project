/**
 *
 * @param {Number | String | Date} item1
 * @param {Number | String | Date} item2
 * @return {Number} 0 if item1 === item 2, 1 if item1 > item2, -1 otherwise
 */
export const compare = (item1, item2) => {
  if (item1 === item2) return 0
  return item1 > item2 ? 1 : -1
}

export const checkIfDateObject = (date) => {
  if (date && typeof date.getMonth === 'function') {
    date.setHours(0, 0, 0, 0)
    return date
  }
  return false
}

export const dateFormatter = (date, format) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  if (checkIfDateObject(date)) {
    const _month = date.getMonth() + 1
    const _year = date.getFullYear()
    const _date = date.getDate()
    const seperators = ['/', '.', '-', ' ']
    let seperator = '/'
    let newFormat = ''
    let finalDate = []

    seperators.forEach(function (item) {
      if (format.split(item).length === 3) {
        seperator = item
        newFormat = format.split(item)
      }
    })

    for (let i = 0; i < 3; i++) {
      if (newFormat[i] === 'dd') {
        finalDate.push(_date < 10 ? '0' + _date : _date)
      } else if (newFormat[i] === 'mm') {
        finalDate.push(_month < 10 ? '0' + _month : _month)
      } else if (newFormat[i] === 'mmm') {
        finalDate.push(months[_month - 1])
      } else {
        finalDate.push(_year)
      }
    }
    return finalDate.join(seperator)
  } else {
    return date
  }
}

//dateFormatter(new Date('2021/10/01'), 'dd/mm/yyyy')
//dateFormatter(new Date('2021/10/21'), 'dd-mm-yyyy')
//dateFormatter(new Date('2021/10/01'), 'dd.mm.yyyy')
//dateFormatter(new Date('2021/02/01'), 'yyyy mm dd')
//dateFormatter(new Date('2021/10/01'), 'dd mmm yyyy')

/**
 * Function that shifts the items of a list a certain positions to the left
 * @param { Array } list
 * @param { Number } positions
 * @return { Array } list with items shifted
 *
 * @example
 * Input: listShiftLeft([0, 1, 2, 3, 4, 5, 6], 3)
 * Output: [3, 4, 5, 6, 0, 1, 2]
 *
 */
export const listShiftLeft = (list = [], positions = 0) => {
  if (!positions || !list.length > 0) return list
  positions = positions > list?.length ? positions % list?.length : positions
  const itemsToShift = list.splice(positions)
  return [...itemsToShift, ...list]
}
