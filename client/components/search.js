import React, { useState } from 'react';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };
  return (
    <div>
      <label>Search: </label>
      <input type='text' value={searchValue} onChange={handleSearchInputChange} />
      {searchValue}
    </div>
  );
};

export default Search;
