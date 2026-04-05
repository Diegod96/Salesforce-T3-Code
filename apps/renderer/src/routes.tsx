import { createHashRouter } from "react-router-dom";
import { LogsPage } from "./features/logs/LogsPage";
import { OrgsPage } from "./features/orgs/OrgsPage";
import { ProjectsPage } from "./features/projects/ProjectsPage";
import { ReviewPage } from "./features/review/ReviewPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { TasksPage } from "./features/tasks/TasksPage";
import { AppLayout } from "./routes/AppLayout";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <ProjectsPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "orgs", element: <OrgsPage /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "review", element: <ReviewPage /> },
      { path: "logs", element: <LogsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
