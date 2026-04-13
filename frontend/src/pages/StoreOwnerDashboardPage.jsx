import PageWrapper from '../components/layout/PageWrapper';
import OwnerDashboard from '../components/storeowner/OwnerDashboard';

const StoreOwnerDashboardPage = () => (
  <PageWrapper>
    <div className="page-header"><h1>My Store Dashboard</h1></div>
    <OwnerDashboard />
  </PageWrapper>
);

export default StoreOwnerDashboardPage;
