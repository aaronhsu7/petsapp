import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { test, expect } from '@jest/globals';
import App from './App';

test('renders without crashing', () => {
  render(<App />);
  const titleElement = screen.getByText(/Pawsome Pet Rater/i);
  expect(titleElement).toBeInTheDocument();
});