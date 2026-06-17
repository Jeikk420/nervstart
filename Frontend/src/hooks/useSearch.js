import axios from "axios";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * 🔎 Custom Hook para búsquedas
 */
export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState("");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSearch = async (searchQuery) => {
    if (!searchQuery?.trim() || loading) return;

    const trimmed = searchQuery.trim();
    setLoading(true);
    setError(null);
    setResults([]);
    setSearched(trimmed);

    // Guardar en historial
    const newHistory = [
      trimmed,
      ...history.filter((h) => h !== trimmed),
    ].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));

    try {
      const res = await axios.post(
        `${API_URL}/buscar`,
        { producto: trimmed },
        { timeout: 600000 }
      );

      const sorted = Object.entries(res.data)
        .filter(([, v]) => v)
        .map(([tienda, data]) => ({
          tienda: tienda.charAt(0).toUpperCase() + tienda.slice(1),
          precioTexto: data.texto,
          precioNumero: data.numero,
        }))
        .sort((a, b) => a.precioNumero - b.precioNumero);

      setResults(sorted);
      if (!sorted.length) {
        setError(
          "Producto no encontrado en ninguna tienda. Intenta con un nombre más corto."
        );
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setError("La búsqueda tardó demasiado. Intenta de nuevo.");
      } else if (err.response) {
        setError(`Error: ${err.response.data?.error || "desconocido"}`);
      } else {
        setError(
          "No se pudo conectar con el servidor. ¿Está corriendo node server.js?"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    searched,
    history,
    clearHistory,
    handleSearch,
  };
}
