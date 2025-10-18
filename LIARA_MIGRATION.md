# Liara Object Storage Migration

## Environment Variables to Update

Replace your AWS S3 environment variables with these Liara Object Storage variables:

### Remove these AWS variables:
```
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_CLOUDFRONT_DOMAIN=
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=
```

### Add these Liara variables:
```
# Liara Object Storage Configuration
LIARA_ENDPOINT=https://storage.iran.liara.space
LIARA_BUCKET_NAME=your-bucket-name
LIARA_ACCESS_KEY=your-access-key
LIARA_SECRET_KEY=your-secret-key

# For client-side URL generation
NEXT_PUBLIC_LIARA_BUCKET_NAME=your-bucket-name
```

## How to get Liara credentials:

1. Go to Liara console: https://console.liara.ir/
2. Navigate to Object Storage section
3. Create a new bucket or use existing one
4. Go to bucket settings → Access Keys
5. Create new access key and secret key
6. The endpoint is always: `https://storage.iran.liara.space`
7. Your bucket name will be used to access files via: `https://your-bucket-name.storage.iran.liara.space/file-key`

## Migration Complete!

✅ Updated lib/s3.ts - Now uses Liara Object Storage
✅ Updated app/api/upload/route.ts - Now uploads to Liara
✅ Updated lib/fileUtils.ts - Now generates Liara URLs
✅ Backward compatibility maintained for existing code

## Testing Checklist:

### 1. Environment Setup:
- [ ] Remove AWS environment variables from .env
- [ ] Add Liara environment variables to .env  
- [ ] Update NEXT_PUBLIC_LIARA_BUCKET_NAME for client-side access
- [ ] Restart your development server

### 2. Upload Testing:
- [ ] Test file upload via FileUploaderModal component
- [ ] Verify files appear in Liara Object Storage console
- [ ] Check that uploaded files are accessible via generated URLs
- [ ] Test different file types (images, PDFs, documents)

### 3. API Testing:
- [ ] Test GET /api/upload (service status check)
- [ ] Test POST /api/upload (file upload)
- [ ] Test /api/upload/get-url (pre-signed URL generation)

### 4. Integration Testing:
- [ ] Check that existing file references still work
- [ ] Verify lottery form file uploads work with new system
- [ ] Test any other components using FileUploaderModal

### 5. Performance Check:
- [ ] Verify upload speeds are acceptable
- [ ] Check file accessibility from Iran (Liara servers)
- [ ] Test concurrent uploads

## Rollback Plan:
If you need to rollback to AWS S3:
1. Restore AWS environment variables
2. The code maintains backward compatibility
3. Update bucket references back to AWS_S3_BUCKET

## Files Changed:
- `/lib/s3.ts` - S3 client configuration (now uses Liara)
- `/app/api/upload/route.ts` - Upload API endpoint (now uploads to Liara)
- `/app/api/upload/get-url/route.ts` - Pre-signed URL generation (now uses Liara bucket)
- `/lib/fileUtils.ts` - URL generation utilities (now generates Liara URLs)
- Added backward compatibility aliases for existing code