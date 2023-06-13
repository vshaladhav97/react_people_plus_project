import React from 'react'
import Multiselect from './Multiselect'
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Multiselect component', () => {
  it('should render with all props', () => {
    const { container } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[{ value: 'React' }]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        isDisabled
        uniqueKey='value'
      />
    )
    expect(container).toBeInTheDocument()
  })

  it('should call onSelect when option is selected', () => {
    const handleOnSelect = jest.fn()
    const { getByText, container } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[{ value: 'React' }]}
        onSelect={handleOnSelect}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        uniqueKey='value'
      />
    )
    act(() => {
      fireEvent.click(container.querySelector('input'))
      fireEvent.click(getByText('Angular'))
    })
    expect(handleOnSelect).toHaveBeenCalled()
  })

  it('should call onRemove when delete button is pressed', () => {
    const handleOnRemove = jest.fn()
    const { getAllByText } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[{ value: 'React' }]}
        onSelect={jest.fn()}
        onRemove={handleOnRemove}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        classObject={{ container: 'custom-class', valueContainer: 'custom-class' }}
        uniqueKey='value'
      />
    )
    act(() => {
      fireEvent.click(getAllByText('\u2715')[0])
    })
    expect(handleOnRemove).toHaveBeenCalled()
  })

  it('should call onClearAll when clear all button is pressed', () => {
    const handleClearAll = jest.fn()
    const { getByText } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[{ value: 'React' }]}
        onClearAll={handleClearAll}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        searchText='Search a framework'
        classObject={{ container: 'custom-class', valueContainer: 'custom-class' }}
        uniqueKey='value'
      />
    )

    fireEvent.click(getByText('Clear All'))
    expect(handleClearAll).toHaveBeenCalled()
  })

  it('should render the custom ValueComponent and OptionComponent whenever passed in ', () => {
    const { getByText, container } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[{ value: 'React' }]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        uniqueKey='value'
        placeholder={'Choose some frameworks'}
        searchText='Search a framework'
        ValueComponent={({ values }) => {
          return (
            <div>
              {values.map((value, index) => (
                <div key={index}>{value.value}</div>
              ))}
            </div>
          )
        }}
        OptionsComponent={({ option }) => {
          return <div>{option.value}</div>
        }}
      />
    )
    fireEvent.click(container.querySelector('input'))
    act(() => {
      fireEvent.click(getByText('Angular'))
    })
    expect(getByText('Angular')).toBeInTheDocument()
  })

  it('should close the dropdown when clicked outside', () => {
    const { getByText, container } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[{ value: 'React' }]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        searchText='Search a framework'
        classObject={{ container: 'custom-class', valueContainer: 'custom-class' }}
        uniqueKey='value'
      />
    )
    const div = document.createElement('div')
    div.textContent = 'outside'
    div.addEventListener('click', jest.fn())
    document.body.appendChild(div)
    fireEvent.click(container.querySelector('input'))
    fireEvent.mouseDown(getByText('outside'))
    expect(getByText('Vue').parentElement.parentElement).toHaveClass('multiselect__options-container--hide')
  })

  it('should filter options when search text in typed', () => {
    const { getByText, container, queryByText } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[{ value: 'React' }]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        searchText='Search a framework'
        classObject={{ container: 'custom-class', valueContainer: 'custom-class' }}
      />
    )
    userEvent.type(container.querySelector('input'), 'vue')
    expect(getByText('Vue')).toBeInTheDocument()
    expect(queryByText('Angular')).not.toBeInTheDocument()
  })

  it('should close the dropdown when Escape is pressed', () => {
    const handleOnRemove = jest.fn()
    const { getByText, container } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[{ value: 'React' }]}
        onSelect={jest.fn()}
        onRemove={handleOnRemove}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        searchText='Search a framework'
        classObject={{ container: 'custom-class', valueContainer: 'custom-class' }}
        uniqueKey='value'
      />
    )
    fireEvent.click(container.querySelector('input'))
    fireEvent.keyDown(container.querySelector('input'), { key: 'Escape' })
    expect(getByText('Vue').parentElement.parentElement).toHaveClass('multiselect__options-container--hide')
  })

  it('should handle ArrowUp and ArrowDown key press accordingly', () => {
    const { getByText, container } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        searchText='Search a framework'
        uniqueKey='value'
        classObject={{ container: 'custom-class', valueContainer: 'custom-class' }}
      />
    )

    for (let i = 0; i < 4; i++) {
      fireEvent.keyDown(container.querySelector('input'), { key: 'ArrowDown' })
    }
    expect(getByText('React').parentElement).toHaveFocus()
    fireEvent.click(container.querySelector('input'))
    document.activeElement.blur()
    for (let i = 0; i < 4; i++) {
      fireEvent.keyDown(container.querySelector('input'), { key: 'ArrowUp' })
    }
    expect(getByText('Vue').parentElement).toHaveFocus()
  })

  it('should handle ArrowUp and ArrowDown when all options are selected', () => {
    const { container, getAllByText } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[{ value: 'React' }, { value: 'Angular' }, { value: 'Vue' }]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        searchText='Search a framework'
        classObject={{ container: 'custom-class', valueContainer: 'custom-class' }}
        uniqueKey='value'
      />
    )
    fireEvent.keyDown(container.querySelector('input'), { key: 'ArrowDown' })
    fireEvent.keyDown(container.querySelector('input'), { key: 'ArrowUp' })
    expect(getAllByText('React')[0]).not.toHaveFocus()
  })

  it('should clear the search text when clear button is pressed', () => {
    const { getByPlaceholderText, getByText } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        searchText='Search a framework'
        classObject={{ container: 'custom-class', valueContainer: 'custom-class' }}
        uniqueKey='value'
      />
    )
    userEvent.type(getByPlaceholderText('Choose some frameworks'), 'abcd')
    userEvent.click(getByText('\u2715'))
    expect(getByPlaceholderText('Choose some frameworks').value).toBe('')
  })

  it('should use customFilter whenever it is passed', async () => {
    const handleOnSearch = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return [{ value: 'filter' }]
    }
    const { container, getByText } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        searchText='Search a framework'
        classObject={{ container: 'custom-class', valueContainer: 'custom-class' }}
        uniqueKey='value'
        handleOnSearch={handleOnSearch}
      />
    )
    userEvent.type(container.querySelector('input'), 'vue')
    await waitFor(() => expect(getByText('filter')).toBeInTheDocument())
  })

  it('should display floating Label when labelFloat prop passed', () => {
    const handleOnSelect = jest.fn()
    const { container, getByText } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[{ value: 'React' }]}
        onSelect={handleOnSelect}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        labelText='Search text'
        uniqueKey='value'
        labelFloat
      />
    )
    fireEvent.click(container.querySelector('input'))
    act(() => {
      fireEvent.click(getByText('Angular'))
    })
    expect(handleOnSelect).toHaveBeenCalled()
    expect(container.querySelector('fieldset')).toHaveClass('border-active')
    expect(container.querySelector('legend')).toHaveClass('label-active')
  })

  // it('should render ellipsis if dropdown options length greater than 40', () => {
  //   const handleOnSelect = jest.fn()
  //   const { getAllByText, container } = render(
  //     <Multiselect
  //       options={[
  //         'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  //         'Nokia',
  //         'Samsung',
  //         'Apple',
  //       ].map((item) => ({ value: item }))}
  //       placeholder='Placeholder text'
  //       onSelect={handleOnSelect}
  //       filterBy='value'
  //       labelText='Search text'
  //       uniqueKey='value'
  //       labelFloat
  //     />
  //   )
  //   fireEvent.click(container.getElementsByClassName('multiselect-input__label ')[0])
  //   fireEvent.click(container.getElementsByClassName('multiselect__options-container')[0])
  //   // expect(container.getElementsByClassName('multiselect__chip-container')).
  //   expect(getByText('Lorem Ipsum is simply dum...')).toBeInTheDocument()
  // })

  it('should render the custom ValueComponent and OptionComponent whenever passed in ', () => {
    const { getByText, container } = render(
      <Multiselect
        options={['Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'React', 'Angular', 'Vue'].map((item) => ({
          value: item,
        }))}
        values={[{ value: 'React' }]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        uniqueKey='value'
        placeholder={'Choose some frameworks'}
        searchText='Search a framework'
        ValueComponent={({ values }) => {
          return (
            <div>
              {values.map((value, index) => (
                <div key={index}>{value.value.length > 20 ? value.value.slice(0, 19) + '...' : value.value}</div>
              ))}
            </div>
          )
        }}
        OptionsComponent={({ option }) => {
          return <div>{option.value.length > 30 ? option.value.slice(0, 25) + '...' : option.value}</div>
        }}
      />
    )
    fireEvent.click(container.querySelector('input'))
    act(() => {
      fireEvent.click(getByText('Lorem Ipsum is simply dum...'))
    })
    expect(getByText('Lorem Ipsum is simply dum...')).toBeInTheDocument()
  })

  it('should display tooltip on hover', async () => {
    const handleOnSelect = jest.fn()
    const { getAllByText, getByText } = render(
      <Multiselect
        options={['Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'React', 'Angular', 'Vue'].map((item) => ({
          value: item,
        }))}
        values={[{ value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry' }]}
        onSelect={handleOnSelect}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        labelText='Search text'
        uniqueKey='value'
        labelFloat
        showTooltip
      />
    )
    fireEvent.mouseOver(getByText('Lorem Ipsum is simp...'))
    await waitFor(() => expect(getAllByText('Lorem Ipsum is simply dummy text of the printing and typesetting industry')).toHaveLength(2))
  })

  it('should not sort options when shouldSortOnSelect is false', () => {
    const { container, getByText } = render(
      <Multiselect
        options={['Vue', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'React', 'Angular'].map((item) => ({
          value: item,
        }))}
        values={[{ value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry' }]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        labelText='Search text'
        uniqueKey='value'
        labelFloat
        showTooltip
        shouldSortOnSelect={false}
      />
    )
    fireEvent.click(container.querySelector('input'))
    act(() => {
      fireEvent.click(getByText('React'))
    })
    expect(container.getElementsByClassName('multiselect__option')[0]).toHaveTextContent('Vue')
  })

  it('should render values inside container when showValuesInside is true', async () => {
    const { container } = render(
      <Multiselect
        options={['Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Angular', 'Vue'].map((item) => ({
          value: item,
        }))}
        values={[{ value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry' }, { value: 'Vue' }]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        labelText='Search text'
        uniqueKey='value'
        showTooltip
        showValuesInside={true}
      />
    )
    expect(container.getElementsByClassName('multiselect')[0]).toHaveTextContent('Lorem Ipsum is simp...')
  })

  it('should render values inside container when showValuesInside is true and there is no default value', async () => {
    const { getAllByText } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({
          value: item,
        }))}
        values={[]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        placeholder={'Choose some frameworks'}
        labelText='Search text'
        uniqueKey='value'
        showValuesInside={true}
        labelFloat
      />
    )
    expect(getAllByText('Search text')).toHaveLength(2)
  })

  it('should render the custom ValueComponent inside the container when showValuesInside is true ', () => {
    const { getByText, container } = render(
      <Multiselect
        options={['React', 'Angular', 'Vue'].map((item) => ({ value: item }))}
        values={[{ value: 'React' }]}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
        filterBy={'value'}
        uniqueKey='value'
        placeholder={'Choose some frameworks'}
        searchText='Search a framework'
        showValuesInside
        ValueComponent={({ values }) => {
          return (
            <div>
              {values.map((value, index) => (
                <div key={index}>{value.value}</div>
              ))}
            </div>
          )
        }}
      />
    )
    fireEvent.click(container.querySelector('input'))
    act(() => {
      fireEvent.click(getByText('Angular'))
    })
    expect(getByText('Angular')).toBeInTheDocument()
  })
})
