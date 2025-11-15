import { Link, useNavigate } from "react-router-dom";
import type { UserFormData } from "@/schemas/typesAdmin.js";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {createUserAPI} from "@/api/adminAPIS/UserAPI.js";
import { toast } from "react-toastify";
import CreateUserForm from "@/components/forms/adminPanel/CreateUserForm.js";

export default function CreateUserView() {
  const navigate = useNavigate();
  const initialValues: UserFormData = { 
    name:"",
    username:"",
    password:"",
    roleId:0
  };

  const {register,handleSubmit,formState: {errors},} = useForm<UserFormData>({defaultValues: initialValues,mode:"all", reValidateMode: "onChange",});
  
  const {mutate} = useMutation({//extract mutate from handleForm
    //call mutationFn to execute the mutation
    mutationFn:createUserAPI,
    onError: (error)=>{
      toast.error(error.message);
    },
    onSuccess:(data)=>{
      //use data.message because the backend response includes a model with a message, we only extract the message
      toast.success(data.message);//data comes from the api response (backend)
      navigate("/user");
    }
  })

  const handleForm = (formData: UserFormData)=>{
    //after passing validation, call the mutation to create the user
    mutate(formData);
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] bg-clip-text text-transparent mb-3">
            Crear Nuevo Usuario
          </h1>
        </div>

        <div className="mb-6">
          <Link
            to="/user"
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
            onSubmit={handleSubmit(handleForm)}
            noValidate
          >
            <CreateUserForm register={register} errors={errors} />
            <input
              type="submit"
              value="Crear Usuario"
              className="w-full bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] hover:from-[var(--color-primary-darker)] hover:to-[var(--color-primary-dark)] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-[var(--shadow-amber)] transform hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide"
            />
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-[var(--color-text-tertiary)]">
          <p>Los cambios se aplicarán inmediatamente después de crear el usuario</p>
        </div>
      </div>
    </div>
  );
}