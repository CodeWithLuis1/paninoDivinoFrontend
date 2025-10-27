import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoleAPI, deleteRoleAPI } from "@/api/RoleAPI.js";
import PaginationComponent from "@/components/utilities-components/PaginationComponent.js";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";             // ✅ asegurado
import { toast } from "react-toastify";

export default function TableRoleView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["roles", currentPage, pageSize],
    queryFn: () => getRoleAPI(currentPage),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRoleAPI(id),         // ✅ tipado
    onSuccess: (res) => {
      toast.success(res.message || "Rol eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["roles"] }); // ✅ v5
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar rol?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Cargando roles...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

  const roles = data?.response || [];
  const totalPages = data?.lastPage || 1;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        <div className="table-container">
          <div className="table-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="table-title">Lista de Roles</h2>
            <Link to="/rol/create" className="btn-primary whitespace-nowrap">
              Crear Rol
            </Link>
          </div>

          <div className="overflow-x-auto">
            {roles.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th className="table-cell-center">ID</th>
                    <th>Nombre del Rol</th>
                    <th className="table-cell-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((rol: { id: number; name: string }) => (
                    <tr key={rol.id}>
                      <td className="table-cell-center">{rol.id}</td>
                      <td>{rol.name}</td>
                      <td className="table-cell-center">
                        <div className="table-actions justify-center gap-2">
                          <Link
                            to={`/rol/edit/${rol.id}`}
                            className="btn-icon btn-icon-primary"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            className="btn-icon"
                            style={{ borderColor: "#dc2626", color: "#dc2626" }}
                            onClick={() => handleDelete(rol.id)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-10 text-gray-500">
                No hay roles registrados.
              </p>
            )}
          </div>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
