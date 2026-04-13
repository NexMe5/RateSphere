import Table from '../common/Table';
import StarRating from '../common/StarRating';

const columns = [
  { key: 'user', label: 'Customer Name', sortable: true, render: (val) => val?.name },
  { key: 'user', label: 'Email', render: (val) => val?.email },
  { key: 'rating', label: 'Rating', sortable: true,
    render: (val) => <StarRating value={val} readOnly size="sm" /> },
];

const RatersList = ({ raters }) => (
  <div className="raters-list">
    <h3>Customer Ratings</h3>
    <Table columns={columns} data={raters} />
  </div>
);

export default RatersList;
