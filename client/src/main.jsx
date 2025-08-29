import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CurrentExpenses, PreviousExpenses, Export, Account } from './pages/index.js'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <CurrentExpenses />,
      },
      {
        path: 'current-expenses',
        element: <CurrentExpenses />,
      },
      {
        path: 'previous-expenses',
        element: <PreviousExpenses />,
      },
      {
        path: 'export',
        element: <Export />,
      },
      {
        path: 'account',
        element: <Account />,
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
