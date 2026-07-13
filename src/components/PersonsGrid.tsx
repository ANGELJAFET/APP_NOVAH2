"use client";

import { Person } from "@/types";

type SortField = "id" | "name";
type SortDir = "asc" | "desc";

interface PersonsGridProps {
  persons: Person[];
  loading: boolean;
  sortBy: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
  onEdit: (id: number) => void;
  onView: (id: number) => void;
  onDelete: (person: Person) => void;
}

function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) {
    return null;
  }
  return <span>{dir === "asc" ? " ▲" : " ▼"}</span>;
}

export function PersonsGrid({
  persons,
  loading,
  sortBy,
  sortDir,
  onSort,
  onEdit,
  onView,
  onDelete,
}: PersonsGridProps) {
  return (
    <div className="overflow-x-auto rounded border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="cursor-pointer select-none px-4 py-2" onClick={() => onSort("id")}>
              ID
              <SortIndicator active={sortBy === "id"} dir={sortDir} />
            </th>
            <th className="px-4 py-2">NIT</th>
            <th className="cursor-pointer select-none px-4 py-2" onClick={() => onSort("name")}>
              Nombre
              <SortIndicator active={sortBy === "name"} dir={sortDir} />
            </th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                Cargando...
              </td>
            </tr>
          )}
          {!loading && persons.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                Sin registros.
              </td>
            </tr>
          )}
          {!loading &&
            persons.map((person) => (
              <tr key={person.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{person.id}</td>
                <td className="px-4 py-2">{person.nit}</td>
                <td className="px-4 py-2">{person.name}</td>
                <td className="space-x-3 px-4 py-2">
                  <button type="button" onClick={() => onEdit(person.id)} className="text-blue-600 hover:underline">
                    Editar
                  </button>
                  <button type="button" onClick={() => onDelete(person)} className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                  <button type="button" onClick={() => onView(person.id)} className="text-gray-600 hover:underline">
                    Ver
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
