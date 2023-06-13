import React, { useState, useEffect, useRef, useCallback } from 'react'
import './Dropdown.scss'
import Tooltip from '../Tooltip'

/**
 * Represents an Accordion component
 * 
 * @component
 * @example
 * <Dropdown
      id='dropdown'
      value={selectedValue}
      options={arrayList}
      placeholder='Placeholder text'
      handleOnChange={() => {}}
      filterBy='value'
      searchText='Search text'
   />
 */
const Dropdown = ({
  id = 'servify-dropdown-component',
  value,
  placeholder,
  ValueComponent,
  searchText,
  filterBy,
  OptionsComponent,
  options,
  handleOnChange,
  classObject = {},
  isDisabled,
  children,
  reference,
  showDownArrow = true,
  showClearButton = false,
  customDownArrow,
  handleOnSearch,
  showTooltip = false,
  labelFloat = false,
  noOptionsText = 'No results found',
  handleOnFocus,
  showNoOptionsText = true,
  isSearchable = true,
  customComponent,
}) => {
  const [showDropdownOptions, setShowDropdownOptions] = useState(false)
  const [isActive, setIsActive] = useState(!Boolean(value) && !Number.isInteger(value))
  const [searchValue, setSearchValue] = useState('')
  const [dropdownOptions, setDropdownOptions] = useState([])
  const dropdownRef = useRef(null)

  const optionsComponent = useRef(null)
  const valueComponent = useRef(null)
  const arrowComponent = useRef(null)

  const [optionCoords, setOptionCoords] = useState({ x: -1, y: -1 })
  const [isOptionRippling, setIsOptionRippling] = useState(false)
  const [isRippling, setIsRippling] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)

  useEffect(() => {
    if (optionCoords.x !== -1 && optionCoords.y !== -1) {
      setIsOptionRippling(true)
      setTimeout(() => setIsOptionRippling(false), 300)
    } else setIsOptionRippling(false)
  }, [optionCoords])

  useEffect(() => {
    if (!isOptionRippling) setOptionCoords({ x: -1, y: -1 })
  }, [isOptionRippling])

  useEffect(() => {
    if (isRippling) {
      setTimeout(() => setIsRippling(false), 300)
    }
  }, [isRippling])

  const handleOutsideClick = useCallback(
    (e) => {
      const optionsElement = optionsComponent.current
      const valueElement = valueComponent.current
      const arrowElement = arrowComponent.current
      if (
        !(valueElement && valueElement.contains(e.target)) &&
        !(optionsElement && optionsElement.contains(e.target)) &&
        !(arrowElement && arrowElement.contains(e.target))
      ) {
        setShowDropdownOptions(false)
      }
      if (!Boolean(value) && !Number.isInteger(value)) {
        setIsActive(false)
      }
    },
    [value]
  )

  const getDropdownOpenStyles = () => {
    const containerRef = reference || dropdownRef
    const optionsContainerHeight = optionsComponent.current.scrollHeight
    const containerRect = containerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - containerRect.bottom
    const SPACE_ABOVE_INPUT = 5
    const MAX_OPTIONS_HEIGHT = 155
    const optionsVisibleHeight = Math.min(optionsContainerHeight, MAX_OPTIONS_HEIGHT)
    const move = containerRef.current.offsetHeight + optionsVisibleHeight + SPACE_ABOVE_INPUT
    return spaceBelow < optionsVisibleHeight ? { transform: `translateY(-${move}px)` } : {}
  }

  useEffect(() => {
    const isEmpty = !Boolean(value) && !Number.isInteger(value)
    setIsActive(!isEmpty)
  }, [value])

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [handleOutsideClick, labelFloat])

  useEffect(() => {
    showDropdownOptions && valueComponent.current.focus()
  }, [showDropdownOptions])

  useEffect(() => {
    setDropdownOptions(options)
  }, [options])

  const handleTabKeyPress = (e) => {
    if (e.key === 'Tab' && labelFloat && e.target.value) {
      setIsActive(true)
    }
  }

  const handleOnFilter = async (e) => {
    if (!isSearchable) return
    const searchString = e.target.value
    setSearchValue(searchString)
    const filteredData =
      handleOnSearch && handleOnSearch instanceof Function
        ? await handleOnSearch(e)
        : options.filter((option) => option[filterBy].toString().toLowerCase().includes(searchString.toLowerCase()))
    setDropdownOptions(filteredData)
  }

  const handleOnOptionChange = (option, e) => {
    setTimeout(() => setShowDropdownOptions(false), 100)
    handleOnChange(option, e)
    setDropdownOptions(options)
    setIsActive(true)
    setSearchValue('')
  }

  const onArrowClick = (e) => {
    e.stopPropagation()
    setIsRippling(true)
    setShowDropdownOptions(!showDropdownOptions)
  }

  const handleClearAllButton = () => {
    handleOnChange('')
    setIsActive(false)
  }

  const handleOnEnterKeyPress = (e) => {
    if (!showDropdownOptions) {
      let form = e.target.closest('form')
      const totalInputs =
        form?.querySelectorAll('input')?.length +
        form?.getElementsByClassName('servify-dropdown-container')?.length +
        form?.getElementsByClassName('multiselect')?.length
      totalInputs === 1 && form?.querySelectorAll("button[type='submit']")[0]?.click()
    }
  }

  return (
    <div
      id={id}
      className={`servify-dropdown-container ${labelFloat ? 'dropdown-float-container no-border' : ''} 
      ${!dropdownOptions.length > 0 && showDropdownOptions ? 'border-error' : ''} ${classObject.container || ''}`}
      ref={reference || dropdownRef}
    >
      {labelFloat && (
        <label
          onClick={
            !isDisabled
              ? (e) => {
                  setIsRippling(true)
                  setShowDropdownOptions(true)
                }
              : undefined
          }
          className={`${isDisabled ? 'dropdown-isDisabled' : 'dropdown-input__label'} ${isActive ? 'active' : ''} `}
        >
          {searchText}
        </label>
      )}
      <React.Fragment>
        <div className={`${labelFloat ? 'dropdown-input-container' : 'flex-grow height-full'} ${classObject.formControl || ''}`}>
          {showDropdownOptions ? (
            <input
              id='servify-search-options'
              className={`servify-search-options ${labelFloat ? 'input-active' : ''} ${classObject.optionsSearch || ''}`}
              type='text'
              value={searchValue}
              placeholder={labelFloat || !isSearchable ? '' : searchText}
              autoComplete='off'
              onChange={handleOnFilter}
              ref={valueComponent}
              tabIndex={0}
              onFocus={handleOnFocus}
              disabled={!isSearchable}
              onKeyDown={handleTabKeyPress}
            />
          ) : (
            <div
              tabIndex={0}
              className={`servify-value 
                 ${classObject.valueContainer || ''}
                 ${isDisabled ? 'servify-isDisabled' : ''}
                `}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowDropdownOptions(true)
                }
              }}
              onClick={(e) => {
                setIsRippling(true)
                setShowDropdownOptions(true)
              }}
            >
              {ValueComponent ? (
                <ValueComponent value={value} />
              ) : showTooltip && value && value.length > 40 ? (
                <Tooltip content={value} position='bottom'>
                  {value.slice(0, 35) + '...'}
                </Tooltip>
              ) : value?.toString().length > 0 ? (
                value
              ) : !labelFloat && placeholder ? (
                <span className='placeholder'>{placeholder}</span>
              ) : (
                ''
              )}
            </div>
          )}
          {labelFloat && (
            <fieldset className={`fieldset ${isActive ? 'border-active' : ''}`}>
              <legend className={`legend ${isActive ? 'label-active' : ''}`}>
                <span>{searchText}</span>
              </legend>
            </fieldset>
          )}
        </div>
        {value?.toString().length > 0 && !isDisabled && showClearButton && (
          <span className='clear-btn' onClick={handleClearAllButton}>
            x
          </span>
        )}
        {!isDisabled && showDownArrow && (
          <div className='arrow-cursor' onClick={onArrowClick} ref={arrowComponent}>
            {isRippling && <span className='dropdown-ripple' />}
            {customDownArrow || (
              <div
                className={`${showDropdownOptions ? 'servify-arrow open-dropdown-arrow' : 'servify-arrow'} ${classObject.arrowDown || ''}`}
              />
            )}
          </div>
        )}
        {customComponent && customComponent}
        <div
          id='servify-dropdown-options'
          className={`servify-dropdown-options 
          ${classObject.optionsComponent || ''}
          ${showDropdownOptions ? 'show-dropdown' : 'hide-dropdown'}`}
          ref={optionsComponent}
          style={showDropdownOptions ? getDropdownOpenStyles() : {}}
        >
          {dropdownOptions.length > 0 ? (
            <>
              {dropdownOptions.map((option, index) => {
                return (
                  <div
                    key={index}
                    id={`option-${index}`}
                    tabIndex={showDropdownOptions ? 0 : -1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleOnOptionChange(option, e)
                        handleOnEnterKeyPress(e)
                      }
                    }}
                    onClick={(e) => {
                      setCurrentIndex(index)
                      const rect = e.target.getBoundingClientRect()
                      setOptionCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                      handleOnOptionChange(option, e)
                    }}
                    className={`servify-dropdown-option ${classObject.option || ''}`}
                  >
                    {isOptionRippling && currentIndex === index && (
                      <span
                        className='dropdown-option-ripple'
                        style={{
                          left: optionCoords.x,
                          top: optionCoords.y,
                        }}
                      />
                    )}
                    {OptionsComponent ? <OptionsComponent option={option} /> : <>{option.value}</>}
                  </div>
                )
              })}
            </>
          ) : showNoOptionsText ? (
            <div className='p7 cursor-default error'>{noOptionsText}</div>
          ) : null}
        </div>
        {!showDropdownOptions && children}
      </React.Fragment>
    </div>
  )
}

export default React.memo(Dropdown)
