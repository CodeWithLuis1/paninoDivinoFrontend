import { Link,} from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { useMutation } from "@tanstack/react-query";
// import {CreateUserForm} from "../../components/adminPanel/LoginForm"
import { Pencil, Trash2 } from "lucide-react";


export default function CreateUserView() {
  const roles = [
    { numero: 1, nombre: "Administrador", fecha: "2025-10-01" },
    { numero: 2, nombre: "Usuario", fecha: "2025-09-28" },
    { numero: 3, nombre: "Supervisor", fecha: "2025-09-20" },
    { numero: 4, nombre: "Administrador", fecha: "2025-10-01" },
    { numero: 5, nombre: "Usuario", fecha: "2025-09-28" },
    { numero: 6, nombre: "Supervisor", fecha: "2025-09-20" },
    { numero: 7, nombre: "Administrador", fecha: "2025-10-01" },
    { numero: 8, nombre: "Usuario", fecha: "2025-09-28" },
    { numero: 9, nombre: "Supervisor", fecha: "2025-09-20" },
    { numero: 10, nombre: "Administrador", fecha: "2025-10-01" },
    { numero: 11, nombre: "Usuario", fecha: "2025-09-28" },
    { numero: 12, nombre: "Supervisor", fecha: "2025-09-20" },
    { numero: 13, nombre: "Administrador", fecha: "2025-10-01" },
    { numero: 14, nombre: "Usuario", fecha: "2025-09-28" },
    { numero: 15, nombre: "Supervisor", fecha: "2025-09-20" },
  ];
  return (
    <>
     <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl w-full">
        {/* Contenedor de la tabla */}
        <div className="table-container">
          {/* Header de tabla con botón */}
          <div className="table-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="table-title">Lista de Roles</h2>
            <Link to="/rol/create" className="btn-primary whitespace-nowrap">
              Crear Rol
            </Link>
          </div>

          {/* Wrapper para scroll horizontal en móviles */}
          <div className="overflow-x-auto">
            {/* Tabla */}
            <table className="table">
              <thead>
                <tr>
                  <th className="table-cell-center">ID</th>
                  <th>Nombre del Rol</th>
                  <th className="table-cell-center">Fecha de Creación</th>
                  <th className="table-cell-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((rol) => (
                  <tr key={rol.numero}>
                    <td className="table-cell-center">{rol.numero}</td>
                    <td>{rol.nombre}</td>
                    <td className="table-cell-center">{rol.fecha}</td>
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
                            borderColor: '#dc2626',
                            color: '#dc2626'
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
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
