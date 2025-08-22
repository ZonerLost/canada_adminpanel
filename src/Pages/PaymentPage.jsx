import React from "react";
import PaymentListTable from "../Components/Payments/PaymentsTable";
import StatsOverview from "../Components/dashboard/StatsOverview";

const PaymentPage = () => {
  return (
    <div>
      <StatsOverview />
      <PaymentListTable />
    </div>
  );
};

export default PaymentPage;
