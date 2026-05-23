import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Importações de UI (Se não tiver estes componentes na pasta ui, pode apagar estas linhas e remover as tags lá em baixo)
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";

// Crie estes ficheiros depois na pasta src/pages/ (ou use os que já tem)
import Index from "./pages/index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* Se tiver os componentes de UI, descomente as linhas abaixo */}
    {/* <TooltipProvider> */}
      {/* <Toaster /> */}
      {/* <Sonner /> */}
      
      {/* MUITO IMPORTANTE: O basename TEM de ser o nome do seu repositório no GitHub! */}
      <BrowserRouter basename="/idea-spark"> 
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Adicione outras rotas do PDF aqui em cima */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      
    {/* </TooltipProvider> */}
  </QueryClientProvider>
);

export default App;