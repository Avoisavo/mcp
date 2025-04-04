import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Shortcut.module.css';

export default function Shortcut({ onClose, onDrop }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const popupRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    // Get the dragged button ID
    const buttonId = e.dataTransfer.getData('text/plain');
    
    // Call the onDrop callback with the button ID
    if (onDrop) {
      onDrop(buttonId);
    }
    
    // Remove the draggable icon if it exists
    const icon = document.getElementById('draggable-metamask-icon');
    if (icon && icon.parentNode) {
      icon.parentNode.removeChild(icon);
    }
  };

  // Handle direct drop of the icon (without using drag events)
  useEffect(() => {
    const handleMouseUp = (e) => {
      if (!popupRef.current) return;
      
      // Check if the mouseup happened inside the popup
      const rect = popupRef.current.getBoundingClientRect();
      if (
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom
      ) {
        // Check if we have a draggable icon
        const icon = document.getElementById('draggable-metamask-icon');
        if (icon) {
          // Trigger the onDrop with the metamask button ID
          if (onDrop) {
            onDrop('metamask-button');
          }
          
          // Remove the icon
          if (icon.parentNode) {
            icon.parentNode.removeChild(icon);
          }
        }
      }
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onDrop]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        // Don't close if we're clicking on the draggable icon
        if (event.target.id === 'draggable-metamask-icon') return;
        
        // Also check if we're clicking on the sidebar or its children
        const sidebar = document.getElementById('sidebar');
        if (sidebar && (sidebar === event.target || sidebar.contains(event.target))) {
          onClose();
        } else if (!event.target.closest('#sidebar')) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay}>
      <div 
        ref={popupRef}
        className={`${styles.popup} ${isDraggingOver ? styles.dragOver : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.header}>
          <h3>Drag a shortcut here</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          {isDraggingOver ? (
            <p className={styles.dropMessage}>Drop to create shortcut</p>
          ) : (
            <>
              <div className={styles.iconPlaceholder}>
                <span className={styles.plusIcon}>+</span>
              </div>
              <p className={styles.instructions}>Drag a button from the sidebar to create a shortcut</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
