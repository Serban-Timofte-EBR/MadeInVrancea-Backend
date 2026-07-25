import { ValueTransformer } from 'typeorm';

/**
 * SQL Server returns DECIMAL/NUMERIC columns as strings through the driver.
 * This transformer converts them back to JavaScript numbers so latitude and
 * longitude are serialized as numbers in API responses.
 */
export class ColumnNumericTransformer implements ValueTransformer {
  to(value: number | null): number | null {
    return value;
  }

  from(value: string | null): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    return parseFloat(value);
  }
}
