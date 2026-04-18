import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router'; // Import bộ router của bài 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* RouterProvider là bắt buộc để các Hook như useParams hay useNavigate hoạt động */}
    <RouterProvider router={router} />
  </React.StrictMode>
);