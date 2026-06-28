// A component test, kept here as a template for adding more.
//
// Pattern: render the component, assert what's on screen using
// @testing-library/react queries.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';
import type { User } from '../types';

const baseUser: User = {
  id: 'user_x',
  username: 'x',
  displayName: 'Alice Chen',
  bio: '',
  avatarColor: '#FF0000',
};

describe('Avatar', () => {
  it('renders initials from the display name', () => {
    render(<Avatar user={baseUser} />);
    expect(screen.getByText('AC')).toBeInTheDocument();
  });

  it('uses the user avatarColor as background', () => {
    const { container } = render(<Avatar user={baseUser} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('handles single-word display names', () => {
    render(<Avatar user={{ ...baseUser, displayName: 'Cher' }} />);
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('uses the requested size', () => {
    const { container } = render(<Avatar user={baseUser} size={64} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('64px');
    expect(el.style.height).toBe('64px');
  });
});
