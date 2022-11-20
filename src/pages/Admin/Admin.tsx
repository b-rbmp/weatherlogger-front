import styled from '@emotion/styled';
import { Alert, AlertTitle, Box, Button, CircularProgress, LinearProgress, Modal, Snackbar, TextField, Typography } from '@mui/material'
import { DataGrid, GridColDef, ptBR} from '@mui/x-data-grid';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWeatherStations, postEstacao } from '../../fetching/api';
import SendIcon from '@mui/icons-material/Send';

const dialogStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: 700,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  bgcolor: 'background.paper',
  borderRadius: "10px",
  boxShadow: 24,
  p: 5,
};

const novaEstacaoLoadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '10px',
  
};

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', width: 300, editable: true},
    {
      field: 'city',
      headerName: 'Cidade',
      width: 200,
      editable: true,
    },
    {
      field: 'country',
      headerName: 'País',
      width: 200,
      editable: true,
    },
    {
      field: 'chaveApi',
      headerName: 'API Key',
      type: 'string',
      width: 200,
      editable: true,
    },
    {
      field: 'latitude',
      headerName: 'Latitude',
      type: 'number',
      width: 125,
      editable: true,      
    },
    {
      field: 'longitude',
      headerName: 'Longitude',
      type: 'number',
      width: 125,
      editable: true,
    },
    {
      field: 'altitude',
      headerName: 'Altitude',
      type: 'number',
      width: 125,
      editable: true,
    },
  ];
  


const Container = styled.div``
const FirstLine = styled.div`
    display: flex;
    margin-bottom: 2rem;
`
const PageTitle = styled.h1`
    flex: 1;
`
const SearchContainer = styled.div`
    flex: 2;
`
const AddWeatherStation = styled.button`
  height: 55px;
  margin-left: 20px;
  margin-right: 20px;
  background: #F40006;
  border: 1px solid #DADADA;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  font-weight: 800;
  transition: all 0.5s ease;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: white;
    color: #F40006;
    border: 1px solid #F40006;
  }
`

const LoadingSnackbarText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start:
  font-size: 16px;
  font-weight: 300;
  color: #0D0D0D0;
  text-align: center;
  align-content: center;
  align-items: center;
  vertical-align: middle;
  gap: 25px;
  padding: 5px;
  height: 100%;
`

type TWeatherStationTableItem = {
  id: number, 
  name: string, 
  city: string, 
  country: string, 
  latitude: number
  longitude: number,
  altitude: number,
  chaveApi: string
}

const Admin = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const [filterValue, setFilterValue] = useState<string | null>("");
  const [addFormChave, setAddFormChave] = useState("");
  const [addFormNome, setAddFormNome] = useState("");
  const [addFormPais, setAddFormPais] = useState("");
  const [addFormCidade, setAddFormCidade] = useState("");
  const [addFormLongitude, setAddFormLongitude] = useState(0.00);

  const [addFormLatitude, setAddFormLatitude] = useState(0.00);
  const [addFormAltitude, setaddFormAltitude] = useState(0.00);

  const queryClient = useQueryClient()
  
  const { status: weatherStationsStatus, data: weatherStationsData, error: weatherStationsError, isFetching: weatherStationsIsFetching } = useQuery({ queryKey: ['weatherStations'], queryFn: getWeatherStations })

  const weatherStationMutation = useMutation({
    mutationFn: postEstacao,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['weatherStations'] })
    },
  })
  
  const filterByName = (weatherStationTableItem: TWeatherStationTableItem) => {
    return (filterValue !== null && weatherStationTableItem.name.toLowerCase().includes(filterValue.toLowerCase()))
  }
  
  const rows: TWeatherStationTableItem[] = weatherStationsData !== undefined ? weatherStationsData?.map((weatherStation) => {
    return {
      id: weatherStation.id, 
      name: weatherStation.name, 
      city: weatherStation.city, 
      country: weatherStation.country, 
      latitude: weatherStation.latitude,
      longitude: weatherStation.longitude,
      altitude: weatherStation.altitude,
      chaveApi: weatherStation.api_key
    }

  }).filter(filterByName) : []
  
  

  return (
    <Box sx={{
        flex:"5",
        backgroundColor: "#FAF1F1",
        padding: "40px",
        borderRadius: "32px 0px 0px 32px",
    }}>
      {weatherStationsStatus === "loading" ? (
          <LinearProgress />
      ) : weatherStationsStatus === "error" ? (
          <Alert severity="error">
              <AlertTitle>Erro</AlertTitle>
              Ocorreu um erro no carregamento de informações do banco de dados
          </Alert>
      ) : (
<Container>
            <FirstLine>
                <PageTitle>Administração</PageTitle>
                <AddWeatherStation onClick={handleModalOpen}>+  Adicionar Estação</AddWeatherStation>
                <Modal
                  open={modalOpen}
                  onClose={handleModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={dialogStyle}>
                    {weatherStationMutation.isLoading ? (
                      <Box sx={novaEstacaoLoadingStyle}>
                          <Typography id="modal-modal-title" variant="h4" component="h2" align="center" marginBottom={2}>
                            Adicionando Estação
                          </Typography>
                          <LinearProgress color="secondary" />
                          <LinearProgress color="success" />
                          <LinearProgress color="info" />
                      </Box> 
                    ) : (
                      <>
                        {weatherStationMutation.isError ? (
                            <Box sx={novaEstacaoLoadingStyle}>
                                <Alert severity="error">
                                    <AlertTitle>Erro</AlertTitle>
                                    Ocorreu um erro na adição de estação
                                </Alert>
                            </Box> 
                        ) : null}

                        {weatherStationMutation.isSuccess ? 
                            <Box sx={novaEstacaoLoadingStyle}>
                              <Alert severity="success">
                                  <AlertTitle>Sucesso!</AlertTitle>
                                  A estação foi adicionada no sistema
                              </Alert>
                            </Box> 
                        : null}

                          <Typography id="modal-modal-title" variant="h5" component="h2" align="center" marginBottom={2}>
                            Adicionar Estação
                          </Typography>
                          <TextField required id="chave-api-input" value={addFormChave} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setAddFormChave(event.target.value)
                          }} label="Chave API" variant="outlined" />
                          <TextField required id="nome-input" value={addFormNome} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setAddFormNome(event.target.value)
                          }} label="Nome" variant="outlined" />
                          <TextField required id="cidade-input" value={addFormCidade} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setAddFormCidade(event.target.value)
                          }} label="Cidade" variant="outlined" />
                          <TextField required id="pais-input" value={addFormPais} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setAddFormPais(event.target.value)
                          }} label="País" variant="outlined" />
                          <TextField required id="latitude" type="number" value={addFormLatitude} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setAddFormLatitude(parseFloat(event.target.value))
                          }} label="Latitude" variant="outlined" />
                          <TextField required id="longitude" type="number" value={addFormLongitude} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setAddFormLongitude(parseFloat(event.target.value))
                          }} label="Longitude" variant="outlined" />
                          <TextField required id="altitude" type="number" value={addFormAltitude} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setaddFormAltitude(parseFloat(event.target.value))
                          }} label="Altitude" variant="outlined" />
                          <Button size="large" color="error" variant="outlined" onClick={() => {
                            weatherStationMutation.mutate({
                              api_key: addFormChave,
                              name: addFormNome,
                              city: addFormCidade,
                              country: addFormPais,
                              latitude: addFormLatitude,
                              longitude: addFormLongitude,
                              altitude: addFormAltitude,
                            })
                          }} endIcon={<SendIcon />}>Adicionar Estação</Button>
                      </>
                    )}
                    
                  </Box>
                </Modal>
                <SearchContainer>
                  <TextField
                      id="searchname"
                      label="Pesquisar Estação"
                      value={filterValue}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setFilterValue(event.target.value)
                      }}
                      sx={{ width: "100%", backgroundColor: "#FAFAFA" }}
                      />
                </SearchContainer>
            </FirstLine>
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight
              pageSize={10}
              rowsPerPageOptions={[7]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
              sx={{backgroundColor: "white"}}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />
        </Container>
      )}
            <Snackbar open={weatherStationsIsFetching} autoHideDuration={36000} anchorOrigin={
                {
                vertical: 'bottom',
                horizontal: 'center',
                }
            }>
                <Alert severity="info" sx={{ width: '100%', height: '100%', alignItems: "center" }}>
                <LoadingSnackbarText>
                    Dados recarregando <CircularProgress />
                </LoadingSnackbarText>
                </Alert>
            </Snackbar>
    </Box>)
}

export default Admin