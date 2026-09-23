// Body.jsx
import React from 'react';
import Card from './Card';
import Modal from './Modal';

function Body() {
  const productos = [
    {
      id: 1,
      title: "Pan Frances",
      image: "https://i.pinimg.com/736x/fc/d6/57/fcd657339b0799fb167abf5cdda16d1e.jpg",
      buttonText: "VER MAS",
      price: "1200",
      text: "Pan francés recién horneado, crujiente por fuera y suave por dentro."
    },
    {
      id: 2,
      title: "Media Lunas",
      image: "https://i.pinimg.com/736x/39/86/7f/39867fc3c9169b8d94b03345d657e96b.jpg",
      buttonText: "VER MAS",
      price: "1300",
      text: "Medialunas clásicas, perfectas para el desayuno o merienda."
    },
    {
      id: 3,
      title: "Medialuna Con Azucar",
      image: "https://i.pinimg.com/1200x/85/89/b4/8589b4bf34ec837c8e0727aadf178991.jpg",
      price: "1200",
      buttonText: "VER MAS",
      text: "Medialunas dulces con azúcar glaseada, irresistibles."
    },
    {
      id: 4,
      title: "Palmeritas",
      image: "https://i.pinimg.com/736x/ee/ec/9c/eeec9c081ed98ffe5df55de411acae1c.jpg",
      buttonText: "VER MAS",
      price: "1100",
      text: "Palmeritas crocantes con azúcar caramelizada."
    },
    {
      id: 5,
      title: "Galletas",
      image: "https://i.pinimg.com/1200x/d1/d7/96/d1d7967bc56a8c8dbd7928e592262619.jpg",
      buttonText: "VER MAS",
      price: "1400",
      text: "Galletas artesanales recién horneadas con ingredientes de calidad."
    },
    {
      id: 6,
      title: "Alfajores",
      image: "https://i.pinimg.com/1200x/54/43/92/544392c098a5bf8aab447167397e79ec.jpg",
      buttonText: "VER MAS",
      price: "1000",
      text: "Alfajores caseros con dulce de leche y coco."
    },
    {
      id: 7,
      title: "Pan Integral",
      image: "https://i.pinimg.com/1200x/a9/bc/69/a9bc69d047f895a99f878b58a3c36f97.jpg",
      buttonText: "VER MAS",
      price: "2000",
      text: "Pan integral nutritivo con granos y semillas."
    },
    {
      id: 8,
      title: "Pan Lactal",
      image: "https://i.pinimg.com/736x/40/e0/0b/40e00bc32223e19b837d8ec506772e03.jpg",
      buttonText: "VER MAS",
      price: "2100",
      text: "Pan de molde suave y esponjoso para sándwiches."
    },
    {
      id: 9,
      title: "Tortilla",
      image: "https://i.pinimg.com/736x/f7/d5/68/f7d568b826d829db5c0f7114456821da.jpg",
      buttonText: "VER MAS",
      price: "800",
      text: "Tortillas frescas para wraps y tacos."
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="text-center mb-5">
        <h1 style={{ 
          fontFamily: 'Georgia, serif', 
          color: '#5c3d2e',
          fontWeight: '700',
          marginBottom: '15px'
        }}>
          Panificadora Cainzo
        </h1>
        <p className="lead" style={{ color: '#7d6658', fontSize: '1.2rem' }}>
          Pan fresco horneado con amor cada día
        </p>
      </div>

<div className="row g-4">
        {productos.map((producto) => (
          <div key={producto.id} className="col-12 col-sm-6 col-md-4">
            <Card 
              id={producto.id}
              title={producto.title}
              image={producto.image}
              buttonText={producto.buttonText}
              price={producto.price}
              text={producto.text}
            />
          </div>
        ))}
      </div>

      {/* Renderizar todos los modales */}
      {productos.map((producto) => (
        <Modal
          key={`modal-${producto.id}`}
          id={`modal-${producto.id}`}
          title={producto.title}
          text={producto.text}
          image={producto.image}
          price={producto.price}
        />
      ))}
    </div>

  );
}

export default Body;