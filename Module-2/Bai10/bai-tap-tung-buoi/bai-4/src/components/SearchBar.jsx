const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Search products, brands,......"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: "8px 12px",
      width: "100%",
      boxSizing: "border-box",
      borderRadius: 6,
      border: "1px solid #ddd",
      fontSize: 15,
      outline: "none",
    }}
  />
);

export default SearchBar;
