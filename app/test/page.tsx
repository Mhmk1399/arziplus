import BankingInfoAdmin from "@/components/admin/users/bankingInfo";
import NationalCredentialAdmin from "@/components/admin/users/nationalCredintial";
import UsersList from "@/components/admin/users/usersList";
import UserWrapper from "@/components/admin/users/userWrapper";
import CustomerRequestsTable from "@/components/customerAdmins/ordersandservices/orderHistory";
import { ServiceManager } from "@/components/admin/services&orders/serviceBuilder";
import React from "react";
import AdminRequestsTable from "@/components/admin/services&orders/AdminRequestsTable";
import ServiceWrapper from "@/components/customerAdmins/ordersandservices/serviceWrapper";
const page = () => {
  return (
    <div className="">
      <ServiceWrapper />
    </div>
  );
};

export default page;
