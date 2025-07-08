// src/App.tsx
import "./App.css"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom"

import Home from "./screens/Home"
import { AuthForm } from "./screens/Login"
import { Layout } from "./screens/Layout"
import PrivateRoute from "./routes/PrivateRoute"
import MyBooks from "./screens/MyBooks"
import { ReadingActivity } from "./screens/Activity"
import { Ratings } from "./screens/Ratings"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/auth"
        element={
          <Layout>
            <AuthForm />
          </Layout>
        }
      />
      <Route element={<PrivateRoute />}>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/library"
          element={
            <Layout>
              <MyBooks />
            </Layout>
          }
        />
        <Route
          path="/activity"
          element={
            <Layout>
              <ReadingActivity />
            </Layout>
          }
        />
        <Route
          path="/ratings"
          element={
            <Layout>
              <Ratings />
            </Layout>
          }
        />
      </Route>
    </>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App