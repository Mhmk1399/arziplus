# Request Management System

## Overview
Complete request management system with separate interfaces for administrators and customers, featuring pagination, filters, status updates, rejection handling, and customer responses.

## Features

### 🔧 Admin Features (`AdminRequestsTable`)
- **Complete Request Management**: View all service requests across all customers
- **Advanced Filtering**: Filter by status, priority, service type
- **Pagination**: Handle large volumes of requests efficiently  
- **Status Updates**: Change request status with reasons
- **Priority Management**: Set and update request priorities
- **Assignment**: Assign requests to specific administrators
- **Rejection Handling**: Add detailed rejection reasons
- **Admin Notes**: Internal and customer-visible notes
- **Real-time Updates**: Immediate status changes and notifications

### 👤 Customer Features (`CustomerRequestsTable`)
- **Personal Requests**: View only own requests with full details
- **Status Tracking**: Real-time status updates and progress
- **Rejection Response**: Reply to rejection reasons with clarifications
- **Request History**: Complete timeline of request progress
- **Visual Status Indicators**: Color-coded status badges and descriptions
- **Detailed View**: Expandable request details and admin messages
- **New Requests**: Direct link to create new service requests

### 🔄 Request Lifecycle
1. **Creation**: Customer submits request via ServiceRenderer
2. **Review**: Admin reviews and updates status
3. **Processing**: Assignment to specialist and progress tracking
4. **Completion/Rejection**: Final status with reasons/deliverables
5. **Customer Response**: Ability to respond to rejections

## API Endpoints

### Admin Endpoints
- `PUT /api/admin/requests` - Update request status, add notes, handle rejections
- `GET /api/service-requests` - Get all requests with admin privileges

### Customer Endpoints  
- `GET /api/customer/requests` - Get user's own requests
- `POST /api/customer/requests` - Submit response to rejections

## Components

### AdminRequestsTable (`components/admin/AdminRequestsTable.tsx`)
```typescript
interface Props {
  className?: string;
}

// Features:
- Paginated table view
- Status/priority filters  
- Inline editing modal
- Rejection reason handling
- Admin notes with visibility control
- Real-time updates
```

### CustomerRequestsTable (`components/customer/CustomerRequestsTable.tsx`)
```typescript  
interface Props {
  className?: string;
}

// Features:
- Card-based responsive layout
- Personal request filtering
- Status descriptions and timelines
- Rejection response system
- Request detail modals
- New request creation links
```

## Pages

### Admin Page (`/admin/requests`)
- Protected route requiring admin role
- Full AdminRequestsTable integration
- Automatic authentication check and redirect

### Customer Page (`/my-requests`) 
- User-specific request management
- Automatic authentication integration
- Responsive design for all devices

## Request Status Flow

```
pending → in_progress → completed
    ↓         ↓
rejected ← cancelled
    ↓
requires_info (after customer response)
```

## Status Descriptions

| Status | Admin View | Customer View |
|--------|------------|---------------|
| `pending` | Awaiting review | در انتظار بررسی |
| `in_progress` | Being processed | در حال انجام |
| `completed` | Finished successfully | تکمیل شده |
| `rejected` | Rejected with reason | رد شده |
| `cancelled` | Cancelled by admin | لغو شده |
| `requires_info` | Needs more info | نیاز به اطلاعات |

## Usage Examples

### Admin Management
```typescript
import AdminRequestsTable from '@/components/admin/AdminRequestsTable';

<AdminRequestsTable className="custom-styles" />
```

### Customer View
```typescript  
import CustomerRequestsTable from '@/components/customer/CustomerRequestsTable';

<CustomerRequestsTable className="custom-styles" />
```

### Authentication Integration
Both components automatically:
- Check user authentication status
- Verify appropriate permissions (admin vs customer)
- Handle token-based API requests
- Redirect unauthorized users

## Security Features
- Role-based access control
- JWT token authentication
- User-specific data filtering
- Admin note visibility controls
- Secure API endpoints with authorization headers

## Responsive Design
- Mobile-friendly card layouts for customers
- Desktop-optimized table views for admins
- Touch-friendly interaction elements
- Consistent Persian/Farsi RTL support