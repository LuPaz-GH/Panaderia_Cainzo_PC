// Modal.jsx
import React from 'react';

function Modal({ id, title, text, image, price }) {
  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ 
          borderRadius: '20px', 
          overflow: 'hidden',
          border: 'none',
          boxShadow: '0 20px 60px rgba(92, 61, 46, 0.3)'
        }}>
          
          <div className="modal-header" style={{ 
            background: 'linear-gradient(135deg, #fff8f0 0%, #f5e6d3 100%)',
            borderBottom: 'none',
            padding: '24px 30px'
          }}>
            <h5 className="modal-title" id={`${id}Label`} style={{ 
              fontFamily: 'Georgia, serif',
              color: '#5c3d2e',
              fontWeight: '700',
              fontSize: '1.8rem',
              marginBottom: '0'
            }}>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{
                fontSize: '0.9rem',
                opacity: '0.7'
              }}
            ></button>
          </div>
          

          <div className="modal-body" style={{ 
            background: '#fff',
            padding: '0'
          }}>
            <div className="row g-0">

              {image && (
                <div className="col-md-6" style={{ 
                  position: 'relative',
                  minHeight: '300px',
                  background: '#f5e6d3'
                }}>
                  <img 
                    src={image} 
                    alt={title} 
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      minHeight: '300px'
                    }}
                  />
                </div>
              )}
              

              <div className={`col-md-${image ? '6' : '12'}`} style={{ 
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>

                <div>
                  <h6 style={{
                    color: '#d4904e',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '16px'
                  }}>
                    Descripción
                  </h6>
                  <p style={{ 
                    color: '#5c3d2e', 
                    fontSize: '1.05rem', 
                    lineHeight: '1.8',
                    marginBottom: '24px'
                  }}>
                    {text}
                  </p>


                  <div style={{ marginBottom: '24px' }}>
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                      marginBottom: '20px'
                    }}>
                      <span style={{
                        background: '#fff8f0',
                        color: '#5c3d2e',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        ✓ Sin conservantes
                      </span>
                      <span style={{
                        background: '#fff8f0',
                        color: '#5c3d2e',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        ✓ Artesanal
                      </span>
                      <span style={{
                        background: '#fff8f0',
                        color: '#5c3d2e',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        ✓ Ingredientes naturales
                      </span>
                    </div>
                  </div>
                </div>

                {price && (
                  <div style={{
                    background: 'linear-gradient(135deg, #fff8f0 0%, #f5e6d3 100%)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    border: '2px dashed #d4904e'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      <div>
                        <p style={{ 
                          margin: '0', 
                          fontSize: '0.9rem', 
                          color: '#7d6658',
                          fontWeight: '500'
                        }}>
                          Precio
                        </p>
                        <h3 style={{ 
                          color: '#d4904e', 
                          fontWeight: '700',
                          margin: '4px 0 0 0',
                          fontSize: '2.2rem',
                          fontFamily: 'Georgia, serif'
                        }}>
                          ${price}
                        </h3>
                      </div>
                      <div style={{
                        background: 'white',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        🥖
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-footer" style={{ 
            background: 'linear-gradient(135deg, #fff8f0 0%, #f5e6d3 100%)',
            borderTop: 'none',
            padding: '20px 30px',
            gap: '12px'
          }}>
            <button
              type="button"
              className="btn"
              data-bs-dismiss="modal"
              style={{ 
                borderRadius: '10px',
                padding: '12px 24px',
                fontWeight: '600',
                border: '2px solid #d4904e',
                background: 'transparent',
                color: '#d4904e',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d4904e';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#d4904e';
              }}
            >
              Cerrar
            </button>
            <button 
              type="button" 
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #d4904e 0%, #c17a3a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 30px',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(212, 144, 78, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 144, 78, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 144, 78, 0.3)';
              }}
            >
              <span></span>
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;