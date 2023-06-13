import React from 'react'
import Wizard from './Wizard'
import { render, fireEvent, screen } from '@testing-library/react'

describe('Wizard component', () => {
  
  const props = {
    header : 'Wizard header', 
    subHeader : 'Wizard sub header.',
    finishHandler: ()=>{},
    tabContent : [
    {
      title: 'STEP ONE',
      isEnabled: true,
      nextBtnTitle: 'NEXT',
      previousBtnTitle: 'PREVIOUS',
      setTabStatus : ()=>{},
      isValidated: true,
      content: <div  style={{ color: 'blue', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Content from TAB One</div>
    },
    {
      title: 'STEP TWO',
      isEnabled: true,
      nextBtnTitle: 'NEXT',
      setTabStatus : ()=>{},
      isValidated: true,
      previousBtnTitle: 'PREVIOUS',
      content: <div  style={{ color: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Content from TAB Two</div>
    },
    {
      title: 'STEP THREE',
      isEnabled: true,
      nextBtnTitle: 'FINISH',
      previousBtnTitle: 'PREVIOUS',
      isValidated: true,
      content: <div  style={{ color: 'yellow', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Content from TAB Three</div>
    }]
  };

  it('should render Wizard component header', () => {
    const { getByText } = render(<Wizard {...props}/>)
    expect(getByText('Wizard header')).toBeInTheDocument()
  })

  it('should render Wizard component sub header', () => {
    const { getByText } = render(<Wizard {...props}/>)
    expect(getByText('Wizard sub header.')).toBeInTheDocument()
  })

  it('render NEXT and PREVIOUS button click events', async () => {
    const { getByText } = render(<Wizard {...props}/>)
    // render NEXT button click on tab one
    const nextBtn = screen.getByRole("button", { name: /NEXT/i });
    fireEvent.click(nextBtn)
    expect(getByText('Content from TAB Two')).toBeInTheDocument()

    // render PREVIOUS button click on tab two
    const prevBtn = screen.getByRole("button", { name: /PREVIOUS/i });
    fireEvent.click(prevBtn)
    expect(getByText('Content from TAB One')).toBeInTheDocument()

  })

  it('render TAB click event', async () => {
    const { getByText } = render(<Wizard {...props}/>)
    const stepTwoBtn = screen.getByRole("button", { name: /STEP TWO/i });
    fireEvent.click(stepTwoBtn)
    expect(getByText('Content from TAB Two')).toBeInTheDocument()
  })

  it('render FINISH button click event', async () => {
    const { getByText } = render(<Wizard {...props}/>)
    const stepThreeBtn = screen.getByRole("button", { name: /STEP THREE/i });
    fireEvent.click(stepThreeBtn)
    expect(getByText('Content from TAB Three')).toBeInTheDocument()

    const finishBtn = screen.getByRole("button", { name: /FINISH/i });
    fireEvent.click(finishBtn)
  })
})
