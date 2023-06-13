import React from 'react'
import Dropdown from './index'
import { fireEvent, render, waitFor, act } from '@testing-library/react'

describe('Dropdown', () => {
  it('should render', () => {
    const { getAllByText } = render(
      <Dropdown
        value='Value'
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
      />
    )
    expect(getAllByText('Value')).toHaveLength(1)
  })

  it('should render dropdown options on click', () => {
    const { getByText, container } = render(
      <Dropdown
        value='Value'
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
      />
    )
    fireEvent.click(container.getElementsByClassName('servify-value')[0])
    expect(getByText('Samsung')).toBeInTheDocument()
  })

  it('should render dropdown options on click of enter', () => {
    const { getByText, container } = render(
      <Dropdown
        value='Value'
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
      />
    )
    fireEvent.keyDown(container.getElementsByClassName('servify-value')[0], { key: 'Enter' })
    expect(getByText('Samsung')).toBeInTheDocument()
  })

  it('should call handleOnOptionChange with mouse and enter key', () => {
    const { getByText, container } = render(
      <Dropdown
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
      />
    )
    // fireEvent.click(container.getElementsByClassName('servify-value')[0])
    // fireEvent.click(container.getElementsByClassName('servify-dropdown-option')[0])
    fireEvent.keyDown(container.getElementsByClassName('servify-value')[0], { key: 'Tab' })
    fireEvent.keyDown(container.getElementsByClassName('servify-value')[0], { key: 'Enter' })
    fireEvent.keyDown(container.getElementsByClassName('servify-dropdown-option')[0], { key: 'Tab' })
    fireEvent.keyDown(container.getElementsByClassName('servify-dropdown-option')[0], { key: 'Enter' })
    expect(getByText('Samsung')).toBeInTheDocument()
  })

  it('should call handleOnFilter with a random value and then an empty value', () => {
    const { queryByText, container } = render(
      <Dropdown
        value='Value'
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
      />
    )
    fireEvent.click(container.getElementsByClassName('servify-value')[0])
    fireEvent.change(container.getElementsByClassName('servify-search-options')[0], { target: { value: 'Text' } })
    expect(queryByText('Samsung')).not.toBeInTheDocument()
    fireEvent.change(container.getElementsByClassName('servify-search-options')[0], { target: { value: '' } })
    expect(queryByText('Samsung')).toBeInTheDocument()
  })

  it('should call handleOutsideClick', () => {
    const div = document.createElement('div')
    div.textContent = 'test'
    div.addEventListener('click', jest.fn())
    document.body.appendChild(div)
    const { queryByText, getByText, container } = render(
      <Dropdown options={['Nokia'].map((item) => ({ value: item }))} handleOnChange={() => {}} filterBy='value' searchText='Search text' />
    )
    fireEvent.click(container.getElementsByClassName('servify-value')[0])
    fireEvent.mouseDown(getByText('test'))
    expect(queryByText('Samsung')).not.toBeInTheDocument()
  })

  it('should set float to active when tab is pressed and no options are available', () => {
    const div = document.createElement('div')
    div.textContent = 'test1'
    div.addEventListener('keydown', jest.fn())
    document.body.appendChild(div)
    const { container } = render(
      <Dropdown
        options={['Nokia', 'Samsung'].map((item) => ({ value: item }))}
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
        labelFloat
      />
    )
    fireEvent.click(container.getElementsByClassName('servify-value')[0])
    fireEvent.change(container.getElementsByClassName('servify-search-options')[0], { target: { value: 'Text' } })
    fireEvent.keyDown(container.getElementsByClassName('servify-search-options')[0], { key: 'Tab', code: 9, target: { value: 'Text' } })
    expect(container.querySelector('fieldset')).toHaveClass('border-active')
  })

  it('should not set float to active when tab is pressed and options are available', () => {
    const div = document.createElement('div')
    div.textContent = 'test1'
    div.addEventListener('keydown', jest.fn())
    document.body.appendChild(div)
    const { container } = render(
      <Dropdown
        options={['Nokia', 'Samsung'].map((item) => ({ value: item }))}
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
        labelFloat
      />
    )
    fireEvent.click(container.getElementsByClassName('servify-value')[0])
    fireEvent.keyDown(container.getElementsByClassName('servify-search-options')[0], { key: 'Tab', code: 9 })
    expect(container.querySelector('fieldset')).not.toHaveClass('border-active')
  })

  it('should call render custom components', () => {
    const { queryByText } = render(
      <Dropdown
        value='Value'
        ValueComponent={(object) => <div>{object.value}</div>}
        OptionsComponent={(object) => <div>{object.value}</div>}
        options={['Nokia'].map((item) => ({ value: item }))}
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
      />
    )
    fireEvent.mouseDown(queryByText('Value'))
    expect(queryByText('Value')).toBeInTheDocument()
  })

  it('should call customFilter if it passed', async () => {
    jest.useFakeTimers()
    const handleOnSearch = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return [{ value: 'filter' }]
    }
    const { getByText, container } = render(
      <Dropdown
        value='Value'
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
        handleOnSearch={handleOnSearch}
      />
    )
    fireEvent.click(container.getElementsByClassName('servify-value')[0])
    fireEvent.change(container.getElementsByClassName('servify-search-options')[0], { target: { value: 'Text' } })
    act(() => {
      jest.runAllTimers()
    })
    await waitFor(() => expect(getByText('filter')).toBeInTheDocument())
    jest.clearAllTimers()
  })

  it('should render ellipsis if dropdown options length greater than 40', () => {
    jest.useFakeTimers()
    const { getAllByText, container } = render(
      <Dropdown
        value='Lorem Ipsum has been the industry stand...'
        options={[
          'Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book',
          'Nokia',
          'Samsung',
          'Apple',
        ].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
        showTooltip
      />
    )
    fireEvent.click(container.getElementsByClassName('arrow-cursor')[0])
    fireEvent.click(container.getElementsByClassName('servify-dropdown-option')[0])
    act(() => { jest.runAllTimers() })
    expect(getAllByText('Lorem Ipsum has been the industry s...')).toHaveLength(1)
    jest.clearAllTimers()
  })

  it('should render dropdown options when label is clicked', () => {
    const { getByText, container } = render(
      <Dropdown
        value='Value'
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
        labelFloat
      />
    )
    fireEvent.click(container.getElementsByClassName('dropdown-input__label')[0])
    expect(getByText('Samsung')).toBeInTheDocument()
  })

  it('should render floating label when labelFloat prop passed', () => {
    const { getByText, container } = render(
      <Dropdown
        value='Value'
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
        labelFloat
        isDisabled
      />
    )
    fireEvent.click(container.getElementsByClassName('servify-dropdown-option')[0])
    expect(getByText('Samsung')).toBeInTheDocument()
  })

  it('should clear input when clear all button clicked', () => {
    const { container, getAllByText } = render(
      <Dropdown
        value='Value'
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
        labelFloat
        showClearButton={true}
      />
    )
    fireEvent.click(container.getElementsByClassName('servify-dropdown-option')[0])
    fireEvent.click(container.getElementsByClassName('clear-btn')[0])
    expect(getAllByText('Value')).toHaveLength(1)
  })

  it('should not show no options message when showNoOptionsMessage is false', () => {
    const { container, queryByText } = render(
      <Dropdown
        value='Value'
        options={[]}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
        showNoOptionsText={false}
        noOptionsText={'No options'}
      />
    )
    fireEvent.click(container.getElementsByClassName('servify-value')[0])
    expect(queryByText('No options')).not.toBeInTheDocument()
  })

  window.innerHeight = -10
  window.dispatchEvent(new Event('resize'))

  it('should open dropdown options above the dropdown if there is no space below', () => {
    const { getByText } = render(
      <Dropdown
        value='Value'
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
      />
    )
    fireEvent.click(getByText('Value'))
    expect(getByText('Nokia')).toBeInTheDocument()
  })

  it('should not filter when isSearchable is false', () => {
    const { getByText, container } = render(
      <Dropdown
        value=''
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        handleOnChange={() => {}}
        filterBy='value'
        searchText='Search text'
        isSearchable={false}
      />
    )
    fireEvent.click(getByText('Placeholder text'))
    fireEvent.change(container.getElementsByClassName('servify-search-options')[0], { target: { value: 'Text' } })
    expect(getByText('Nokia')).toBeInTheDocument()
  })

  it('should render side component', () => {
    const { getByText, container } = render(
      <Dropdown
        value=''
        options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
        placeholder='Placeholder text'
        filterBy='value'
        customComponent={<div id='side-component'>Side Component</div>}
      />
    )
    expect(getByText('Side Component')).toBeInTheDocument()
  })
  it('should submit form on enter', async () => {
    jest.useFakeTimers()

    const handleSubmit = jest.fn((e) => e.preventDefault())
    const { getByLabelText, getByText, container } = render(
      <form onSubmit={handleSubmit}>
        <Dropdown
          value=''
          options={['Nokia', 'Samsung', 'Apple'].map((item) => ({ value: item }))}
          placeholder='Placeholder text'
          filterBy='value'
          handleOnChange={() => {}}
          customComponent={<div id='side-component'>Side Component</div>}
        />
        <button className='test-button' type='submit'>
          Submit
        </button>
      </form>
    )
    fireEvent.keyDown(container.getElementsByClassName('servify-value')[0], { key: 'Enter' })
    fireEvent.click(container.getElementsByClassName('servify-dropdown-option')[0])
    act(() => {
      jest.runAllTimers()
    })
    await waitFor(() => {
      fireEvent.keyDown(container.getElementsByClassName('servify-dropdown-option')[0], { key: 'Enter' })
      expect(handleSubmit).toHaveBeenCalled()
      expect(getByText('Nokia')).toBeInTheDocument()
    })
    jest.clearAllTimers()
  })
})
