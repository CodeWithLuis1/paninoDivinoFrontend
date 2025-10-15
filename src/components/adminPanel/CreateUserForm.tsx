// import { ErrorMessage } from "../utilities-components/ErrorMessage";

export default function CreateUserForm() {
  return (
    <>
      <div>
        <label htmlFor="userName">Nombre</label>
        <input
          id="userName"
          type="text"
          placeholder="Pedro"
          // {...register("userName")}
        />
        {/* {errors.userName && (
          <ErrorMessage>{errors.userName.message}</ErrorMessage>
        )} */}
      </div>

      <div>
        <label htmlFor="usuario">Usuario</label>
        <input
          id="usuario"
          type="text"
          placeholder="admin"
          // {...register("usuario")}
        />
        {/* {errors.usuario && (
          <ErrorMessage>{errors.usuario.message}</ErrorMessage>
        )} */}
      </div>
      <div>
        <label htmlFor="rol">role</label>
        <select
          id="rol"
          className="w-full p-3 border border-gray-200"
          // {...register("rol")}
        >
          <option value="">Selecciona un rol</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="editor">Editor</option>
        </select>
        {/* {errors.rol && <ErrorMessage>{errors.rol.message}</ErrorMessage>} */}
      </div>
    </>
  );
}