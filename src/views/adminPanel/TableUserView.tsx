import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserAPI } from "@/api/AdminAPI.js";
import { Pencil, Trash2 } from "lucide-react";

export default function UserTableView() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUserAPI,
  });

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

  // ✅ Ajuste importante: la API devuelve "data", no "response"
  const users = data?.data || [];

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        <div className="table-container">
          <div className="table-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="table-title">Lista de Usuarios</h2>
            <Link to="/user/create" className="btn-primary whitespace-nowrap">
              Crear usuario
            </Link>
          </div>

          <div className="overflow-x-auto">
            {users.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th className="table-cell-center">Nombre</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Creado el</th>
                    <th className="table-cell-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="table-cell-center">{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.role?.name || "Sin rol"}</td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="table-cell-center">
                        <div className="table-actions justify-center">
                          <button
                            className="btn-icon btn-icon-primary"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="btn-icon"
                            style={{
                              borderColor: "#dc2626",
                              color: "#dc2626",
                            }}
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
                No hay usuarios registrados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
