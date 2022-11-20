import styled from '@emotion/styled'
import { Alert, AlertTitle, Box, CircularProgress, LinearProgress, Snackbar } from '@mui/material'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TWeatherStation } from '../../fetching/types';
import { useQuery } from '@tanstack/react-query';
import { getGlobalData } from '../../fetching/api';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const SearchContainer = styled.div`
    width: 100%;
    margin-bottom: 2rem;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
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

const mapContainerStyle = {
    width: '100%',
    height: '80vh'
};

  
type TAutoCompleteOption = {
    label: string;
    id: number;
}

const Estacoes = () => {

    const navigate = useNavigate()

    // Queries
    const { status: globalDataStatus, data: globalDataData, isFetching: globalDataIsFetching } = useQuery({ queryKey: ['globalData'], queryFn: getGlobalData })


    const stations = globalDataData?.stations

    // State
    const [value, setValue] = useState<TAutoCompleteOption | null>(null);

      // Effects
    useEffect(() => {
        if (value !== null) {
            navigate("/estacao/"+value.id.toString());
        }
    }, [value]);

    const getStationsSearchParams = (stations: TWeatherStation[] | undefined): TAutoCompleteOption[] => {
        if (stations === undefined) {
        return []
        } else {
        return stations.map((station) => {
            return {
            label: station.name,
            id: station.id,
            }
        })
        }
    }

    const getCenterOfMap = (stations: TWeatherStation[] | undefined) => {
        if (stations === undefined) {
            return {
                lat: 0.0,
                lng: 0.0
              };
        } else {
            return {
                lat: stations[0].latitude,
                lng: stations[0].longitude
            };
        }
    }
    
    return (
        <Box sx={{
            flex:"5",
            backgroundColor: "#FAF1F1",
            padding: "40px",
            borderRadius: "32px 0px 0px 32px",
        }}>
            {globalDataStatus === "loading" ? (
                <LinearProgress />
            ) : globalDataStatus === "error" ? (
                <Alert severity="error">
                    <AlertTitle>Erro</AlertTitle>
                    Ocorreu um erro no carregamento de informações do banco de dados
                </Alert>
            ) : (
                <Container>
                    <SearchContainer>
                        <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={getStationsSearchParams(stations)}
                        value={value}
                        onChange={(event: any, newValue: TAutoCompleteOption | null) => {
                            setValue(newValue)
                            
                        }}
                        noOptionsText="Nenhuma estação encontrada"
                        sx={{ width: "100%", backgroundColor: "#FAFAFA" }}
                        renderInput={(params) => <TextField {...params} label="Pesquisar Estação" />}
                        />
                    </SearchContainer>
                    <MapContainer>
                        <LoadScript
                            googleMapsApiKey="AIzaSyAp-ontufi0ZMtNHWBGSGPPos6EUFDmMis"
                        >
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={getCenterOfMap(stations)}
                                zoom={10}
                            >
                            { stations !== undefined && stations.map((station) => {
                                    return (
                                        <Marker position={{
                                            lat: station.latitude,
                                            lng: station.longitude
                                        }}
                                        key={station.id}

                                        title={station.name}
                                        onClick={(e) => {
                                            navigate("/estacao/"+station.id.toString());
                                        }}
                                        />
                                    )
                                }) 
                            }
                        
                            </GoogleMap>
                        </LoadScript>
                    </MapContainer>
                </Container>
            )}
            <Snackbar open={globalDataIsFetching} autoHideDuration={36000} anchorOrigin={
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

export default Estacoes