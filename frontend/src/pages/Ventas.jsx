// pages/Ventas.jsx — Punto de venta
import React, { useEffect, useMemo, useState } from "react";
import useVenta from "../hooks/useVenta";
import useProductos from "../hooks/useProductos";
import clienteService from "../services/clienteService";
import { obtenerSesion } from "../services/api";
import { avisar, confirmar, notificar } from "../component/avisos/Avisos";
import "./Ventas.css";

const pesos = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const formatoCantidad = (n) => (Number.isInteger(Number(n)) ? String(Number(n)) : Number(n).toFixed(2));

// Un emoji según el nombre del producto, para que la grilla sea fácil de recorrer
const ICONOS = [
  [/tort(a|as)\b|masas/i, "🎂"],
  [/tarta|pastaflora/i, "🥧"],
  [/alfajor|galleta|polvor|bizcochito|semolada|babyscuit|palmerita/i, "🍪"],
  [/brownie|chocolate/i, "🍫"],
  [/budin|marmolado|vainilla|miloja/i, "🍰"],
  [/factura|medialuna|cañoncito|palmera/i, "🥐"],
  [/tostada/i, "🍞"],
  [/pan|tortilla|bizcocho/i, "🥖"],
];
const iconoProducto = (nombre) => ICONOS.find(([re]) => re.test(nombre))?.[1] ?? "🧁";

const estadoStock = (p) => {
  const cantidad = Number(p.cantidad);
  if (cantidad <= 0) return { clase: "agotado", texto: "Agotado" };
  if (cantidad <= Number(p.cantidad_minima)) return { clase: "bajo", texto: `Quedan ${formatoCantidad(cantidad)}` };
  return { clase: "ok", texto: `Stock ${formatoCantidad(cantidad)}` };
};

const FILTROS = [
  { id: "todos", texto: "Todos" },
  { id: "stock", texto: "Con stock" },
  { id: "bajo", texto: "Stock bajo" },
];

function GestionVentas() {
  const { crearVenta } = useVenta();
  const { products: productos, cargandoInicial, error, fetchProducts } = useProductos();
  const usuario = obtenerSesion();

  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [pagaCon, setPagaCon] = useState("");
  const [cobrando, setCobrando] = useState(false);

  useEffect(() => {
    clienteService.getAll().then((r) => {
      if (r.success) {
        setClientes(r.data);
        if (r.data.length) setClienteId(String(r.data[0].id_cliente));
      }
    });
  }, []);

  const total = carrito.reduce((suma, item) => suma + Number(item.precio_unitario) * item.cantidad, 0);
  const unidades = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const vuelto = Number(pagaCon) - total;

  const productosVisibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return productos.filter((p) => {
      if (texto && !p.nombre.toLowerCase().includes(texto)) return false;
      if (filtro === "stock") return Number(p.cantidad) > 0;
      if (filtro === "bajo") return Number(p.cantidad) > 0 && Number(p.cantidad) <= Number(p.cantidad_minima);
      return true;
    });
  }, [productos, busqueda, filtro]);

  const cantidadEnCarrito = (id) => carrito.find((i) => i.id_producto === id)?.cantidad ?? 0;

  const agregarAlCarrito = (producto) => {
    const stock = Number(producto.cantidad);
    if (stock <= 0) {
      avisar({ tipo: "error", titulo: "Sin stock", destacado: producto.nombre, mensaje: "Este producto está agotado." });
      return;
    }
    if (cantidadEnCarrito(producto.id_producto) + 1 > stock) {
      avisar({ tipo: "info", titulo: "No hay más stock", destacado: producto.nombre, mensaje: `Solo hay ${formatoCantidad(stock)} disponibles.` });
      return;
    }
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id_producto === producto.id_producto);
      if (existe) {
        return prev.map((i) => (i.id_producto === producto.id_producto ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [
        ...prev,
        {
          id_producto: producto.id_producto,
          nombre: producto.nombre,
          precio_unitario: Number(producto.precio_unitario),
          unidad: producto.unidad_medida,
          cantidad: 1,
          stock_disponible: stock,
        },
      ];
    });
  };

  const cambiarCantidad = (id, delta) => {
    const item = carrito.find((i) => i.id_producto === id);
    if (item && delta > 0 && item.cantidad + delta > item.stock_disponible) {
      avisar({ tipo: "info", titulo: "No hay más stock", destacado: item.nombre, mensaje: `Solo quedan ${formatoCantidad(item.stock_disponible)} disponibles.` });
      return;
    }
    setCarrito((prev) =>
      prev
        .map((i) => (i.id_producto === id ? { ...i, cantidad: Math.max(0, i.cantidad + delta) } : i))
        .filter((i) => i.cantidad > 0)
    );
  };

  const quitar = (id) => setCarrito((prev) => prev.filter((i) => i.id_producto !== id));

  const vaciar = async () => {
    const ok = await confirmar({
      tipo: "peligro",
      titulo: "¿Vaciar el ticket?",
      mensaje: "Se van a quitar todos los productos cargados.",
      textoAceptar: "Sí, vaciar",
    });
    if (ok) setCarrito([]);
  };

  const cobrar = async () => {
    if (carrito.length === 0) {
      avisar({ tipo: "info", titulo: "El ticket está vacío", mensaje: "Agregá al menos un producto para cobrar." });
      return;
    }
    if (!clienteId) {
      avisar({ tipo: "info", titulo: "Elegí un cliente", mensaje: "Seleccioná a quién le estás vendiendo." });
      return;
    }
    if (metodoPago === "Efectivo" && pagaCon && vuelto < 0) {
      avisar({ tipo: "info", titulo: "Falta dinero", mensaje: `El cliente paga ${pesos.format(Number(pagaCon))} y el total es ${pesos.format(total)}.` });
      return;
    }

    const cliente = clientes.find((c) => String(c.id_cliente) === clienteId);
    const ok = await confirmar({
      tipo: "exito",
      titulo: "¿Confirmar la venta?",
      destacado: `${pesos.format(total)} · ${metodoPago}`,
      mensaje: `${unidades} ${unidades === 1 ? "unidad" : "unidades"} para ${cliente ? `${cliente.nombre} ${cliente.apellido}` : "el cliente"}.`,
      nota: metodoPago === "Efectivo" && pagaCon ? `Vuelto: ${pesos.format(vuelto)}` : undefined,
      textoAceptar: "Sí, cobrar",
    });
    if (!ok) return;

    setCobrando(true);
    const result = await crearVenta({
      id_cliente: Number(clienteId),
      id_usuario: usuario?.id_usuario,
      total,
      metodo_pago: metodoPago,
      detalle: carrito.map((i) => ({ id_producto: i.id_producto, cantidad: i.cantidad, precio_unitario: i.precio_unitario })),
    });
    setCobrando(false);

    if (result?.success) {
      notificar({
        tipo: "exito",
        titulo: `Venta #${result.id_venta} registrada`,
        mensaje: `${pesos.format(total)} · ${metodoPago}`,
      });
      setCarrito([]);
      setPagaCon("");
      fetchProducts();
    } else {
      avisar({ tipo: "error", titulo: "No se pudo registrar la venta", mensaje: result?.error || "Verificá que el servidor esté prendido." });
    }
  };

  if (cargandoInicial) {
    return <p className="text-center p-5 text-white fs-2">Cargando punto de venta...</p>;
  }

  const hoy = new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="pv-pagina">
      <header className="pv-header">
        <div className="pv-marca">
          <div className="pv-logo" aria-hidden="true">🛒</div>
          <div>
            <h1>Punto de venta</h1>
            <p>
              {usuario ? `Atiende ${usuario.nombre_usuario}` : "Sin sesión"} · <span className="pv-fecha">{hoy}</span>
            </p>
          </div>
        </div>
        <div className="pv-buscar">
          <span aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar producto"
          />
          {busqueda && (
            <button type="button" onClick={() => setBusqueda("")} aria-label="Borrar búsqueda">×</button>
          )}
        </div>
      </header>

      {error && <div className="pv-error">{error}</div>}

      <div className="pv-layout">
        {/* ============ PRODUCTOS ============ */}
        <section className="pv-panel pv-productos" aria-label="Productos">
          <div className="pv-panel-cabecera">
            <h2>Productos</h2>
            <div className="pv-chips" role="group" aria-label="Filtrar productos">
              {FILTROS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`pv-chip ${filtro === f.id ? "activo" : ""}`}
                  onClick={() => setFiltro(f.id)}
                  aria-pressed={filtro === f.id}
                >
                  {f.texto}
                </button>
              ))}
            </div>
          </div>

          {productosVisibles.length === 0 ? (
            <div className="pv-vacio">
              <span aria-hidden="true">🔎</span>
              No hay productos que coincidan.
            </div>
          ) : (
            <div className="pv-grilla">
              {productosVisibles.map((p) => {
                const stock = estadoStock(p);
                const enCarrito = cantidadEnCarrito(p.id_producto);
                return (
                  <button
                    key={p.id_producto}
                    type="button"
                    className={`pv-producto ${stock.clase} ${enCarrito ? "en-carrito" : ""}`}
                    onClick={() => agregarAlCarrito(p)}
                    disabled={stock.clase === "agotado"}
                    aria-label={`Agregar ${p.nombre}, ${pesos.format(p.precio_unitario)}`}
                  >
                    {enCarrito > 0 && <span className="pv-contador">{enCarrito}</span>}
                    <span className="pv-emoji" aria-hidden="true">{iconoProducto(p.nombre)}</span>
                    <span className="pv-nombre">{p.nombre}</span>
                    <span className="pv-precio">
                      {pesos.format(p.precio_unitario)}
                      <small> / {p.unidad_medida}</small>
                    </span>
                    <span className={`pv-stock ${stock.clase}`}>{stock.texto}</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ============ TICKET ============ */}
        <aside className="pv-panel pv-ticket" aria-label="Ticket de venta">
          <div className="pv-panel-cabecera">
            <h2>Ticket</h2>
            {carrito.length > 0 && (
              <button type="button" className="pv-link" onClick={vaciar}>Vaciar</button>
            )}
          </div>

          <label className="pv-campo">
            Cliente
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
              {clientes.length === 0 && <option value="">No hay clientes cargados</option>}
              {clientes.map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
          </label>

          <div className="pv-items">
            {carrito.length === 0 ? (
              <div className="pv-ticket-vacio">
                <span aria-hidden="true">🧾</span>
                <strong>Todavía no hay productos</strong>
                Tocá un producto de la izquierda para agregarlo.
              </div>
            ) : (
              carrito.map((item) => (
                <div key={item.id_producto} className="pv-item">
                  <div className="pv-item-info">
                    <strong>{item.nombre}</strong>
                    <span>{pesos.format(item.precio_unitario)} c/u</span>
                  </div>
                  <div className="pv-stepper" role="group" aria-label={`Cantidad de ${item.nombre}`}>
                    <button type="button" onClick={() => cambiarCantidad(item.id_producto, -1)} aria-label="Quitar uno">−</button>
                    <span>{item.cantidad}</span>
                    <button type="button" onClick={() => cambiarCantidad(item.id_producto, 1)} aria-label="Agregar uno">+</button>
                  </div>
                  <div className="pv-item-total">{pesos.format(item.precio_unitario * item.cantidad)}</div>
                  <button type="button" className="pv-quitar" onClick={() => quitar(item.id_producto)} aria-label={`Quitar ${item.nombre}`}>×</button>
                </div>
              ))
            )}
          </div>

          <div className="pv-resumen">
            <div className="pv-fila">
              <span>{unidades} {unidades === 1 ? "unidad" : "unidades"}</span>
              <span>{carrito.length} {carrito.length === 1 ? "producto" : "productos"}</span>
            </div>
            <div className="pv-total">
              <span>Total</span>
              <strong>{pesos.format(total)}</strong>
            </div>

            <div className="pv-metodos" role="radiogroup" aria-label="Método de pago">
              {[
                { id: "Efectivo", icono: "💵" },
                { id: "Transferencia", icono: "🏦" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={metodoPago === m.id}
                  className={`pv-metodo ${metodoPago === m.id ? "activo" : ""}`}
                  onClick={() => setMetodoPago(m.id)}
                >
                  <span aria-hidden="true">{m.icono}</span> {m.id}
                </button>
              ))}
            </div>

            {metodoPago === "Efectivo" && (
              <div className="pv-efectivo">
                <label className="pv-campo">
                  Paga con
                  <input
                    type="number"
                    min="0"
                    inputMode="decimal"
                    placeholder="$ 0"
                    value={pagaCon}
                    onChange={(e) => setPagaCon(e.target.value)}
                  />
                </label>
                <div className={`pv-vuelto ${pagaCon && vuelto < 0 ? "falta" : ""}`}>
                  <span>{pagaCon && vuelto < 0 ? "Falta" : "Vuelto"}</span>
                  <strong>{pagaCon ? pesos.format(Math.abs(vuelto)) : "—"}</strong>
                </div>
              </div>
            )}

            <button
              type="button"
              className="pv-cobrar"
              onClick={cobrar}
              disabled={carrito.length === 0 || cobrando}
            >
              {cobrando ? "Registrando..." : `Cobrar ${pesos.format(total)}`}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default GestionVentas;
