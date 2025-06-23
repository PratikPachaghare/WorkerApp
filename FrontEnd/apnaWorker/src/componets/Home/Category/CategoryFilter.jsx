import React, { useRef } from 'react';
import './CategoryFilter.css';

const categories = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Driver', 'Cook', 'Cleaner', 'AC Mechanic'];

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 100;
    if (direction === 'left') {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-wrapper">
      <button className="scroll-btn left" onClick={() => scroll('left')}>&lt;</button>
      
      <div className="category-scroll w-full" ref={scrollRef}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <button className="scroll-btn right" onClick={() => scroll('right')}>&gt;</button>
    </div>
  );
};

export default CategoryFilter;
