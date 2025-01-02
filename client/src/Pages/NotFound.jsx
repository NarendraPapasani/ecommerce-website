import React from "react";

const NotFound = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#333",
      color: "#fff",
      flexDirection: "column",
    },
    heading: {
      fontSize: "4rem",
      marginBottom: "1rem",
    },
    text: {
      fontSize: "1.5rem",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <p style={styles.text}>Page Not Found</p>
    </div>
  );
};

export default NotFound;
