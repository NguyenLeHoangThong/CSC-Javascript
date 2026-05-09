const selectStyle = {
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 14,
  background: "#fff",
  cursor: "pointer",
};

const FilterBar = ({ priceRange, onPriceChange, sort, onSortChange }) => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    <div>
      <label style={{ fontSize: 13, color: "#555", marginRight: 6 }}>Price Range:</label>
      <select value={priceRange} onChange={(e) => onPriceChange(e.target.value)} style={selectStyle}>
        <option value="all">All prices</option>
        <option value="under10">Under 10M</option>
        <option value="10to20">10M – 20M</option>
        <option value="over20">Over 20M</option>
      </select>
    </div>

    <div>
      <label style={{ fontSize: 13, color: "#555", marginRight: 6 }}>Sort by:</label>
      <select value={sort} onChange={(e) => onSortChange(e.target.value)} style={selectStyle}>
        <option value="default">Relevance</option>
        <option value="priceAsc">Price low to high</option>
        <option value="priceDesc">Price high to low</option>
      </select>
    </div>
  </div>
);

export default FilterBar;
