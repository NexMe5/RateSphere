import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Toast from '../common/Toast';

const PageWrapper = ({ children }) => (
  <div className="page-wrapper">
    <Navbar />
    <div className="page-content">
      <Sidebar />
      <main className="page-main">{children}</main>
    </div>
    <Toast />
  </div>
);

export default PageWrapper;
