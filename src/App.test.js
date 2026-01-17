import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Game component to prevent Phaser from initializing in a JSDOM environment
jest.mock('./components/Game', () => () => <div data-testid="game-mock" />);

test('renders the app header and a placeholder for the game', () => {
  render(<App />);

  // Check that the main app header is rendered
  const headerElement = screen.getByText(/Pathfinder: The Pioneer Trail/i);
  expect(headerElement).toBeInTheDocument();

  // Check that our mock component is rendered instead of the real one
  const gameMockElement = screen.getByTestId('game-mock');
  expect(gameMockElement).toBeInTheDocument();
});
