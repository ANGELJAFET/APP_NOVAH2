"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { clearToken } from "@/lib/auth";
import { PaginatedResult, Person } from "@/types";
import { Alert } from "@/components/Alert";
import { PersonsGrid } from "@/components/PersonsGrid";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { SuccessModal } from "@/components/SuccessModal";

const PAGE_SIZE = 5;

type SortField = "id" | "name";
type SortDir = "asc" | "desc";

export default function PersonsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [result, setResult] = useState<PaginatedResult<Person> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const totalPages = result ? Math.max(1, Math.ceil(result.total / PAGE_SIZE)) : 1;

  const fetchPersons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
        sortBy,
        sortDir,
      });
      if (name.trim()) {
        query.set("name", name.trim());
      }
      const data = await api.get<PaginatedResult<Person>>(`/api/persons?${query.toString()}`);
      setResult(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearToken();
        router.push("/login");
        return;
      }
      setError("No se pudo cargar el listado.");
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortDir, name, router]);

  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  function handleSort(field: SortField) {
    if (field === sortBy) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  function handleNameChange(value: string) {
    setName(value);
    setPage(1);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return;
    }
    try {
      await api.delete(`/api/persons/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchPersons();
      setShowDeleteSuccess(true);
    } catch {
      setError("No se pudo eliminar el registro.");
      setDeleteTarget(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 p-6">
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Filtro por nombre"
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
          className="flex-1 rounded border border-gray-300 bg-white px-3 py-2"
        />
        <button
          type="button"
          onClick={() => router.push("/persons/new")}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Nuevo
        </button>
      </div>

      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <PersonsGrid
        persons={result?.data ?? []}
        loading={loading}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        onEdit={(id) => router.push(`/persons/${id}`)}
        onView={(id) => router.push(`/persons/${id}?mode=view`)}
        onDelete={(person) => setDeleteTarget(person)}
      />

      <div className="mt-4 flex justify-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage(1)}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-40"
        >
          Primero
        </button>
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-40"
        >
          Siguiente
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage(totalPages)}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-40"
        >
          Último
        </button>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar persona"
        message={`¿Está seguro que desea eliminar a "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      <SuccessModal
        open={showDeleteSuccess}
        title="Persona eliminada"
        message="El registro se eliminó correctamente."
        onClose={() => setShowDeleteSuccess(false)}
      />
    </main>
  );
}
