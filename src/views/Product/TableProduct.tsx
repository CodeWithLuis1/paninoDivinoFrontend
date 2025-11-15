import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import PaginationComponent from "@/components/utilities-components/PaginationComponent.js";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductsAPI } from "@/api/ProductsAPI.js";

export default function TableProduct() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", currentPage, pageSize],
    queryFn: () => getProductsAPI(currentPage),
  });

  const handlePageChange = (page: number) => setCurrentPage(page);
  if (isLoading) return <p>Cargando productos...</p>;
  if (isError) return <p>Error al cargar los productos</p>;
  const products = data?.data || [];
  const totalPages = data?.lastPage || 1;

  if (data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
        <div className="max-w-6xl w-full">
          <div className="table-container">
            <div className="table-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="table-title">Lista de productos</h2>
              <Link
                to="/products/create"
                className="btn-primary whitespace-nowrap"
              >
                Crear nuevo producto
              </Link>
            </div>
            <div className="overflow-x-auto">
              {products.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th className="table-cell-center">Nombre</th>
                      <th>Descripcion</th>
                      <th>Precio</th>
                      <th>Imagen</th>
                      <th>Estado</th>
                      <th>Categoria</th>
                      <th className="table-cell-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id_product}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.price}</td>
                        <td>
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-16 w-16 object-cover rounded"
                            />
                          ) : (
                            <span>No hay imagen</span>
                          )}
                        </td>

                        <td>
                          {product.active ? (
                            <span className="text-green-600 font-semibold">
                              Activo
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">
                              Inactivo
                            </span>
                          )}
                        </td>
                        <td>{product.id_category}</td>
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
                  No hay productos registrados.
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
