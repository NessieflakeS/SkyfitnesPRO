import { render, screen } from '@testing-library/react'

import { Button } from './index'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Кнопка</Button>)
    expect(screen.getByRole('button', { name: 'Кнопка' })).toBeInTheDocument()
  })
})
