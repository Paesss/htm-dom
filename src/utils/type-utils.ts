type IsBooleanLike<T> = boolean extends T ? true : T extends boolean ? true : false;

type IsWritable<T, K extends keyof T> = { [P in K]: T[P] } extends { -readonly [P in K]: T[P] }
  ? true
  : false;

export type BooleanKeys<T> = T extends unknown
  ? {
      [K in keyof T as string extends K
        ? never
        : number extends K
          ? never
          : IsBooleanLike<T[K]> extends true
            ? IsWritable<T, K> extends true
              ? K
              : never
            : never]: never;
    } extends infer O
    ? keyof O
    : never
  : never;

export type MissingKeys<All extends PropertyKey, Actual extends readonly PropertyKey[]> = Exclude<
  All,
  Actual[number]
>;

export type Assert<T extends true> = T;

export type IsComplete<All extends PropertyKey, Actual extends readonly PropertyKey[]> =
  MissingKeys<All, Actual> extends never ? true : ["Missing keys", MissingKeys<All, Actual>];
