import { describe, it, expect } from 'vitest';
import { Branch } from './branch';

describe('Branch Model', () => {
  it('should define a valid branch object with required properties', () => {
    const branch: Branch = {
      branchId: 1,
      headquartersId: 1,
      name: 'Main Branch',
      description: 'Main branch location',
      address: '123 Main St',
      contactPerson: 'Alice Johnson',
      email: 'alice@branch.com',
      phone: '555-0400',
    };

    expect(branch.branchId).toBe(1);
    expect(branch.headquartersId).toBe(1);
    expect(branch.name).toBe('Main Branch');
  });

  it('should accept all branch properties', () => {
    const branch: Branch = {
      branchId: 2,
      headquartersId: 1,
      name: 'East Branch',
      description: 'Eastern district branch',
      address: '456 East Ave',
      contactPerson: 'Charlie Brown',
      email: 'charlie@branch.com',
      phone: '555-0500',
    };

    expect(branch.description).toBe('Eastern district branch');
    expect(branch.address).toBe('456 East Ave');
    expect(branch.contactPerson).toBe('Charlie Brown');
  });
});
