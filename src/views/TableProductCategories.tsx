import { Link } from "react-router-dom";
import PaginationComponent from "@/components/utilities-components/PaginationComponent.js"
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {getCategoriesAPI} from "@/api/ProductCategoriesAPI.js"


export default function TableProductCategories() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", currentPage, pageSize],
    queryFn: () => getCategoriesAPI(currentPage),
  });

  const handlePageChange = (page: number) => setCurrentPage(page);
  if (isLoading) return <p>Cargando categorias...</p>;
  if (isError) return <p>Error al cargar las categorias.</p>;
  const categories = data?.data || [];
  const totalPages = data?.lastPage || 1;

   if(data) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        <div className="table-container">
          <div className="table-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="table-title">Lista de Categorias</h2>
            <Link to="/categories/create" className="btn-primary whitespace-nowrap">
              Crear categoria
            </Link>
          </div>
          <div className="overflow-x-auto">
            {categories.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th className="table-cell-center">Categoría</th>
                    <th className="table-cell-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id_category}>
                      <td className="table-cell-center">{category.id_category}</td>
                      <td className="table-cell-center">{category.name}</td>
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
