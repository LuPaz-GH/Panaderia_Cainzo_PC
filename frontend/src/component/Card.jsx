// Card.jsx
import React from 'react';

function Card({ id, title, text, image, buttonText, price }) {
  return (
    <div className="card h-100 border-0" 
         style={{ 
           borderRadius: '16px', 
           overflow: 'hidden', 
           transition: 'all 0.3s ease', 
           background: '#fff8f0', 
           boxShadow: '0 4px 12px rgba(139, 90, 43, 0.1)' 
         }} 
         onMouseEnter={(e) => { 
           e.currentTarget.style.transform = 'translateY(-8px)'; 
           e.currentTarget.style.boxShadow = '0 12px 28px rgba(139, 90, 43, 0.2)'; 
         }} 
         onMouseLeave={(e) => { 
           e.currentTarget.style.transform = 'translateY(0)'; 
           e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 90, 43, 0.1)'; 
         }}>
      
      <div style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        height: '240px', 
        background: '#f5e6d3' 
      }}>
        <img 
          src={image} 
          className="card-img-top" 
          alt={title} 
          style={{ 
            height: '100%', 
            width: '100%', 
            objectFit: 'cover', 
            transition: 'transform 0.5s ease' 
          }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'} 
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} 
        />
      </div>

      <div className="card-body p-4 d-flex flex-column">
        <h5 className="card-title mb-2" 
            style={{ 
              fontWeight: '700', 
              fontSize: '1.5rem', 
              color: '#5c3d2e', 
              fontFamily: 'Georgia, serif' 
            }}>
          {title}
        </h5>
        
        {price && (
          <div className="mb-3">
            <span style={{ 
              fontSize: '1.6rem', 
              fontWeight: '700', 
              color: '#d4904e' 
            }}>
              ${price}
            </span>
          </div>
        )}
        
        <p className="card-text mb-4 flex-grow-1" 
           style={{ 
             fontSize: '0.95rem', 
             color: '#7d6658', 
             lineHeight: '1.7' 
           }}>
          {text}
        </p>
        
        <button 
          type="button"
          className="btn w-100" 
          data-bs-toggle="modal" 
          data-bs-target={`#modal-${id}`}
          style={{ 
            background: 'linear-gradient(135deg, #d4904e 0%, #c17a3a 100%)', 
            border: 'none', 
            borderRadius: '10px', 
            padding: '14px 24px', 
            fontWeight: '600', 
            fontSize: '1rem', 
            color: 'white', 
            transition: 'all 0.3s ease', 
            boxShadow: '0 4px 12px rgba(212, 144, 78, 0.3)' 
          }} 
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = 'translateY(-2px)'; 
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 144, 78, 0.4)'; 
            e.currentTarget.style.background = 'linear-gradient(135deg, #c17a3a 0%, #d4904e 100%)'; 
          }} 
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = 'translateY(0)'; 
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 144, 78, 0.3)'; 
            e.currentTarget.style.background = 'linear-gradient(135deg, #d4904e 0%, #c17a3a 100%)'; 
          }}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default Card;