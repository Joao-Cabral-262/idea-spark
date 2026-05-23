import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="mt-4">Ups! Esta página não existe.</p>
      <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default NotFound;