import React from 'react'
import PrimeReact, { addLocale } from 'primereact/api'
import ReactDOM from 'react-dom/client'
import { HashRouter } from "react-router-dom"
import { App } from './App'

import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import 'primereact/resources/themes/mdc-light-indigo/theme.css'
import 'primeflex/primeflex.css'
import './main.css'

PrimeReact.ripple = true;
addLocale('pt-BR', {
  firstDayOfWeek: 1,
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  today: 'Hoje',
  clear: 'Limpar'
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter basename='retiro-convergir'>
      <App />
    </HashRouter>
  </React.StrictMode>
)
