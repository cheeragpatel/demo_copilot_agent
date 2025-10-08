import { describe, it, expect } from 'vitest';
import { Headquarters } from './headquarters';

describe('Headquarters Model', () => {
  it('should define a valid headquarters object with required properties', () => {
    const headquarters: Headquarters = {
      headquartersId: 1,
      name: 'Main HQ',
      description: 'Main headquarters',
      address: '100 Corporate Blvd',
      contactPerson: 'Jane Smith',
      email: 'jane@hq.com',
      phone: '555-0200',
    };

    expect(headquarters.headquartersId).toBe(1);
    expect(headquarters.name).toBe('Main HQ');
    expect(headquarters.address).toBe('100 Corporate Blvd');
  });

  it('should accept all headquarters properties', () => {
    const headquarters: Headquarters = {
      headquartersId: 2,
      name: 'Regional HQ',
      description: 'Regional office',
      address: '200 Regional Ave',
      contactPerson: 'Bob Jones',
      email: 'bob@hq.com',
      phone: '555-0300',
    };

    expect(headquarters.description).toBe('Regional office');
    expect(headquarters.contactPerson).toBe('Bob Jones');
    expect(headquarters.email).toBe('bob@hq.com');
  });
});
