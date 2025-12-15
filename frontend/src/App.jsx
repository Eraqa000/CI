import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./routes/PublicLayout";
import PrivateLayout from "./routes/PrivateLayout";
import RequireAuth from "./routes/RequireAuth";
import AdminRoute from "./routes/AdminRoute";


import Home from "./pages/Home";
import AuthContainer from "./components/AuthContainer";  // <-- новый компонент
import Dashboard from "./pages/Dashboard";

// Task1
import Task1Explore from "./pages/task1/ExploreData";
import Task1Compute from "./pages/task1/Compute";
import Task1Results from "./pages/task1/Results";
import Task1Direct from "./pages/task1/DirectPredict";
import Task1Inverse from "./pages/task1/InversePredict";

// Task2
import Task2Explore from "./pages/task2/ExploreData";
import Task2Compute from "./pages/task2/Compute";
import Task2Results from "./pages/task2/Results";

// Task3
import Task3Calc1 from "./pages/task3/Calc1";
import Task3Calc2 from "./pages/task3/Calc2";
import Task3Calc3 from "./pages/task3/Calc3";


import AdminPanel from "./pages/admin/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные страницы */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthContainer />} />
          <Route path="/register" element={<AuthContainer />} />
        </Route>

        {/* Закрытая зона */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <PrivateLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Первая задача */}
          <Route path="task1/explore" element={<Task1Explore />} />
          <Route path="task1/compute" element={<Task1Compute />} />
          <Route path="task1/results" element={<Task1Results />} />
          <Route path="task1/direct" element={<Task1Direct />} />
          <Route path="task1/inverse" element={<Task1Inverse />} />

          {/* Вторая задача */}
          <Route path="task2/explore" element={<Task2Explore />} />
          <Route path="task2/compute" element={<Task2Compute />} />
          <Route path="task2/results" element={<Task2Results />} />

          {/* Третья задача */}
          <Route path="task3/calc1" element={<Task3Calc1 />} />
          <Route path="task3/calc2" element={<Task3Calc2 />} />
          <Route path="task3/calc3" element={<Task3Calc3 />} />


          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Route>

        {/* Редирект на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
