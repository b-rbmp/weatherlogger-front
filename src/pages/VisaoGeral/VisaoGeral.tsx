import styled from '@emotion/styled'
import Box from '@mui/material/Box';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Alert, AlertTitle, Autocomplete, CircularProgress, Grid, LinearProgress, Snackbar, TextField, Tooltip, Typography } from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import CellTowerIcon from '@mui/icons-material/CellTower';
import ImageAspectRatioIcon from '@mui/icons-material/ImageAspectRatio';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Line, LineChart, ResponsiveContainer, Tooltip as TooltipRecharts, XAxis } from 'recharts';
import Co2Icon from '@mui/icons-material/Co2';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import WaterIcon from '@mui/icons-material/Water';
import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGlobalData } from '../../fetching/api';
import moment from 'moment';
import { TEvolucaoConectividade, TWeatherStation } from '../../fetching/types';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const InfoBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`
const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
`

const Tools = styled.div`
  display: flex;
  align-items: center;
`

const ButtonPlacer = styled.div`
  height: 55px;
  width: 55px;
  background: rgba(251, 251, 251, 0.7);
  border: 1px solid #DADADA;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: 20px;
  cursor: pointer;
`

const NotificationCounter = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 0.5px solid white;
  background-color: black;
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AddWeatherStation = styled.button`
  width: 270px;
  height: 55px;
  margin-left: 20px;
  background: #F40006;
  border: 1px solid #DADADA;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  font-weight: 800;
  transition: all 0.5s ease;
  cursor: pointer;

  &:hover {
    background-color: white;
    color: #F40006;
    border: 1px solid #F40006;
  }
`

const Card = styled.div`
  width: 300px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 20px;
  background: rgba(252, 251, 251, 0.7);
  border: 1px solid #DADADA;
  border-radius: 12px;
  margin-top: 5px;
  margin-bottom: 25px;
  transition: all 0.5s ease;

  &:hover {
    transform: scale(1.1);
  }
`
const CardIcon = styled.div`
  font-size: 52px;
  padding-left: 25px;
  flex: 1 1;
`
const CardInfo = styled.div`
  flex: 3 3;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;  
`
const CardNumber = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 1rem;
`
const CardDesc = styled.span`
  color: #5B6C8E;
  font-size: 18px;
  font-weight: 300;
`

const ChartCard = styled.div`
  padding: 30px;
  height: 75%;
  background: rgba(252, 251, 251, 0.7);
  border: 1px solid #DADADA;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`

const ChartName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`

const ChartTitle = styled.h1`
  font-weight: 600;
  font-size: 26px;
`

const ChartLabelArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`
const ChartLabelNumber = styled.span`
  font-weight: 600;
  font-size: 28px;
`

const ChartLabelDesc = styled.span`
  position: absolute;
  top: 38px;
  right: 0px;
  font-size: 16px;
  font-weight: 400;
  color: #8A92A6;
`
const ChartArea = styled.div`
  flex: 6;
  margin-top: 1rem;
`

const MapContainer = styled.div`
  border-radius: 14px;
  height: 100%;
  width: 96%;
  margin-right: 50px;
`


const mapContainerStyle = {
  width: "inherit",
  height: "inherit"
};

const Dashboard = styled.div`
  background: rgba(252, 251, 251, 0.7);
  border: 1px solid #DADADA;
  border-radius: 12px;
`
const DashTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F40006;
  border-radius: 12px 12px 0 0;
  color: #EAEAEA;
  position: relative;
`
const Location = styled.h1`
  font-weight: 500;
  font-size: 26px;
  margin: 20px 0px 20px 40px;
`
const DateTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 25px;
`
const Date = styled.span`
  font-size: 16px;
`
const Time = styled.span`
  font-size: 16px;
`
const CardPlacer = styled.div`
  padding: 10px;
`
const SmallCard = styled.div`
  margin: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid #DADADA;
  border-radius: 12px;
  background: linear-gradient(105.5deg, rgba(244, 0, 6, 0.75) 2.35%, rgba(244, 0, 6, 0.675) 96.62%);
`
const TitleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px; 
`
const SmallCardTitle = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #EAEAEA;
`
const SmallCardIcon = styled.div`
  font-size: 40px;
  color: white;
`
const Description = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: #EAEAEA;
  text-align: center;
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
const SearchContainer = styled.div`
    width: 330px;
`
type TAutoCompleteOption = {
  label: string;
  id: number;
}

type TConectadosRecharts = {
  "Conectados": number,
  "Data": string
}
const VisaoGeral = () => {

  const navigate = useNavigate()


  // Queries
  const { status: globalDataStatus, data: globalDataData, isFetching: globalDataIsFetching } = useQuery({ queryKey: ['globalData'], queryFn: getGlobalData })

  const stations = globalDataData?.stations
  const evolucaoConectividade = globalDataData?.evolucao_conectividade

  // State
  const [value, setValue] = useState<TAutoCompleteOption | null>(null);

  // Effects
  useEffect(() => {
    if (value !== null) {
      navigate("/estacao/"+value.id.toString());
    }
  }, [value]);

  const getFormattedEvolucaoConectividade = (evolucaoConectividade: TEvolucaoConectividade[] | undefined): TConectadosRecharts[] => {
    if (evolucaoConectividade !== undefined) {
      return evolucaoConectividade.map((item) => {
        return {
          "Conectados": item.connected,
          "Data": moment(item.date).format('DD/MM/YYYY'),
        }
      })
    } else {
      return []
    }
    
  }

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
  }}
  >
    {globalDataStatus === "loading" ? (
        <LinearProgress />
      ) : globalDataStatus === "error" ? (
          <Alert severity="error">
              <AlertTitle>Erro</AlertTitle>
              Ocorreu um erro no carregamento de informações do banco de dados
          </Alert>
      ) : (
        <>
          <InfoBar>
            <Title>Visão Geral</Title>
            <Tools>
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
              <Tooltip title="Sem notificações">
                <ButtonPlacer>
                    <NotificationsIcon fontSize='large'/>
                    <NotificationCounter/>
                </ButtonPlacer>
              </Tooltip>
              <Link to="/admin" style={{textDecoration: "none"}}>
                <AddWeatherStation>+  Adicionar Estação</AddWeatherStation>
              </Link>
              
            </Tools>
          </InfoBar>
          <Grid container>
            <Grid xs={6} container>
              <Grid xs={6}>
                <Card>
                  <CardIcon><HubIcon fontSize='inherit'/></CardIcon>
                  <CardInfo>
                    <CardNumber>{globalDataData.estacoes_registradas}</CardNumber>
                    <CardDesc>Estações Registradas</CardDesc>
                  </CardInfo>
                </Card>
              </Grid>
              <Grid xs={6}>
                <Card>
                  <CardIcon><CellTowerIcon fontSize='inherit'/></CardIcon>
                  <CardInfo>
                    <CardNumber>{globalDataData.estacoes_conectadas}</CardNumber>
                    <CardDesc>Estações Conectadas</CardDesc>
                  </CardInfo>
                </Card>
              </Grid>
              <Grid xs={6}>
                <Card>
                  <CardIcon><ImageAspectRatioIcon fontSize='inherit'/></CardIcon>
                  <CardInfo>
                    <CardNumber>{globalDataData.numero_amostras}</CardNumber>
                    <CardDesc>Amostras tomadas</CardDesc>
                  </CardInfo>
                </Card>
              </Grid>
              <Grid xs={6}>
                <Card>
                  <CardIcon><AccessTimeIcon fontSize='inherit'/></CardIcon>
                  <CardInfo>
                    <CardNumber>{globalDataData.ultima_amostra.substring(11, globalDataData.ultima_amostra.length-3)}</CardNumber>
                    <CardDesc>Última amostra</CardDesc>
                  </CardInfo>
                </Card>
              </Grid>
            </Grid>
            <Grid xs={6}>
                { evolucaoConectividade !== undefined && evolucaoConectividade.length > 0 ?
                  <ChartCard>
                    <ChartName>
                      <ChartTitle>Evolução da Conectividade das Estações</ChartTitle>
                      <ChartLabelArea>
                        <ChartLabelNumber>{globalDataData.evolucao_conectividade[globalDataData.evolucao_conectividade.length-1].connected}</ChartLabelNumber>
                        <ChartLabelDesc>Conectados</ChartLabelDesc>
                      </ChartLabelArea>
                    </ChartName>
                    <ChartArea>
                      <ResponsiveContainer width={"100%"} height="100%">
                        <LineChart data={getFormattedEvolucaoConectividade(evolucaoConectividade)} margin={{ top: 25, right: 5, bottom: 5, left: 5 }}>
                          <Line type="monotone" dataKey="Conectados" stroke="#F40006" />
                          <XAxis hide={true} dataKey="Data" />
                          <TooltipRecharts />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartArea>
                  </ChartCard>
                :
                  <Typography align="center">Erro no carregamento da conectividade</Typography>
                }
                
            </Grid>
            <Grid xs={6}>
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
            </Grid>
            <Grid xs={6} >
              <Link to="/estacao/1" style={{textDecoration: "none"}}>
              <Dashboard>
                  <DashTitleContainer>
                    <Location>Salvador {Math.abs(globalDataData.preview_station.estacao.latitude).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}°{globalDataData.preview_station.estacao.latitude > 0 ? "N" : "S"} {Math.abs(globalDataData.preview_station.estacao.longitude).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}°{globalDataData.preview_station.estacao.longitude > 0 ? "L" : "O"}</Location>
                    <DateTime>
                      <Date>{moment(globalDataData.preview_station.record.date.substring(0, 10)).format('DD/MM/YYYY')}</Date>
                      <Time>{globalDataData.preview_station.record.date.substring(11, globalDataData.ultima_amostra.length)}</Time>
                    </DateTime>
                  </DashTitleContainer>
                  <CardPlacer>
                    <Grid container>
                      <Grid xs={4}>
                        <SmallCard>
                          <TitleIcon>
                            <SmallCardTitle>{globalDataData.preview_station.record.dioxide_carbon_ppm} ppm</SmallCardTitle>
                            <SmallCardIcon><Co2Icon fontSize='inherit'/></SmallCardIcon>
                          </TitleIcon>
                          <Description>Dióxido de Carbono</Description>
                        </SmallCard>
                      </Grid>
                      <Grid xs={4}>
                        <SmallCard>
                          <TitleIcon>
                            <SmallCardTitle>{globalDataData.preview_station.record.temperature.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1})} °C</SmallCardTitle>
                            <SmallCardIcon><DeviceThermostatOutlinedIcon fontSize='inherit'/></SmallCardIcon>
                          </TitleIcon>
                          <Description>Temperatura</Description>
                        </SmallCard>
                      </Grid>
                      <Grid xs={4}>
                        <SmallCard>
                          <TitleIcon>
                            <SmallCardTitle>{globalDataData.preview_station.record.rain_presence ? "Sim" : "Não"}</SmallCardTitle>
                            <SmallCardIcon><WaterIcon fontSize='inherit'/></SmallCardIcon>
                          </TitleIcon>
                          <Description>Precipitação</Description>
                        </SmallCard>
                      </Grid>
                      <Grid xs={4}>
                        <SmallCard>
                          <TitleIcon>
                            <SmallCardTitle>{(globalDataData.preview_station.record.humidity).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %</SmallCardTitle>
                            <SmallCardIcon><OpacityOutlinedIcon fontSize='inherit'/></SmallCardIcon>
                          </TitleIcon>
                          <Description>Umidade</Description>
                        </SmallCard>
                      </Grid>
                      <Grid xs={4}>
                        <SmallCard>
                          <TitleIcon>
                            <SmallCardTitle>{globalDataData.preview_station.record.pressure.toLocaleString('pt-BR', { minimumFractionDigits: 1,maximumFractionDigits: 1 })} hPa</SmallCardTitle>
                            <SmallCardIcon><SpeedOutlinedIcon fontSize='inherit'/></SmallCardIcon>
                          </TitleIcon>
                          <Description>Pressão</Description>
                        </SmallCard>
                      </Grid>
                      <Grid xs={4}>
                        <SmallCard>
                          <TitleIcon>
                            <SmallCardTitle>{globalDataData.preview_station.record.dewpoint.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} °C</SmallCardTitle>
                            <SmallCardIcon><HelpOutlineOutlinedIcon fontSize='inherit'/></SmallCardIcon>
                          </TitleIcon>
                          <Description>Temperatura de Orvalho</Description>
                        </SmallCard>
                      </Grid>
                    </Grid>
                  </CardPlacer>
              </Dashboard>
              </Link>
            </Grid>
          </Grid>

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
        </>
    )}
    
  </Box>
  )
}

export default VisaoGeral