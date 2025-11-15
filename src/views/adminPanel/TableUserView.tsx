import { Link } from "react-router-dom";
import { getUserAPI } from "@/api/adminAPIS/UserAPI.js";
import { Pencil, Trash2 } from "lucide-react";
import PaginationComponent from "@/components/utilities-components/PaginationComponent.js";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function UserTableView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // //Look, if we hover over the data, we see the type, but it also says it can be undefined all the way down.
  // That's going to cause problems in the data.map when looping because it says it might be undefined. To fix it, just add a question mark like this: data?.map 
  // However, the documentation recommends performing a validation before the return statement, meaning that if there is data, then perform the return so that it works correctly.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", currentPage, pageSize],
    queryFn: () => getUserAPI(currentPage),
  });

  const handlePageChange = (page: number) => setCurrentPage(page);
  if (isLoading) return <p>Cargando usuarios...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;
  const users = data?.data || [];
  const totalPages = data?.lastPage || 1;

  if(data) return (
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
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.role.name}</td>
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
