import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Usuarios from "./components/Usuarios";
import UsuarioDetalhe from "./components/UsuarioDetalhe";

export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Usuarios />} />
                <Route path="/usuario/detalhe/:usuarioId" element={<UsuarioDetalhe />} />
            </Routes>
        </BrowserRouter>
    );
}

