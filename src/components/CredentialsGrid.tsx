"use client";

import { CREDENTIAL_TYPE_LABELS } from "@/lib/constants";
import { CredentialType } from "@/types";

export interface CredentialRow {
  key: string;
  id?: number;
  type: CredentialType;
  organization: string;
  acquiredCredential: string;
  year: number;
}

interface CredentialsGridProps {
  rows: CredentialRow[];
  readOnly: boolean;
  onAdd: () => void;
  onEdit: (index: number) => void;
  onView: (index: number) => void;
  onDelete: (index: number) => void;
}

export function CredentialsGrid({ rows, readOnly, onAdd, onEdit, onView, onDelete }: CredentialsGridProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="border-b border-gray-200 pb-2 text-sm font-semibold text-gray-700">
          Credenciales educativas
        </h2>
        {!readOnly && (
          <button
            type="button"
            onClick={onAdd}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            Nuevo
          </button>
        )}
      </div>
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Organización</th>
              <th className="px-3 py-2">Título</th>
              <th className="px-3 py-2">Año</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                  Sin credenciales.
                </td>
              </tr>
            )}
            {rows.map((row, index) => (
              <tr key={row.key} className="border-t border-gray-200">
                <td className="px-3 py-2">{row.id ?? "-"}</td>
                <td className="px-3 py-2">{CREDENTIAL_TYPE_LABELS[row.type]}</td>
                <td className="px-3 py-2">{row.organization}</td>
                <td className="px-3 py-2">{row.acquiredCredential}</td>
                <td className="px-3 py-2">{row.year}</td>
                <td className="space-x-3 px-3 py-2">
                  {readOnly ? (
                    <button type="button" onClick={() => onView(index)} className="text-gray-600 hover:underline">
                      Ver
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={() => onEdit(index)} className="text-blue-600 hover:underline">
                        Editar
                      </button>
                      <button type="button" onClick={() => onDelete(index)} className="text-red-600 hover:underline">
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
