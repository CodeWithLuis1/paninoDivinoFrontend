import { z } from "zod";
//login
export const loginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const loginResponseSchema = z.object({
  statusCode: z.number(),
  id: z.number(),
  name: z.string(),
  username: z.string(),
  role: z.string(),
  token: z.string(),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

//rol
export const createRolSchema = z.object({
  name: z.string().min(1, "El nombre del rol es obligatorio"),
});
export const rolSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export const getRoleSchema = z.object({
  statusCode: z.number(),
  response: z.array(rolSchema),
  page: z.number(),
  total: z.number(),
  lastPage: z.number(),
});
export const backendSuccessSchema = z
  .object({
    statusCode: z.number(),
    message: z.string(),
    data: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .loose()
      .optional(),
  })
  .loose();


export const backendErrorSchema = z.object({
  error: z.string(),
});
export type GetRolesResponse = z.infer<typeof getRoleSchema>;
export type Rol = z.infer<typeof rolSchema>;
export type CreateRolFormData = z.infer<typeof createRolSchema>;
export type BackendSuccess = z.infer<typeof backendSuccessSchema>;
export type BackendError = z.infer<typeof backendErrorSchema>;

// ===========================
// USERS
// ===========================
export const createUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
  roleId: z.number()
});
export type createUserFormData = z.infer<typeof createUserSchema>

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  password: z.string(),
  roleId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const getUserSchema = z.object({
  statusCode: z.number(),
  data: z.array(userSchema),
  total: z.number(),
  limit: z.number().nullable(),
  lastPage: z.number(),
});
export type User = z.infer<typeof userSchema>;
export type GetUsersResponse = z.infer<typeof getUserSchema>;