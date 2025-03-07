// components/Navbar.js
import Link from "next/link";

const Navbar = () => {
  return (
  // using this "style.navbar" you cn reference [const styles > navbar].
    <nav style={styles.navbar}>
      <Link href="/" style={styles.link}>Home</Link>
      <Link href="/upload" style={styles.link}>Upload Resume</Link>
      <Link href="/dashboard" style={styles.link}>Dashboard</Link>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    padding: "15px",
    background: "#0070f3",
    color: "white",
    fontSize: "18px",
  },
  link: {
    color: "white",
    textDecoration: "none",
  }
};

export default Navbar;