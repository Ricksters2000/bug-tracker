export class StringifiedData<T> extends String {
  public static create<T>(input: string): StringifiedData<T> {
    return input as any as StringifiedData<T>;
  }

  public static toString(stringifiedData: StringifiedData<any>): string {
    return stringifiedData.toString();
  }
}

export const JSONR = {
  stringify: <T>(data: T, space?: number | string): StringifiedData<T> => {
    return StringifiedData.create<T>(JSON.stringify(data, replacer, space));
  },
  stringifyUntyped: <T>(data: T, space?: number | string): string => {
    return JSON.stringify(data, replacer, space);
  },
  stringifyToBuffer: <T>(data: T): Buffer => {
    return Buffer.from(JSONR.stringifyUntyped(data), `utf8`);
  },
  stringifyWithoutUndefined: <T>(data: T, space?: number | string): StringifiedData<T> => {
    return StringifiedData.create<T>(JSON.stringify(data, replacerWithoutUndefined, space));
  },
  parse: <T>(data: StringifiedData<T>): T => {
    return JSON.parse(StringifiedData.toString(data), reviver) as T;
  },
  parseFromString: <T>(data: string): T => {
    return JSONR.parse(StringifiedData.create<T>(data));
  },
  parseFromBuffer: <T>(buffer: Buffer): T => {
    return JSONR.parse<T>(StringifiedData.create<T>(buffer.toString(`utf8`)));
  },
  formatAndLog: <T>(data: T) => {
    console.log(StringifiedData.create<T>(JSON.stringify(data, replacer, `  `)));
  },
};

const undefinedKey = `$$$undefined`;

// example: https://qa.icopy.site/questions/49087589/use-json-parse-reviver-to-force-value-of-undefined-in-resulting-object-rather-th
// @ts-ignore
const reviver = function (key: string, value: unknown): any {
  if (Array.isArray(value)) {
    // handle undefined in arrays
    return value.map(item => {
      if (item?.[undefinedKey] === true) {
        return undefined;
      }
      return item;
    });
  } else if (isObject(value)) {
    const dateAsNumber = value?.$date ?? value?.$$$date;
    if (!isNaN(dateAsNumber)) {
      return new Date(dateAsNumber);
    }
    // handle undefined in objects
    Object.keys(value).forEach(key => {
      const keyValue = value[key];
      if (keyValue?.[undefinedKey] === true) {
        value[key] = undefined;
      }
    });
  }

  return value;
};

function isObject(item: unknown): item is Record<string, any> {
  return (typeof item === `object` && !Array.isArray(item) && item !== null);
}

// @ts-ignore
const replacer = function (key: string, value: any): any {
  // @ts-ignore
  if (this[key] instanceof Date) {
    // @ts-ignore
    return {$$$date: this[key].getTime()};
  }
  // @ts-ignore
  if (this[key] === undefined) {
    // @ts-ignore
    return {[undefinedKey]: true};
  }
  return value;
};

const replacerWithoutUndefined = function (key: string, value: any): any {
  // @ts-ignore
  if (this[key] instanceof Date) {
    // @ts-ignore
    return {$$$date: this[key].getTime()};
  }
  // @ts-ignore
  if (this[key] === undefined) {
    return;
  }
  return value;
};