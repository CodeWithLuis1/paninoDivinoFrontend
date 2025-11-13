
import { Link } from "react-router-dom";
import PaginationComponent from "@/components/utilities-components/PaginationComponent.js"
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {getIngredientAPI} from "@/api/IngredientsAPI.js"


export default function TableIngredient() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const { data, isLoading, isError } = useQuery({
    queryKey: ["ingredients", currentPage, pageSize],
    queryFn: () => getIngredientAPI(currentPage),
  });

  const handlePageChange = (page: number) => setCurrentPage(page);
  if (isLoading) return <p>Cargando ingredientes...</p>;
  if (isError) return <p>Error al cargar las ingredientes.</p>;
  const ingredients = data?.data || [];
  const totalPages = data?.lastPage || 1;

   if(data) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        <div className="table-container">
          <div className="table-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="table-title">Lista de Ingredientes</h2>
            <Link to="/ingredients/create" className="btn-primary whitespace-nowrap">
              Crear ingrediente
            </Link>
          </div>
          <div className="overflow-x-auto">
            {ingredients.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.ingredient_id}>
                      <td>{ingredient.ingredient_id}</td>
                      <td>{ingredient.ingredient_name}</td>
                      <td>
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
                No hay ingredientes registrados.
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
