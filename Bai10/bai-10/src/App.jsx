import MainLayout from './components/layout/MainLayout';
import AppRoutes from './router';

const App = () => {
  return (
    <MainLayout>
      {(search) => <AppRoutes search={search} />}
    </MainLayout>
  );
};

export default App;