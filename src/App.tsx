import Navbar from './components/Navbar/Navbar';
import VisaoGeral from './pages/VisaoGeral/VisaoGeral';
import Box from '@mui/material/Box';
import { Routes, Route } from 'react-router-dom'
import Estacoes from './pages/Estacoes/Estacoes';
import Admin from './pages/Admin/Admin';
import Estacao from './pages/Estacao/Estacao';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LocalizationProvider } from '@mui/x-date-pickers';

const queryClient = new QueryClient()

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>

      <QueryClientProvider client={queryClient}>
          <Box sx={{display:"flex", backgroundColor: "#F40006"}}>
            <Navbar/>
            <Routes>
              <Route path='/' element={<VisaoGeral/>}/>
              <Route path='/estacoes' element={<Estacoes/>}/>
              <Route path='/estacao/:weatherStationId' element={<Estacao/>}/>
              <Route path='/admin' element={<Admin/>}/>
            </Routes>
          </Box>
        </QueryClientProvider>  
    </LocalizationProvider>
    
  );
}

export default App;
