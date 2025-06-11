'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isLocationPage = pathname.startsWith('/location/');

  useEffect(() => {
    if (isLocationPage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLocationPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  return (
    <header className={`${styles.header} ${isScrolled && !isLocationPage ? styles.scrolled : ''} ${isLocationPage ? styles.static : ''}`}>
      <div className={styles.container}>
        <div className={styles.headerTop}>
          <div className={styles.accommodationTypes}>
            <button className={styles.typeButton}>
              <span className={styles.typeIcon}>🏨</span>
              <span>Hotel</span>
            </button>
            <button className={styles.typeButton}>
              <span className={styles.typeIcon}>🏡</span>
              <span>Pensiune</span>
            </button>
            <button className={styles.typeButton}>
              <span className={styles.typeIcon}>🌲</span>
              <span>Cabana</span>
            </button>
          </div>
        </div>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Unde..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton} aria-label="Search">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={styles.searchIcon}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}

