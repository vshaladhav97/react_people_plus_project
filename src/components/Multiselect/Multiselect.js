import React, { useRef, useState, useEffect, useCallback } from 'react'
import './Multiselect.scss'
import Chip from '../Chip'
import Button from '../Button'
import Tooltip from '../Tooltip'

/**
 * Provides a Multiselect component
 *
 * @component
 * @example
 * <Multiselect
    options={items}
    values={selectedItems}
    handleOnSelect={handleSelection}
    handleOnRemove={removeFromSelected}
    handleClearAll={removeAll}
    filterBy={'value'}
    placeholder={'Choose some frameworks'}
    searchText='Search a framework'
  />
 *
 * @property {String} id id of the Multiselect dropdown.
 * @property {Array} values Array containing selected values. 
 * @property {String} placeholder Placholder when none selected.
 * @property {*} ValueComponent Optional custom value component.
 * @property {String} filterBy Filter by key for filtering the list.
 * @property {*} OptionsComponent Optional custom options component.
 * @property {Array} options List of options. Each object shall have at least the key named 'value'.
 * @property {Function} onSelect OnChange function on selection.
 * @property {Function} onRemove Function to handle removing of selected item.
 * @property {Function} onClearAll Function to handle clear all selections.
 * @property {Function} handleOnSearch Function that is called when user enters search text in the input.
 * @property {Object} classObject Classes object for manipulating the classes.
 * @property {Boolean} isDisabled would disable the dropdown if true.
 * @property {String} uniqueKey key in the options object which is unique.
 * @property {*} children An element or a component could be passed to render.
 * @property {Object} otherProps An object, which can be used to pass additional props.
 * @property {Boolean} shouldSortOnSelect A boolean which when true the options are sorted when selected.
 * @property {Boolean} showValuesInside A boolean which when true the value list is rendered inside the Multiselect container.
 * @property {Boolean} hideClearAllBtn A boolean which when true hides the 'clear all' button.
 * @property {Boolean} hideSearchBar A boolean if true hides the search bar.
 * @property {Boolean} hideValues A boolean if true hides the value list.
 */

const Multiselect = ({
  id = '',
  values = [],
  placeholder = '',
  filterBy,
  OptionsComponent,
  options,
  onSelect,
  onRemove,
  classObject = {},
  isDisabled,
  children,
  onClearAll,
  uniqueKey,
  labelText,
  ValueComponent,
  otherProps,
  showDownArrow = true,
  customDownArrow,
  handleOnSearch,
  showTooltip = false,
  labelFloat = false,
  shouldSortOnSelect = true,
  showValuesInside,
  hideClearAllBtn,
  hideSearchBar,
  hideValues,
  clearAllText = 'Clear All',
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const [filter, setFilter] = useState('')
  const [dropdownOptions, setDropdownOptions] = useState([])
  const multiselectContainer = useRef(null)
  const inputRef = useRef(null)
  const optionsContainer = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [placeholderActive, setPlaceholderActive] = useState(true)
  const legendRef = useRef(null)

  useEffect(() => {
    let sortedOptions = options
    if (shouldSortOnSelect) {
      sortedOptions = options.sort((op1) => (values.some((value) => op1[uniqueKey] === value[uniqueKey]) ? -1 : 1))
    }
    setDropdownOptions(sortedOptions)
  }, [options, values, uniqueKey, shouldSortOnSelect])

  const toggleShowOptions = () => {
    setShowOptions(!showOptions)
    setIsActive(true)
    setPlaceholderActive(!placeholderActive)
  }

  const handleOnFilter = async (e) => {
    setShowOptions(true)
    setFilter(e.target.value)
    const filteredOptions =
      handleOnSearch && handleOnSearch instanceof Function
        ? await handleOnSearch(e)
        : options.filter((option) => option[filterBy].toString().toLowerCase().includes(e.target.value.toLowerCase()))
    setDropdownOptions(filteredOptions)
  }

  const clearFilter = () => {
    setFilter('')
    setDropdownOptions(options)
  }

  const handleOnSelect = (option, e) => {
    e.stopPropagation()
    inputRef.current?.focus()
    onSelect(option, e)
    setFilter('')
    setPlaceholderActive(false)
  }

  const focusNextOption = () => {
    const focusable = optionsContainer.current.querySelectorAll('button:not([disabled])')
    const firstFocusable = focusable[0]
    const lastFocusable = focusable[focusable.length - 1]
    !showOptions && setShowOptions(true)
    if (!focusable.length > 0) return
    if (document.activeElement === lastFocusable) {
      firstFocusable.focus()
      return
    }
    if (optionsContainer.current.contains(document.activeElement)) {
      let currentFocusedIndex
      for (let i = 0; i < focusable.length; i++) {
        if (focusable[i] === document.activeElement) {
          currentFocusedIndex = i
          break
        }
      }
      focusable[currentFocusedIndex + 1].focus()
    } else {
      firstFocusable.focus()
    }
  }

  const focusPreviousOption = () => {
    const focusable = optionsContainer.current.querySelectorAll('button:not([disabled])')
    const firstFocusable = focusable[0]
    const lastFocusable = focusable[focusable.length - 1]
    !showOptions && setShowOptions(true)
    if (!focusable.length > 0) return
    if (document.activeElement === firstFocusable) {
      lastFocusable.focus()
      return
    }
    if (optionsContainer.current.contains(document.activeElement)) {
      let currentFocusedIndex
      for (let i = 0; i < focusable.length; i++) {
        if (focusable[i] === document.activeElement) {
          currentFocusedIndex = i
          break
        }
      }
      focusable[currentFocusedIndex - 1].focus()
    } else {
      lastFocusable.focus()
    }
  }

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        focusPreviousOption()
        break
      case 'ArrowDown':
        e.preventDefault()
        focusNextOption()
        break
      case 'Escape':
        setShowOptions(false)
        break
      default:
        return
    }
  }

  const handleLabelVisibility = useCallback(() => {
    const floatState = (showValuesInside && values.length > 0) || filter.length > 0
    setIsActive(floatState)
    setPlaceholderActive(!floatState)
  }, [showValuesInside, values, filter])

  useEffect(() => {
    setIsActive(!values.length)
  }, [values])

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const containerElement = multiselectContainer.current
      containerElement && !containerElement.contains(e.target) && setShowOptions(false)
      handleLabelVisibility()
    }
    handleLabelVisibility()
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [handleLabelVisibility])

  const MultiselectValues = useCallback(() => {
    return (
      <>
        {values.map((value, index) => (
          <Chip
            key={index}
            btnId={value[uniqueKey]}
            onDelete={onRemove}
            className={{ chip: `multiselect__chip ${classObject.chip || ''}` }}
          >
            {showTooltip && value.value.length > 20 ? (
              <Tooltip content={value.value} position='bottom'>
                {value.value.slice(0, 19) + '...'}
              </Tooltip>
            ) : (
              value.value
            )}
          </Chip>
        ))}
        {!hideClearAllBtn && (
          <Chip className={{ chip: `multiselect__chip multiselect__clear-chip ${classObject.chip || ''}` }} onClick={onClearAll}>
            {clearAllText}
          </Chip>
        )}
      </>
    )
  }, [classObject, hideClearAllBtn, onClearAll, onRemove, showTooltip, uniqueKey, values, clearAllText])

  return (
    <>
      <div
        className={`multiselect ${classObject.container || ''} ${labelFloat && isActive && values.length > 0 ? 'pt5 pb5' : ''} ${
          labelFloat ? 'multiselect-float-container border-none' : 'flex-grow'
        } ${isDisabled ? 'multiselect--disabled' : ''}`}
        onClick={toggleShowOptions}
        ref={multiselectContainer}
        onKeyDown={handleKeyDown}
        id={id}
        {...otherProps}
      >
        {labelFloat && (
          <label
            style={{
              '&:focus': {
                transform: `translate(5px, -${multiselectContainer.current?.clientHeight}px) scale(0.9)`,
                visibility: 'visible',
              },
            }}
            className={`multiselect-input__label ${isActive ? 'active' : ''}`}
          >
            {labelText}
          </label>
        )}
        <div className={`${labelFloat ? 'multiselect-input-container' : 'd-flex flex-grow flex-wrap'}`}>
          {!hideValues &&
            values.length > 0 &&
            showValuesInside &&
            (ValueComponent ? <ValueComponent values={values} /> : <MultiselectValues />)}
          {!hideSearchBar && (
            <input
              className={`multiselect__input ${classObject.input || ''}`}
              placeholder={labelFloat ? '' : placeholder}
              value={filter}
              onChange={handleOnFilter}
              ref={inputRef}
              tabIndex={isDisabled ? -1 : 1}
              disabled={isDisabled}
            />
          )}
          {filter.length > 0 && (
            <Button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                clearFilter()
              }}
              classes={`multiselect__clear-btn ${classObject.clearBtn || ''}`}
              text={'\u2715'}
            />
          )}
          {!isDisabled && showDownArrow && (
            <Button
              type='button'
              classes={`multiselect__open-btn ${classObject.toggleBtn || ''}`}
              isPointRipple={true}
              notBtnRipple={true}
              xCoord={4}
              yCoord={10}
            >
              {customDownArrow || (
                <div
                  className={` ${showOptions ? 'multiselect__arrow-down open-dropdown-arrow' : 'multiselect__arrow-down'} ${
                    classObject.arrowDown || ''
                  }`}
                ></div>
              )}
            </Button>
          )}
          {labelFloat && (
            <fieldset className={`fieldset ${isActive ? 'border-active' : ''}`}>
              <legend
                ref={legendRef}
                className={`legend ${isActive ? 'label-active' : ''}`}
                style={isActive ? { transform: `translate(0px, -${legendRef.current?.clientHeight - 20}px) scale(0.9)` } : {}}
              >
                <span>{labelText}</span>
              </legend>
            </fieldset>
          )}
        </div>
        {options.length > 0 && !isDisabled && (
          <div
            className={`multiselect__options-container ${classObject.optionsContainer || ''}  ${
              showOptions ? 'multiselect__options-container--show' : 'multiselect__options-container--hide'
            }`}
            ref={optionsContainer}
          >
            {dropdownOptions.map((option, index) => (
              <Button
                type='button'
                classes={`multiselect__option ${classObject.option || ''}`}
                notBtnRipple={true}
                isDisabled={values.some((value) => value[uniqueKey] === option[uniqueKey])}
                handleOnClick={(e) => {
                  handleOnSelect(option, e)
                }}
                key={index}
              >
                {OptionsComponent ? <OptionsComponent option={option} /> : option.value}
              </Button>
            ))}
          </div>
        )}
        {children}
      </div>
      {!hideValues && values.length > 0 && !showValuesInside && (
        <div className='multiselect__chip-container'>{ValueComponent ? <ValueComponent values={values} /> : <MultiselectValues />}</div>
      )}
    </>
  )
}

export default React.memo(Multiselect)
