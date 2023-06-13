import React from 'react'
import { render } from '@testing-library/react'
import Breadcrumb  from './index'
import homeIcon from '../../../assets/images/home.png'
import { BrowserRouter } from 'react-router-dom';

const routes = [
  {
    key: 'breadcrumb',
    icon: homeIcon,
    label: 'Home',
  }
];

describe('Breadcrumb', () => {
  it('should render', () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/breadcrumb/',
      },
    });
    const { getByText } = render(
      <BrowserRouter>
      <Breadcrumb
        routes={routes}
      />
      </BrowserRouter>
    )
    expect(getByText('Home')).toBeInTheDocument()
  })
})