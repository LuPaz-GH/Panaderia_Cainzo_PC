// Table.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Para el commit
function Tabla({ columns, data, title, actions, onActionClick, onAddClick }) {
  // --- NUEVA FUNCIÓN PARA FORMATEAR FECHAS ---
  const formatDate = (value) => {
    if (!value) return "";
    if (typeof value === "string" && value.includes("T")) {
      return value.split("T")[0];
    }
    return value;
  };

  const rowActions = actions
    ? actions.filter((a) => a.name === "Editar" || a.name === "Eliminar")
    : [];

  const navigationActions = actions
    ? actions.filter((a) => a.name !== "Editar" && a.name !== "Eliminar")
    : [];

  return (
    <div
      className="d-flex justify-content-center align-items-center p-3"
      style={{
        minHeight: "80vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        className="card shadow-lg p-4 w-100"
        style={{
          maxWidth: "1000px",
          borderRadius: "20px",
          background: "white",
        }}
      >
        {/* Título y botón AGREGAR */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <h3
            className="m-0 text-center text-md-start"
            style={{
              color: "#334b2aff",
              fontFamily: "Georgia, serif",
            }}
          >
            {title}
          </h3>

          {onAddClick && (
            <button
              className="btn"
              onClick={onAddClick}
              style={{
                backgroundColor: "#5ff043ff",
                borderColor: "#8a8a8aff",
                color: "white",
                borderRadius: "10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#39b14dff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#5ff043ff")
              }
            >
              ➕
            </button>
          )}
        </div>

        {/* Botones de navegación */}
        {navigationActions.length > 0 && (
          <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2 mb-3">
            {navigationActions.map((action) => (
              <button
                key={action.name}
                className={`btn btn-sm ${action.className}`}
                onClick={() => onActionClick(action.name, null)}
              >
                {action.name}
              </button>
            ))}
          </div>
        )}

        {/* Tabla */}
        <div className="table-responsive">
          <table
            className="table table-hover align-middle text-center"
            style={{
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <thead
              style={{
                background: "linear-gradient(135deg, #d6b894 0%, #caa26e 100%)",
                color: "white",
                fontSize: "1rem",
              }}
            >
              <tr>
                {columns.map((col, index) => (
                  <th key={index} scope="col">
                    {col}
                  </th>
                ))}
                {rowActions.length > 0 && <th scope="col">Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                        }}
                      >
                        {col === "direccion"
                          ? String(row[col])
                              .replace(/[\n\r]+/g, " ")
                              .replace(/\s*,\s*/g, ", ")
                              .trim()
                          : formatDate(row[col])}
                      </td>
                    ))}

                    {rowActions.length > 0 && (
                      <td className="d-flex justify-content-center align-items-center gap-2 flex-nowrap">
                        {rowActions.map((action) => (
                          <button
                            key={action.name}
                            className="btn btn-sm"
                            onClick={() => onActionClick(action.name, row)}
                            style={{
                              padding: "0.35rem 0.7rem",
                              fontWeight: "600",
                              borderRadius: "8px",
                              color: "white",
                              backgroundColor:
                                action.name === "Eliminar"
                                  ? "#dd0e0eff"
                                  : action.name === "Editar"
                                  ? "#041cf1ff"
                                  : action.className,
                              border:
                                action.name === "Eliminar"
                                  ? "1px solid #942424ff"
                                  : "1px solid #131c6dff",
                            }}
                          >
                            {action.name === "Eliminar"
                              ? "🗑️"
                              : action.name === "Editar"
                              ? "✏️"
                              : action.name}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)}
                    className="text-center py-4 text-muted"
                  >
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Tabla;
