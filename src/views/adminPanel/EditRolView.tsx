import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRoleAPI, updateRoleAPI } from "@/api/AdminAPI.js";
import type { CreateRolFormData } from "@/schemas/typesAdmin.js";
import CrearRolForm from "@/components/adminPanel/CreateRolForm.js";

export default function EditRolView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRolFormData>({
    defaultValues: { name: "" },
  });

  // 🔹 Cargar datos actuales del rol
  const { data, isLoading, isError } = useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      const res = await getRoleAPI(); // obtenemos todos y filtramos
      const found = res.response.find((r: any) => r.id === Number(id));
      if (!found) throw new Error("Rol no encontrado");
      return found;
    },
  });

  useEffect(() => {
    if (data) reset({ name: data.name });
  }, [data, reset]);

  // 🔹 Mutación para actualizar
  const mutation = useMutation({
    mutationFn: (formData: CreateRolFormData) =>
      updateRoleAPI(Number(id), formData),
    onSuccess: (res) => {
      toast.success(res.message || "Rol actualizado correctamente");
      navigate("/rol");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const onSubmit = async (formData: CreateRolFormData) => {
    const confirm = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "Se actualizará la información del rol",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) mutation.mutate(formData);
  };

  if (isLoading) return <p className="text-center mt-10">Cargando rol...</p>;
  if (isError) return <p className="text-center mt-10">Error al cargar el rol</p>;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] bg-clip-text text-transparent mb-3">
            Editar Rol
          </h1>
        </div>

        <div className="mb-6">
          <Link
            to="/rol"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-primary-dark)] font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-[var(--color-bg-secondary)] transition-all duration-200 border border-[var(--color-border-light)]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Regresar
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border-light)] overflow-hidden">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] h-2"></div>
          <form
            className="p-8 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <CrearRolForm register={register} errors={errors} />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] hover:from-[var(--color-primary-darker)] hover:to-[var(--color-primary-dark)] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-[var(--shadow-amber)] transform hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
