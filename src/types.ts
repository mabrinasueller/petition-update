export interface UpdateFormValues {
  title: string;
  content: string;
  author: string;
}

export type FieldName = keyof UpdateFormValues;

export type FormErrors = Partial<Record<FieldName, string>>;
