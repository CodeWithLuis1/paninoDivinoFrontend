// src/components/layout/Navegation.tsx
import { HomeIcon, UserCog, User, HandPlatter, Boxes, Box } from "lucide-react";
import NavLinkComponent from "@/components/utilities-components/NavLinkComponent.js";

export default function Navegation() {
  return (
    <div className="space-y-1.5">
      <NavLinkComponent url="/dashboard" text="">
        <HomeIcon />
      </NavLinkComponent>

      <NavLinkComponent url="/user" text="Usuarios">
        <User />
      </NavLinkComponent>

      <NavLinkComponent url="/rol" text="Roles">
        <UserCog />
      </NavLinkComponent>

      <NavLinkComponent url="/pedidos" text="Pedidos">
        <HandPlatter />
      </NavLinkComponent>

      <NavLinkComponent url="/categories" text="Categorias de productos">
        <Boxes />
      </NavLinkComponent>

      <NavLinkComponent url="/products" text="Productos">
        <Box />
      </NavLinkComponent>

      <NavLinkComponent url="/orders" text="Pedidos">
        <HandPlatter />
      </NavLinkComponent>
    </div>
  );
}
