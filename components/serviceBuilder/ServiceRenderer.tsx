"use client";
import React from 'react';
import { DynamicService, ServiceField } from '@/types/serviceBuilder/types';
import { FormField, FormFieldOption } from '@/types/dynamicTypes/types';
import DynamicForm from '@/components/newdynamics/dynamicForm';

interface ServiceRendererProps {
  service: DynamicService;
  onSubmit?: (data: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

const ServiceRenderer: React.FC<ServiceRendererProps> = ({
  service,
  onSubmit,
  onError,
  className = ""
}) => {
  // Convert ServiceField to FormField
  const convertToFormFields = (serviceFields: ServiceField[]): FormField[] => {
    return serviceFields.map(field => {
      const formField: FormField = {
        name: field.name,
        label: field.label,
        type: mapFieldType(field.type),
        placeholder: field.placeholder,
        isRequired: field.required || false,
        validation: convertValidation(field),
        disabled: false,
      };

      // Add options for select/multiselect fields
      if (field.options && (field.type === 'select' || field.type === 'multiselect')) {
        formField.options = field.options.map(option => ({
          label: option.value,
          value: option.key
        })) as FormFieldOption[];
      }

      // Add conditional display logic
      if (field.showIf) {
        formField.dependsOn = {
          field: field.showIf.field,
          operator: 'eq',
          value: field.showIf.value
        };
      }

      // Set default value
      if (field.defaultValue !== undefined) {
        formField.defaultValue = field.defaultValue;
      }

      return formField;
    });
  };

  // Map ServiceField types to FormField types
  const mapFieldType = (serviceType: ServiceField['type']): FormField['type'] => {
    const typeMap: Record<ServiceField['type'], FormField['type']> = {
      'string': 'text',
      'number': 'number',
      'boolean': 'checkbox',
      'select': 'select',
      'multiselect': 'multiselect',
      'textarea': 'textarea',
      'file': 'file',
      'date': 'date',
      'email': 'email',
      'password': 'password',
      'tel': 'tel'
    };
    
    return typeMap[serviceType] || 'text';
  };

  // Convert validation rules
  const convertValidation = (field: ServiceField) => {
    const validationRules = [];

    if (field.required) {
      validationRules.push({
        type: 'required' as const,
        message: `${field.label} الزامی است`
      });
    }

    if (field.validation) {
      if (field.validation.minLength) {
        validationRules.push({
          type: 'minLength' as const,
          value: field.validation.minLength,
          message: `${field.label} باید حداقل ${field.validation.minLength} کاراکتر باشد`
        });
      }

      if (field.validation.maxLength) {
        validationRules.push({
          type: 'maxLength' as const,
          value: field.validation.maxLength,
          message: `${field.label} باید حداکثر ${field.validation.maxLength} کاراکتر باشد`
        });
      }

      if (field.validation.min !== undefined) {
        validationRules.push({
          type: 'min' as const,
          value: field.validation.min,
          message: `${field.label} باید حداقل ${field.validation.min} باشد`
        });
      }

      if (field.validation.max !== undefined) {
        validationRules.push({
          type: 'max' as const,
          value: field.validation.max,
          message: `${field.label} باید حداکثر ${field.validation.max} باشد`
        });
      }

      if (field.validation.pattern) {
        validationRules.push({
          type: 'pattern' as const,
          value: field.validation.pattern,
          message: field.validation.message || `${field.label} فرمت صحیحی ندارد`
        });
      }
    }

    return validationRules;
  };

  const formFields = convertToFormFields(service.fields);

  const handleSuccess = (data: any) => {
    if (onSubmit) {
      // Add service information to the submitted data
      const enrichedData = {
        serviceId: service._id,
        serviceName: service.title,
        serviceSlug: service.slug,
        serviceFee: service.fee,
        userInputs: data.data || data,
        totalAmount: service.fee
      };
      onSubmit(enrichedData);
    }
  };

  const handleError = (error: any) => {
    if (onError) {
      onError(error);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Service Header */}
      <div className="mb-6 text-center">
        {service.image && (
          <img 
            src={service.image} 
            alt={service.title}
            className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-white/20"
          />
        )}
        
        <div className="flex items-center justify-center gap-3 mb-2">
          {service.icon && <span className="text-3xl">{service.icon}</span>}
          <h2 className="text-2xl font-bold text-[#0A1D37]">{service.title}</h2>
        </div>
        
        {service.description && (
          <p className="text-[#0A1D37]/70 mb-4">{service.description}</p>
        )}
        
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="bg-white/10 px-3 py-1 rounded-full border border-white/20">
            <span className="text-[#0A1D37]/90">هزینه: </span>
            <span className="font-medium text-[#0A1D37]">
              {service.fee.toLocaleString('fa-IR')} تومان
            </span>
          </div>
          
          {service.wallet && (
            <div className="bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/30">
              <span className="text-purple-200">نیاز به کیف پول</span>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Form */}
      <DynamicForm
        title={`درخواست ${service.title}`}
        subtitle="لطفا اطلاعات مورد نیاز را با دقت وارد کنید"
        fields={formFields}
        endpoint="/api/service-requests" // You'll need to create this endpoint
        method="POST"
        submitButtonText="ثبت درخواست"
        cancelButtonText="انصراف"
        onSuccess={handleSuccess}
        onError={handleError}
        resetAfterSubmit={true}
        className={className}
      />
    </div>
  );
};

export default ServiceRenderer;