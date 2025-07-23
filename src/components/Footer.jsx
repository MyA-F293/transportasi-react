import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f0f2f5",
        padding: "2rem 0",
        textAlign: "center",
        fontFamily: "Century Gothic, sans-serif",
        color: "#333",
        borderTop: "1px solid #ddd",
        marginTop: "1rem",
      }}
    >
      <p style={{ fontSize: "1rem", margin: 0 }}>
        <strong>M. Yudi Al Fiqran</strong> <br />
        NIM: 20222205037 <br />
        Mata Kuliah: <em>Riset Operasi</em>
      </p>
    </footer>
  );
};

export default Footer;
