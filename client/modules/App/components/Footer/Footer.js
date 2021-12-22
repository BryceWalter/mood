import React from 'react';

// Import Style
import styles from './Footer.css';

export function Footer() {
    return (
      <div className={styles.footer}>
        <p>&copy; 2018 &middot; Mood</p>
        <p><a href="https://twitter.com/@mern_io" target="_Blank">Mood</a></p>
      </div>
    );
}

export default Footer;
