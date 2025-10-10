import ServiceRenderer from '@/components/ServiceRenderer';

export default function ServicesPage() {
  // In a real app, you'd get the customer info from authentication
  const customerId = "sample-customer-id";
  const customerEmail = "customer@example.com";
  const customerName = "John Doe";

  return (
    <ServiceRenderer
      customerId={customerId}
      customerEmail={customerEmail}
      customerName={customerName}
    />
  );
}