// src/component/BackgroundImage.jsx
import React from 'react';


const BACKGROUND_IMAGE_URL = '/fondo-inicio.jpg';

function BackgroundImage({ children }) {
    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            width: '100%',
            overflow: 'hidden',
        }}>
            {/* Capa de la imagen de fondo */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1,
            }} />

            {/* Contenido (MenuPrincipal) */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                minHeight: '100vh',
            }}>
                {children}
            </div>
        </div>
    );
}

export default BackgroundImage;
