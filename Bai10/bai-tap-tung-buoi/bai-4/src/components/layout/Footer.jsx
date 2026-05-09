const Footer = () => (
  <footer style={{
    background: "linear-gradient(90deg, #0B74E5 0%, #4f46e5 100%)",
    color: "white",
    textAlign: "center",
    padding: "24px 0 20px 0",
    marginTop: 40,
    position: "relative",
    overflow: "hidden"
  }}>
    <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.15)", left: -40, bottom: -80, zIndex: 0 }} />
    <div style={{ position: "relative", zIndex: 1 }}>
      © 2026 CSC Shop. A marketplace demo powered by Fake Store API.
    </div>
  </footer>
);

export default Footer;
