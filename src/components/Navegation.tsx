import { HomeIcon, UserCog, User, HandPlatter } from "lucide-react";
import NavLinkComponent from "@/components/utilities-components/NavLinkComponent.js";

export default function Navegation() {
  return (
    <div className="space-y-1.5">
      <NavLinkComponent url="/dashboard" text="">
        <HomeIcon />
      </NavLinkComponent>
      <>
        <NavLinkComponent url="/user" text="Usuarios">
          <User />
        </NavLinkComponent>

        <NavLinkComponent url="/rol" text="Roles">
          <UserCog />
        </NavLinkComponent>
        <NavLinkComponent url="/order/create" text="Pedidos">
          <HandPlatter />
        </NavLinkComponent>
      </>
    </div>
  );
}
