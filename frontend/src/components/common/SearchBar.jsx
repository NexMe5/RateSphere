import { useState } from 'react';

const SearchBar = ({ placeholder = 'Search...', onSearch, fields = [] }) => {
  const [query, setQuery] = useState('');
  const [field, setField] = useState(fields[0]?.key || '');

  const handleSearch = () => onSearch?.({ [field]: query });

  return (
    <div className="searchbar">
      {fields.length > 1 && (
        <select value={field} onChange={(e) => setField(e.target.value)}>
          {fields.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
      )}
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
