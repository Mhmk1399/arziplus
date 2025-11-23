export interface ServiceField {
  name: string;
  label: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "select"
    | "multiselect"
    | "textarea"
    | "file"
    | "date"
    | "email"
    | "password"
    | "tel";
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  pricecondition: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: Array<{
    key: string;
    value: string;
  }>;
  showIf?: {
    field: string;
    value: string;
  };
  description?: string;
}

export interface DynamicService {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  fee: number;
  wallet: boolean;
  description?: string;
  icon?: string;
  status: "active" | "inactive" | "draft";
  image?: string;
  fields: ServiceField[];
  validationeneed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceBuilderFormData {
  title: string;
  slug: string;
  category: string;
  helper: string;
  fee: number;
  wallet: boolean;
  description: string;
  icon: string;
  status: "active" | "inactive" | "draft";
  image: string;
  fields: ServiceField[];
  validationeneed?: boolean;
}

export interface ServiceRequest {
  serviceId: string;
  serviceName: string;
  userInputs: Record<string, string>;
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}
