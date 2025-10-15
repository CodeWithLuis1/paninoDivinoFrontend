import type { CreateRolFormData } from "@/schemas/typesAdmin.js";
import { ErrorMessage } from "@/components/utilities-components/ErrorMessage.js";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

type RolFormProps = {
  register: UseFormRegister<CreateRolFormData>;
  errors: FieldErrors<CreateRolFormData>;
};

export default function CrearRolForm({ register, errors }: RolFormProps) {
  return (
    <div className="form-container">
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Nombre del Rol
          <span className="required">*</span>
        </label>

        <div className="input-icon-wrapper">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />

          <input
            id="name"
            type="text"
            placeholder="Ej. Administrador, Editor, Usuario"
            className={`form-input ${
              errors.name ? "form-input-error" : "form-input-normal"
            }`}
            {...register("name", {
              required: "El nombre del rol es obligatorio",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 50,
                message: "El nombre no puede exceder 50 caracteres",
              },
            })}
          />
        </div>

        {errors.name && (
          <div className="error-message-container">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
            <ErrorMessage>{errors.name.message}</ErrorMessage>
          </div>
        )}

        <p className="help-text">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Ingresa un nombre descriptivo para identificar este rol
        </p>
      </div>
    </div>
  );
}
