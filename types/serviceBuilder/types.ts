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
  defaultValue?: any;
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
    value: any;
  };
  description?: string;
}

export interface DynamicService {
  _id?: string;
  title: string;
  slug: string;
  fee: number;
  wallet: boolean;
  description?: string;
  icon?: string;
  status: "active" | "inactive" | "draft";
  image?: string;
  fields: ServiceField[];
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
}

export interface ServiceRequest {
  serviceId: string;
  serviceName: string;
  userInputs: Record<string, any>;
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}
