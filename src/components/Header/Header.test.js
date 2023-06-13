import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import Header from './index'
import icon from '../../../assets/images/notifications.png'
import svgIcon from '../../../assets/images/home.svg'
import userEvent from '@testing-library/user-event'

const handleNavClick = jest.fn()

const navItems = [
  {
    title: 'Notifications',
    icon,
    onClick: handleNavClick,
    isActive: true,
    badgeContent: '5',
  },
  {
    title: 'Profile',
    isActive: false,
  },
  {
    title: 'Change Language',
    onClick: handleNavClick,
    isActive: false,
    hidden: true,
  },
  {
    component: <div className='external-nav'>External nav Item</div>,
  },
]

const svgNavItems = [
  {
    title: 'Notifications',
    svgIcon,
    onClick: handleNavClick,
    isActive: true,
    badgeContent: '5',
  },
  {
    title: 'Profile',
    isActive: false,
  },
  {
    title: 'Change Language',
    onClick: handleNavClick,
    isActive: false,
    hidden: true,
  },
  {
    component: <div className='external-nav'>External nav Item</div>,
  },
]

const superNavItems = [
  {
    title: 'Purchased History',
    isActive: false,
    onClick: () => {
      jest.fn()
    },
  },
]

describe('Header component', () => {
  it('should render Header component', () => {
    render(<Header superNavItems={superNavItems} brand={icon} />)
    expect(document.getElementsByClassName('header')[0]).toBeInTheDocument()
  })

  it('should show the nav bar when hamburger is clicked', () => {
    const { getByText } = render(<Header navItems={navItems} superNavItems={[{ ...superNavItems[0], isActive: true }]} />)
    userEvent.click(getByText('\u2630'))
    expect(document.getElementsByClassName('header__nav')[0]).not.toHaveClass('header__nav--hidden')
    userEvent.click(getByText('\u2630'))
    expect(document.getElementsByClassName('header__nav')[0]).toHaveClass('header__nav--hidden')
  })

  it('should handle the nav link click event', () => {
    render(<Header navItems={navItems} />)
    userEvent.click(document.getElementsByClassName('active')[0])
    expect(handleNavClick).toHaveBeenCalled()
  })

  it('should handle the nav link click event', () => {
    render(<Header navItems={navItems} />)
    userEvent.click(document.getElementsByClassName('active')[0])
    expect(handleNavClick).toHaveBeenCalled()
  })

  it('should render external nav component', () => {
    const { container } = render(<Header navItems={navItems} />)
    expect(container.getElementsByClassName('external-nav')[0]).toBeInTheDocument()
  })

  it('should render external nav component when svg passed', () => {
    const { container } = render(<Header navItems={svgNavItems} iconType='svg' />)
    expect(container.getElementsByClassName('external-nav')[0]).toBeInTheDocument()
  })
})
