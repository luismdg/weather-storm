import React, { useState } from "react"
import { MapPin, Wind, ChevronLeft, ChevronRight, MapIcon } from "lucide-react"

function Stat({ label, value }) {
  return (
    <div className="bg-[#024b58]/60 rounded-xl p-3 border border-white/10 text-[#EAF6F6]">
      <div className="text-xs text-[#B2D8D8]">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

const parseDateString = (dateString) => {
  if (!dateString || dateString.length !== 8) {
    return null;
  }
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1;
  const day = parseInt(dateString.substring(6, 8), 10);
  return new Date(year, month, day);
}

const formatDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function Calendar({ activeDate, onDateChange }) {
  const selectedDateObj = parseDateString(activeDate);
  const [displayDate, setDisplayDate] = useState(selectedDateObj || new Date());

  const daysOfWeek = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]
  const year = displayDate.getFullYear()
  const month = displayDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []

  for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`} className="aspect-square" />)

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const isSelected = selectedDateObj 
      ? (selectedDateObj.toDateString() === currentDate.toDateString()) 
      : false;
    
    days.push(
      <button
        key={day}
        onClick={() => {
          const newDateString = formatDateString(currentDate);
          onDateChange(newDateString);
          setDisplayDate(currentDate);
        }}
        className={`aspect-square flex items-center justify-center text-xs rounded-lg ${
          isSelected
            ? "bg-cyan-500 text-white"
            : "text-[#B2D8D8] hover:bg-cyan-500/20 hover:text-white"
        }`}
      >
        {day}
      </button>
    )
  }

  return (
    <div className="bg-[#024b58]/50 rounded-xl p-3 border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setDisplayDate(new Date(year, month - 1, 1))}>
          <ChevronLeft className="w-4 h-4 text-cyan-400" />
        </button>
        <div className="text-sm font-bold text-[#EAF6F6]">
          {displayDate.toLocaleString("es-ES", { month: "long" })} {year}
        </div>
        <button onClick={() => setDisplayDate(new Date(year, month + 1, 1))}>
          <ChevronRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[#B2D8D8] mb-1 text-[10px]">
        {daysOfWeek.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  )
}

export default function DashboardSidebar({ view, setView, mainStormView, activeStorms, activeDate, onDateChange }) {
  const severeStorms = activeStorms.filter((s) => (s.categoria || s.category || 0) >= 3).length
  const warningStorms = activeStorms.filter((s) => s.status === "warning" || s.estado === "warning").length

  return (
    <aside className="h-full bg-gradient-to-b from-[#024b58] via-[#013f4e] to-[#002b36] flex flex-col border-l border-white/10 p-4 overflow-y-auto hide-scrollbar">
      <div className="flex gap-2 mb-4 flex-shrink-0">
        <button
          onClick={() => setView("map")}
          className={`flex-1 p-2 rounded-xl border ${
            view === "map"
              ? "bg-gradient-to-br from-cyan-500 to-teal-600 text-white border-cyan-300"
              : "bg-[#024b58] text-slate-200 border-white/10"
          }`}
        >
          <MapIcon className="w-4 h-4 inline mr-1" /> Mapa
        </button>
        <button
          onClick={() => setView("dashboard")}
          className={`flex-1 p-2 rounded-xl border ${
            view === "dashboard"
              ? "bg-gradient-to-br from-cyan-500 to-teal-600 text-white border-cyan-300"
              : "bg-[#024b58] text-slate-200 border-white/10"
          }`}
        >
          <Wind className="w-4 h-4 inline mr-1" /> Tormentas
        </button>
      </div>

      <div className="space-y-3 mb-6 flex-shrink-0">
        <Stat label="Tormentas Activas" value={activeStorms.length} />
        <Stat label="Tormentas Severas (Cat 3+)" value={severeStorms} />
        <Stat label="Alertas" value={warningStorms} />
      </div>

      {/* CALENDARIO */}
      <div className="mb-6 flex-shrink-0">
        <Calendar 
          activeDate={activeDate} 
          onDateChange={onDateChange} 
        />
      </div>

      {mainStormView && (
        <div className="mb-6 flex-shrink-0">
          <h3 className="text-sm font-bold text-[#EAF6F6] mb-3">Detalles de la Tormenta</h3>
          <div className="space-y-2 text-[#EAF6F6] text-xs">
            <p>Categoría {mainStormView.categoria || mainStormView.category || 'N/A'}</p>
            <p>Viento: {mainStormView.velocidad_viento || mainStormView.windSpeed || 'N/A'} km/h</p>
            <p>Presión: {mainStormView.presion || mainStormView.pressure || 'N/A'} mb</p>
            {(mainStormView.direccion || mainStormView.direction) && (
              <p>Movimiento: {mainStormView.direccion || mainStormView.direction} {mainStormView.velocidad_movimiento || mainStormView.movementSpeed || ''} km/h</p>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}