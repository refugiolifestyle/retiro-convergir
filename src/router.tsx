import { Routes as RouteList, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Inscricoes from "./pages/Inscricoes";
import Vendinha from "./pages/Vendinha";
import NovaInscricao from "./pages/NovaInscricao";

export const Routes = () => <RouteList>
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/inscricoes" element={<Inscricoes />} />
    <Route path="/inscricoes/nova" element={<NovaInscricao />} />
    <Route path="/vendinha" element={<Vendinha />} />
</RouteList>;