import React from 'react';

const styles = {
  footer: {
    backgroundColor: '#4c4646',
    color: '#D9D9D9',
    fontSize: '10px',
    height: '82px',
    width: '100%',
    boxSizing: 'border-box',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '0px 0px 8px 8px',
    display: 'block',
  },
  footerText: {
    position: 'relative',
    left: '15px',
    top: '30px',
  },
};

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.footerText}>
        CONTACT
        <br />
        BakeMyBirthday@gmail.com
      </p>
    </footer>
  );
};

export default Footer;
