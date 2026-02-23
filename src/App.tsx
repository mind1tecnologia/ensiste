import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout/Layout';

import { Home } from './pages/Home/Home';
import { Executivo } from './pages/Executivo/Executivo';
import { Operacional } from './pages/Operacional/Operacional';
import { Entregaveis } from './pages/Entregaveis/Entregaveis';
import { Destravadores } from './pages/Destravadores/Destravadores';
import { Qualidade } from './pages/Qualidade/Qualidade';
import { Financeiro } from './pages/Financeiro/Financeiro';
import { Automacoes } from './pages/Automacoes/Automacoes';
import { DocumentoDetalhe } from './pages/DocumentoDetalhe/DocumentoDetalhe';
import { PortalCliente } from './pages/PortalCliente/PortalCliente';
import { ControleDocumental } from './pages/ControleDocumental/ControleDocumental';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/executivo" element={<Executivo />} />
            <Route path="/operacional" element={<Operacional />} />
            <Route path="/entregaveis" element={<Entregaveis />} />
            <Route path="/documento/:id" element={<DocumentoDetalhe />} />
            <Route path="/destravadores" element={<Destravadores />} />
            <Route path="/qualidade" element={<Qualidade />} />
            <Route path="/controle-documental" element={<ControleDocumental />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/automacoes" element={<Automacoes />} />
            <Route path="/portal-cliente" element={<PortalCliente />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
