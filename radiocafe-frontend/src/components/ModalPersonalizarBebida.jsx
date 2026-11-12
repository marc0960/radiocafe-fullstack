import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Check, Plus, Minus } from "lucide-react";
import { obtenerInsumosDisponiblesAgrupados } from "../services/insumosBarraService";

// Ícono SVG de vaso escalable según tamaño (Tall, Grande, Venti)
function IconoVaso({ escala = 1, activo = false }) {
  const ancho = Math.round(28 * escala);
  const alto = Math.round(36 * escala);
  return (
    <svg
      width={ancho}
      height={alto}
      viewBox="0 0 32 42"
      fill="none"
      className="transition-all duration-200"
    >
      <path
        d="M5 9H27L24.5 39H7.5L5 9Z"
        fill={activo ? "#FFF3EB" : "#FFFFFF"}
        stroke={activo ? "#E05600" : "#8C7B75"}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M3 6H29V9H3V6Z"
        fill={activo ? "#E05600" : "#8C7B75"}
        rx="1.5"
      />
      <circle
        cx="16"
        cy="23"
        r="4.5"
        fill={activo ? "#E05600" : "#D6CCC2"}
      />
    </svg>
  );
}

export default function ModalPersonalizarBebida({
  producto,
  abierto,
  onCerrar,
  onAgregarAlCarrito,
}) {
  const [grupos, setGrupos] = useState({
    tamanosVaso: [],
    leches: [],
    endulzantes: [],
    extras: [],
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Selecciones del cliente
  const [vasoId, setVasoId] = useState("");
  const [lecheId, setLecheId] = useState("");
  const [endulzanteId, setEndulzanteId] = useState("");
  const [extrasIds, setExtrasIds] = useState([]);
  const [cantidad, setCantidad] = useState(1);

  // Control de secciones desplegables estilo Starbucks
  const [seccionesAbiertas, setSeccionesAbiertas] = useState({
    leche: true,
    endulzante: true,
    extras: true,
  });

  useEffect(() => {
    if (!abierto || !producto) return;

    let cancelado = false;
    setCargando(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    obtenerInsumosDisponiblesAgrupados()
      .then((data) => {
        if (cancelado) return;

        // Asegurar orden Tall -> Grande (1.50) -> Venti (2.50)
        const vasosAjustados = data.tamanosVaso
          .map((v) => {
            const nombreLower = v.nombre.toLowerCase();
            if (nombreLower.includes("grande")) return { ...v, precioExtra: 1.5 };
            if (nombreLower.includes("venti")) return { ...v, precioExtra: 2.5 };
            return { ...v, precioExtra: Number(v.precioExtra || 0) };
          })
          .sort((a, b) => a.precioExtra - b.precioExtra);

        const datosFinales = { ...data, tamanosVaso: vasosAjustados };
        setGrupos(datosFinales);

        setVasoId(
          vasosAjustados[0]?.idInsumo ? String(vasosAjustados[0].idInsumo) : ""
        );
        setLecheId(
          data.leches[0]?.idInsumo ? String(data.leches[0].idInsumo) : ""
        );
        setEndulzanteId(
          data.endulzantes[0]?.idInsumo ? String(data.endulzantes[0].idInsumo) : ""
        );
        setExtrasIds([]);
        setCantidad(1);
      })
      .catch((err) => {
        if (!cancelado) setError(err.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [abierto, producto]);

  if (!abierto || !producto) return null;

  const vasoSel = grupos.tamanosVaso.find((i) => String(i.idInsumo) === vasoId);
  const lecheSel = grupos.leches.find((i) => String(i.idInsumo) === lecheId);
  const endulzanteSel = grupos.endulzantes.find(
    (i) => String(i.idInsumo) === endulzanteId
  );
  const extrasSel = grupos.extras.filter((i) => extrasIds.includes(i.idInsumo));

  const precioBase = Number(producto.precio || 0);
  const costoVaso = Number(vasoSel?.precioExtra || 0);
  const costoLeche = Number(lecheSel?.precioExtra || 0);
  const costoEndulzante = Number(endulzanteSel?.precioExtra || 0);
  const costoExtras = extrasSel.reduce(
    (acc, item) => acc + Number(item.precioExtra || 0),
    0
  );

  const precioUnitario =
    precioBase + costoVaso + costoLeche + costoEndulzante + costoExtras;
  const subtotal = precioUnitario * cantidad;

  const toggleExtra = (idInsumo) => {
    setExtrasIds((prev) =>
      prev.includes(idInsumo)
        ? prev.filter((id) => id !== idInsumo)
        : [...prev, idInsumo]
    );
  };

  const toggleSeccion = (clave) => {
    setSeccionesAbiertas((prev) => ({ ...prev, [clave]: !prev[clave] }));
  };

  const handleConfirmar = () => {
    const partes = [];
    if (vasoSel) partes.push(`Tamaño: ${vasoSel.nombre}`);
    if (lecheSel) partes.push(`Leche: ${lecheSel.nombre}`);
    if (endulzanteSel) partes.push(`Endulzante: ${endulzanteSel.nombre}`);
    if (extrasSel.length > 0) {
      partes.push(`Extras: ${extrasSel.map((x) => x.nombre).join(", ")}`);
    }

    onAgregarAlCarrito({
      idProducto: producto.idProducto || producto.id,
      nombre: producto.nombre,
      cantidad,
      precioUnitario: Number(precioUnitario.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      personalizacion: partes.join(" | "),
    });
    onCerrar();
  };

  // Imagen del producto (usa producto.imagen si existe, o una ruta en public/assets/)
  const imagenProducto =
    producto.imagen ||
    producto.imagenUrl ||
    `/assets/productos/${(producto.nombre || "cafe")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")}.png`;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#FFFDF9] text-[#2C221E] pb-28">
      {/* Breadcrumb superior estilo Starbucks */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-medium text-neutral-500">
          <button
            type="button"
            onClick={onCerrar}
            className="hover:text-[#E05600] transition-colors font-semibold"
          >
            Menú
          </button>
          <span>›</span>
          <span className="capitalize">{(producto.categoria || "Bebidas").toLowerCase()}</span>
          <span>›</span>
          <span className="text-[#2C221E] font-bold">{producto.nombre}</span>
        </div>

        <button
          type="button"
          onClick={onCerrar}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2C221E] hover:text-[#E05600] bg-neutral-100 hover:bg-orange-50 px-3.5 py-2 rounded-full transition-all"
        >
          <ArrowLeft size={14} />
          <span>Volver al menú</span>
        </button>
      </div>

      {/* Contenedor principal en 2 columnas (Izquierda: Imagen + Descripción | Derecha: Personalización) */}
      <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* COLUMNA IZQUIERDA: Imagen destacada + Título + Descripción */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          <div className="w-full aspect-[4/3] bg-[#F3EFEA] rounded-2xl overflow-hidden flex items-center justify-center border border-neutral-200/70 shadow-sm">
            <img
              src={imagenProducto}
              alt={producto.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-[#2C221E] tracking-tight">
              {producto.nombre}
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {producto.desc ||
                producto.descripcion ||
                "Bebida de especialidad preparada al momento con granos seleccionados y textura cremosa."}
            </p>
            <p className="text-lg font-extrabold text-[#E05600] pt-1">
              Desde S/ {precioBase.toFixed(2)}
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: Personaliza tu producto */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-2xl font-black text-[#2C221E]">
              Personaliza tu producto
            </h2>
            <p className="text-xs text-[#E05600] font-semibold mt-1">
              * Filtros obligatorios
            </p>
          </div>

          {cargando && (
            <p className="text-sm text-neutral-500">Cargando opciones de barra...</p>
          )}
          {error && (
            <p className="text-sm text-red-600 font-semibold">
              Error al cargar insumos: {error}
            </p>
          )}

          {!cargando && !error && (
            <>
              {/* 1. TAMAÑO DE VASO CON ICONOS INTERACTIVOS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                  <span className="text-base font-extrabold text-[#2C221E]">
                    Tamaño <span className="text-[#E05600]">*</span>
                  </span>
                  {vasoSel && (
                    <p className="text-xs font-semibold text-neutral-500 mt-1">
                      {vasoSel.nombre}{" "}
                      <span className="text-[#E05600] font-bold">
                        + S/ {Number(vasoSel.precioExtra).toFixed(2)}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex items-end space-x-5">
                  {grupos.tamanosVaso.map((vaso, idx) => {
                    const seleccionado = String(vaso.idInsumo) === vasoId;
                    const escalas = [0.85, 1.0, 1.18];
                    const escala = escalas[idx] || 1;
                    return (
                      <button
                        key={vaso.idInsumo}
                        type="button"
                        onClick={() => setVasoId(String(vaso.idInsumo))}
                        className="flex flex-col items-center group focus:outline-none"
                      >
                        <div
                          className={`p-2.5 rounded-2xl border-2 transition-all ${
                            seleccionado
                              ? "border-[#E05600] bg-orange-50/70 scale-105 shadow-sm"
                              : "border-transparent hover:bg-neutral-100 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <IconoVaso escala={escala} activo={seleccionado} />
                        </div>
                        <span
                          className={`text-[11px] mt-1.5 font-bold ${
                            seleccionado ? "text-[#E05600]" : "text-neutral-500"
                          }`}
                        >
                          {vaso.nombre.split(" ")[0]}
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-400">
                          {Number(vaso.precioExtra) === 0
                            ? "Incluido"
                            : `+S/ ${Number(vaso.precioExtra).toFixed(2)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. TIPO DE LECHE (Selección con un toque) */}
              <div className="pb-6 border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => toggleSeccion("leche")}
                  className="w-full flex items-center justify-between text-left py-1"
                >
                  <span className="text-base font-extrabold text-[#2C221E]">
                    Tipo de Leche
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-neutral-500 font-semibold">
                    <span>Obligatorio</span>
                    {seccionesAbiertas.leche ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </button>

                {seccionesAbiertas.leche && (
                  <div className="mt-3 space-y-2.5">
                    {grupos.leches.map((leche) => {
                      const activo = String(leche.idInsumo) === lecheId;
                      return (
                        <button
                          key={leche.idInsumo}
                          type="button"
                          onClick={() => setLecheId(String(leche.idInsumo))}
                          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all ${
                            activo
                              ? "border-[#E05600] bg-orange-50/50 shadow-sm"
                              : "border-neutral-200 bg-white hover:border-neutral-300"
                          }`}
                        >
                          <div>
                            <p className="text-sm font-bold text-[#2C221E]">
                              {leche.nombre}
                            </p>
                            <p className="text-xs font-semibold text-neutral-500 mt-0.5">
                              + S/ {Number(leche.precioExtra).toFixed(2)}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              activo
                                ? "bg-[#E05600] border-[#E05600] text-white"
                                : "border-neutral-300"
                            }`}
                          >
                            {activo && <Check size={12} strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. ENDULZANTE (Selección con un toque) */}
              <div className="pb-6 border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => toggleSeccion("endulzante")}
                  className="w-full flex items-center justify-between text-left py-1"
                >
                  <span className="text-base font-extrabold text-[#2C221E]">
                    Endulzante
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-neutral-500 font-semibold">
                    <span>Opcional</span>
                    {seccionesAbiertas.endulzante ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </button>

                {seccionesAbiertas.endulzante && (
                  <div className="mt-3 space-y-2.5">
                    {grupos.endulzantes.map((endulzante) => {
                      const activo = String(endulzante.idInsumo) === endulzanteId;
                      return (
                        <button
                          key={endulzante.idInsumo}
                          type="button"
                          onClick={() => setEndulzanteId(String(endulzante.idInsumo))}
                          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all ${
                            activo
                              ? "border-[#E05600] bg-orange-50/50 shadow-sm"
                              : "border-neutral-200 bg-white hover:border-neutral-300"
                          }`}
                        >
                          <div>
                            <p className="text-sm font-bold text-[#2C221E]">
                              {endulzante.nombre}
                            </p>
                            <p className="text-xs font-semibold text-neutral-500 mt-0.5">
                              + S/ {Number(endulzante.precioExtra).toFixed(2)}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              activo
                                ? "bg-[#E05600] border-[#E05600] text-white"
                                : "border-neutral-300"
                            }`}
                          >
                            {activo && <Check size={12} strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. EXTRAS DE BARRA (Múltiples con un toque) */}
              {grupos.extras.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSeccion("extras")}
                    className="w-full flex items-center justify-between text-left py-1"
                  >
                    <span className="text-base font-extrabold text-[#2C221E]">
                      Extras de Barra
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-neutral-500 font-semibold">
                      <span>Opcional</span>
                      {seccionesAbiertas.extras ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>
                  </button>

                  {seccionesAbiertas.extras && (
                    <div className="mt-3 space-y-2.5">
                      {grupos.extras.map((extra) => {
                        const activo = extrasIds.includes(extra.idInsumo);
                        return (
                          <button
                            key={extra.idInsumo}
                            type="button"
                            onClick={() => toggleExtra(extra.idInsumo)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all ${
                              activo
                                ? "border-[#E05600] bg-orange-50/50 shadow-sm"
                                : "border-neutral-200 bg-white hover:border-neutral-300"
                            }`}
                          >
                            <div>
                              <p className="text-sm font-bold text-[#2C221E]">
                                {extra.nombre}
                              </p>
                              <p className="text-xs font-semibold text-neutral-500 mt-0.5">
                                + S/ {Number(extra.precioExtra).toFixed(2)}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                                activo
                                  ? "bg-[#E05600] border-[#E05600] text-white"
                                  : "border-neutral-300"
                              }`}
                            >
                              {activo && <Check size={12} strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* BARRA INFERIOR FIJA ESTILO STARBUCKS */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-30">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Selector de cantidad */}
          <div className="flex items-center border border-neutral-300 rounded-full px-3 py-1.5 space-x-4">
            <button
              type="button"
              onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              className="text-neutral-600 hover:text-[#E05600] p-1"
            >
              <Minus size={16} />
            </button>
            <span className="font-extrabold text-sm min-w-[20px] text-center">
              {cantidad}
            </span>
            <button
              type="button"
              onClick={() => setCantidad((c) => c + 1)}
              className="text-neutral-600 hover:text-[#E05600] p-1"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Botón Agregar por S/ XX.XX */}
          <button
            type="button"
            onClick={handleConfirmar}
            className="flex-1 max-w-md bg-[#E05600] hover:bg-[#C04800] text-white font-extrabold text-sm py-3.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all text-center"
          >
            Agregar por S/ {subtotal.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}