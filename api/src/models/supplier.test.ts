import { describe, it, expect } from 'vitest';
import { Supplier } from './supplier';

describe('Supplier Model', () => {
  it('should define a valid supplier object with required properties', () => {
    const supplier: Supplier = {
      supplierId: 1,
      name: 'Acme Corp',
      description: 'Office supplies supplier',
      contactPerson: 'John Doe',
      email: 'john@acme.com',
      phone: '555-0100',
    };

    expect(supplier.supplierId).toBe(1);
    expect(supplier.name).toBe('Acme Corp');
    expect(supplier.email).toBe('john@acme.com');
  });

  it('should accept all supplier properties', () => {
    const supplier: Supplier = {
      supplierId: 2,
      name: 'Test Supplier',
      description: 'Test description',
      contactPerson: 'Jane Smith',
      email: 'jane@test.com',
      phone: '555-0200',
    };

    expect(supplier.description).toBe('Test description');
    expect(supplier.contactPerson).toBe('Jane Smith');
    expect(supplier.phone).toBe('555-0200');
  });
});
