"use client";
import React, { useState } from 'react';
import { ServiceBuilderFormData, DynamicService } from '@/types/serviceBuilder/types';
import ServiceBuilder from './ServiceBuilder';
import ServiceList from './ServiceList';
import { useDynamicData } from '@/hooks/useDynamicData';

interface ServiceManagerProps {
  mode?: 'admin' | 'user';
  className?: string;
}

const ServiceManager: React.FC<ServiceManagerProps> = ({
  mode = 'user',
  className = ""
}) => {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedService, setSelectedService] = useState<DynamicService | null>(null);
  
  const { mutate } = useDynamicData({
    endpoint: '/api/dynamicServices',
    page: 1,
    limit: 50
  });

  const handleCreateService = async (data: ServiceBuilderFormData) => {
    try {
      const response = await fetch('/api/dynamicServices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create service');
      }

      const result = await response.json();
      if (result.success) {
        alert('سرویس با موفقیت ایجاد شد');
        setCurrentView('list');
        mutate(); // Refresh the data
      } else {
        throw new Error(result.message || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  };

  const handleUpdateService = async (data: ServiceBuilderFormData) => {
    if (!selectedService?._id) return;

    try {
      const response = await fetch('/api/dynamicServices', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedService._id,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update service');
      }

      const result = await response.json();
      if (result.success) {
        alert('سرویس با موفقیت بروزرسانی شد');
        setCurrentView('list');
        setSelectedService(null);
        mutate(); // Refresh the data
      } else {
        throw new Error(result.message || 'Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  };

  const handleEditService = (service: DynamicService) => {
    setSelectedService(service);
    setCurrentView('edit');
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedService(null);
  };

  if (mode === 'user') {
    // User mode - only show service list for ordering
    return (
      <div className={`w-full ${className}`}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text mb-2">
            سرویس‌های موجود
          </h1>
          <p className="text-white/70">
            سرویس مورد نظر خود را انتخاب کرده و درخواست دهید
          </p>
        </div>
        
        <ServiceList
          filterStatus="active"
          showAsCards={true}
          className={className}
        />
      </div>
    );
  }

  // Admin mode - full management interface
  if (currentView === 'create') {
    return (
      <ServiceBuilder
        onSave={handleCreateService}
        onCancel={handleCancel}
        isEditing={false}
      />
    );
  }

  if (currentView === 'edit' && selectedService) {
    return (
      <ServiceBuilder
        initialData={selectedService}
        onSave={handleUpdateService}
        onCancel={handleCancel}
        isEditing={true}
      />
    );
  }

  // Default list view with admin controls
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text mb-2">
              مدیریت سرویس‌ها
            </h1>
            <p className="text-white/70">
              ایجاد، ویرایش و مدیریت سرویس‌های پویا
            </p>
          </div>
          
          <button
            onClick={() => setCurrentView('create')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            + ایجاد سرویس جدید
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'همه' },
            { key: 'active', label: 'فعال' },
            { key: 'draft', label: 'پیش‌نویس' },
            { key: 'inactive', label: 'غیرفعال' }
          ].map((tab) => (
            <button
              key={tab.key}
              className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AdminServiceList onEdit={handleEditService} />
      </div>
    </div>
  );
};

// Admin service list with edit functionality
const AdminServiceList: React.FC<{ onEdit: (service: DynamicService) => void }> = ({ onEdit }) => {
  const [filterStatus, setFilterStatus] = useState<'active' | 'inactive' | 'draft' | 'all'>('all');
  const { data: services, loading, error, mutate } = useDynamicData({
    endpoint: '/api/dynamicServices',
    filters: filterStatus !== 'all' ? { status: filterStatus } : {},
    page: 1,
    limit: 50
  });

  const handleDelete = async (serviceId: string) => {
    if (!confirm('آیا از حذف این سرویس اطمینان دارید؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/dynamicServices?id=${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('سرویس با موفقیت حذف شد');
        mutate();
      } else {
        alert('خطا در حذف سرویس');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('خطا در حذف سرویس');
    }
  };

  const toggleStatus = async (service: DynamicService) => {
    const newStatus = service.status === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetch('/api/dynamicServices', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: service._id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        mutate();
      } else {
        alert('خطا در تغییر وضعیت');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('خطا در تغییر وضعیت');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/70"></div>
        <span className="mr-3 text-white/70">در حال بارگذاری...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        خطا در بارگذاری سرویس‌ها: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {services.map((service: DynamicService) => (
        <div
          key={service._id}
          className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {service.icon && <span className="text-2xl">{service.icon}</span>}
              <div>
                <h3 className="text-white font-medium text-lg">{service.title}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-white/60 text-sm">
                    {service.fee.toLocaleString('fa-IR')} تومان
                  </span>
                  <span className="text-white/60 text-sm">
                    {service.fields.length} فیلد
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    service.status === 'active' 
                      ? 'bg-green-500/20 text-green-300' 
                      : service.status === 'draft'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {service.status === 'active' ? 'فعال' : 
                     service.status === 'draft' ? 'پیش‌نویس' : 'غیرفعال'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(service)}
                className="px-3 py-1 bg-blue-600/20 text-blue-300 border border-blue-400/30 rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
              >
                ویرایش
              </button>
              <button
                onClick={() => toggleStatus(service)}
                className={`px-3 py-1 rounded-lg transition-colors text-sm ${
                  service.status === 'active'
                    ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-600/30'
                    : 'bg-green-600/20 text-green-300 border border-green-400/30 hover:bg-green-600/30'
                }`}
              >
                {service.status === 'active' ? 'غیرفعال کردن' : 'فعال کردن'}
              </button>
              <button
                onClick={() => handleDelete(service._id!)}
                className="px-3 py-1 bg-red-600/20 text-red-300 border border-red-400/30 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
              >
                حذف
              </button>
            </div>
          </div>
          
          {service.description && (
            <p className="text-white/60 text-sm mt-2 pr-12">
              {service.description}
            </p>
          )}
        </div>
      ))}
      
      {services.length === 0 && (
        <div className="text-center py-12 text-white/50">
          هیچ سرویسی یافت نشد
        </div>
      )}
    </div>
  );
};

export default ServiceManager;