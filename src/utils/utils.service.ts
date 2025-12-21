import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  /**
   * Validates option text input.
   * @param {string} str String
   * @returns {string} Converted string
   */
  toCamel = (str: string): string => {
    return str.replace(/_([a-z1-3])/g, (word: string) => word[1].toUpperCase());
  };

  /**
   * Checks object is an actual JavaScript object.
   * @param {any} obj Object to be checked
   * @returns {boolean} Whether object or not
   */
  private isObject = (obj: any): boolean => {
    return (
      obj === Object(obj) &&
      obj instanceof Date === false &&
      !Array.isArray(obj) &&
      typeof obj !== 'function'
    );
  };

  /**
   * Converts object or object array's keys to camel case.
   * @param {any[] | any} obj Object or object array
   * @returns {any[] | any} Converted object or object array
   */
  convertKeysToCamelCase<T>(obj: T): T {
    if (this.isObject(obj)) {
      const newObj: Record<string, unknown> = {};

      Object.keys(obj as object).forEach((key) => {
        const camelKey = this.toCamel(key);
        newObj[camelKey] = this.convertKeysToCamelCase(
          (obj as Record<string, unknown>)[key],
        );
      });

      return newObj as T;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        this.convertKeysToCamelCase(item),
      ) as unknown as T;
    }

    return obj;
  }

  /**
   * Extract property value
   * @param param
   * @returns
   */
  extractValueFromParam(param: string): string | null {
    const value = param
      .match(/\[(.+?)\]/g)
      ?.pop()
      ?.replace(/\[|\]/g, '');
    return value || null;
  }
}
