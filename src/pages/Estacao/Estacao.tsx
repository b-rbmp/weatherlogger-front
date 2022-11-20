import styled from '@emotion/styled'
import { Box } from '@mui/system'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import Co2Icon from '@mui/icons-material/Co2';
import WaterIcon from '@mui/icons-material/Water';

import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Line, LineChart, ResponsiveContainer, Tooltip as TooltipRecharts, XAxis } from 'recharts';
import { useParams } from 'react-router-dom';
import { getEstacaoData } from '../../fetching/api';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertTitle, CircularProgress, LinearProgress, Snackbar, TextField } from '@mui/material';
import { useState } from 'react';
import { TCondicoesHistorica, TEstacaoData } from '../../fetching/types';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface ICardProps {
    selecionado: boolean
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`
const TitleContainer = styled.div`
    flex: 1;
`

const PageTitle = styled.h1`
    font-size: 46px;
    font-weight: 700;
    color: #020B1D;
    `

const CardsContainer = styled.div`
    flex: 3;
    margin-bottom: 30px;
`

const SectionTitle = styled.h2`
    color: #020B1D;
    font-size: 28px;
    font-weight: 500;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
`    

const CardPlacer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    height: 100%;
`

const Card = styled.div<ICardProps>`
    max-width: 260px;
    max-height: 150px;
    background: ${props => props.selecionado ? "#F40006E5" :"rgba(252, 251, 251, 0.7)"};
    border: 1px solid #DADADA;
    border-radius: 12px;
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-around;
    transition: all 0.5s ease;
    padding: 0.7rem;
    color: ${props => props.selecionado ? "#F4F4F4" :"#020B1D"};

    .descricao {
        color: ${props => props.selecionado ? "#EEEEEE" :"#5B6C8E"};
    }
    &:hover {
        background-color: #F40006E5;
        color: #F4F4F4;
        transform: scale(1.1);
    }

    &:hover .descricao{
        color: #EEEEEE;
        transform: scale(1.1);
    }
`

const CardIcon = styled.div`
    font-size: 4rem;
    padding-left: 5px;
    flex:1;
`
const CardInfo = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 10px 5px 10px 5px;
    align-items: center;
    justify-content: space-around;
    flex:2;
`
const DataValue = styled.h2`
    font-size: 26px;
    text-align: center;
    font-weight: 600;
    vertical-align: middle;
`

const DataValueDiv = styled.div`
    flex: 2;
    align-items: center;
    display: flex;
`

const DataName = styled.span`
    font-size: 18px;
    color: #5B6C8E;
    font-weight: 300;
    text-align: center;
    vertical-align: middle;
`

const DataNameDiv = styled.div`
    flex: 3;
    align-items: center;
    display: flex;
`

const StatsContainer = styled.div`
    flex: 6;
    display: flex;
    flex-direction: column;
`
const SectionNavbar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
`
const SectionDataPicker = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
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

const GraphSection = styled.div`
    flex: 7;
`

const Chart = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    column-gap: 20px;
`

const ChartCard = styled.div`
  padding: 30px;
  height: 75%;
  width: 70%;
  background: #FFFFFF;
  border: 1px solid #DADADA;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  flex: 2;
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


const ChartArea = styled.div`
  flex: 5;
  margin-top: 1rem;
`

const ChartStats = styled.div`
    flex: 1;
    background-color: #FFFFFF;
    border: 1px solid #EDEDED;
    border-radius: 15px;
    width: 20vw;
    height: 75%;
    padding: 30px;
`
const ChartStatsTitle = styled.h2`
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 1.5rem;
`
const ChartStatsDesc = styled.div`
    display: flex;
    flex-direction: column;
`

const Desc = styled.div`
    flex: 1;
    max-height: 20%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.2rem;
`
const DescNumberObs = styled.span`
    display: flex;
    flex-direction: column;
`
const Number = styled.span`
    font-size: 18px;
    font-weight: 600;
`

const Obs = styled.span`
    color: #020B1D;
    font-size: 14px;
    font-weight: 300;
`

const DescDateTime = styled.div`
    display: flex;
    flex-direction: column;
`
const DescDate = styled.span`
    color: #020B1D;
    font-size: 14px;
    font-weight: 300;
`
const DescTime = styled.span`
    color: #020B1D;
    font-size: 14px;
    font-weight: 300;
`
type TSelecaoVariavel = "temperature" | "humidity" | "pressure" | "rain_presence" | "dioxide_carbon_ppm"

type TRechartsItem = {
    "Valor": number,
    "Data": string
  }

type TStatistics = {

    "valor": string,
    "descricao": string,
    "data": string,
}

const Estacao = () => {
    // Parametros React Router
    let { weatherStationId } = useParams();

    // Queries
    const { status: estacaoDataStatus, data: estacaoDataData, isFetching: estacaoDataIsFetching } = useQuery({ queryKey: ['estacaoData', weatherStationId], queryFn: () => getEstacaoData(weatherStationId !== undefined ? parseInt(weatherStationId) : 0) })

    // State
    const [selecaoVariavel, setSelecaoVariavel] = useState<TSelecaoVariavel>("temperature");
    const [filtroData, setFiltroData] = useState<null | any>(null);

    const filterCondicaoHistoricaByDate = (condicaoHistorica: TCondicoesHistorica) => {
       
        if (filtroData !== undefined && filtroData !== null) {
            const data = moment(filtroData)
            return condicaoHistorica.date.includes(data.format("YYYY-MM-DD"))
        } else {
            return true
        }
    }

    const getFormattedGrafico = (selecaoVariavel: TSelecaoVariavel, estacaoDataData: TEstacaoData | undefined): TRechartsItem[] => {
        if (estacaoDataData !== undefined) {
            const condicoes_historicas = estacaoDataData.condicoes_historicas
            const condicoes_historias_filtradas = condicoes_historicas.filter(filterCondicaoHistoricaByDate)
            return condicoes_historias_filtradas.map((item) => {
                let valor = 0;
                let itemValue = item[selecaoVariavel]
                if (typeof itemValue === "number") {
                    valor = parseFloat(itemValue.toFixed(2))
                }
                if (typeof itemValue === "boolean") {
                    if (itemValue === true) {
                        valor = 1
                    } else {
                        valor = 0
                    }
                }
                return {
                "Valor": valor,
                "Data": moment(item.date).format('DD/MM/YYYY HH:mm:ss'),
                }
            }).reverse()
        } else {
            return []
        }
        
    }

    const getStatistics = (selecaoVariavel: TSelecaoVariavel, estacaoDataData: TEstacaoData | undefined): TStatistics[] => {
        const dadosGrafico = getFormattedGrafico(selecaoVariavel, estacaoDataData)
        if (dadosGrafico.length) {
            if (selecaoVariavel === "rain_presence") {
                return [
                        {
                            "valor": dadosGrafico.length.toString(),
                            "descricao": "Número de Amostras",
                            "data": "Todo o Período",  
                        }
                ]
                
            } else {
                let sum = 0;
                for( let i = 0; i < dadosGrafico.length; i++ ){
                    sum += dadosGrafico[i].Valor
                }
    
                const avg = sum/dadosGrafico.length
                
                const values = dadosGrafico.map((dado) => dado.Valor)
    
                const max = Math.max.apply(null, values);
                const indexMax = values.indexOf(max);
                const dateMax = dadosGrafico[indexMax].Data
                const min = Math.min.apply(null, values);
                const indexMin = values.indexOf(min);
                const dateMin = dadosGrafico[indexMin].Data
    
                let suffixoVariavel = ""
                if (selecaoVariavel === "temperature") {
                    suffixoVariavel = " °C"
                } else if (selecaoVariavel === "pressure") {
                    suffixoVariavel = " hPA"
                } else if (selecaoVariavel === "humidity") {
                    suffixoVariavel = " %"
                } else if (selecaoVariavel === "dioxide_carbon_ppm") {
                    suffixoVariavel = " ppm"
                }
    
                return [
                        {
                            "valor": max.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + suffixoVariavel,
                            "descricao": "Máximo",
                            "data": dateMax,  
                        },
                        {
                            "valor": min.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + suffixoVariavel,
                            "descricao": "Mínimo",
                            "data": dateMin,  
                        },
                        {
                            "valor": avg.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + suffixoVariavel,
                            "descricao": "Média",
                            "data": "Todo o Período",  
                        },
                        {
                            "valor": dadosGrafico.length.toString(),
                            "descricao": "Número de Amostras",
                            "data": "Todo o Período",  
                        }
                ]
                
                
            }
        } else {
            return []
        }
        
    }
    
    const getDisplayGraficoData = (selecaoVariavel: TSelecaoVariavel, estacaoDataData: TEstacaoData | undefined): string => {
        if (estacaoDataData !== undefined) {
            let valorBruto = estacaoDataData.condicoes_historicas[0][selecaoVariavel]
            
            if (typeof valorBruto === "boolean") {
                if (valorBruto === true) {
                    return "Sim"
                } else {
                    return "Não"
                }
            } else if (typeof valorBruto === "number") {
                return valorBruto.toLocaleString('pt-BR', { minimumFractionDigits: 1,maximumFractionDigits: 2 })
            } else {
                return ""
            } 
        
        } else {
          return ""
        } 
    }

    const getGraficoTitle = (selecaoVariavel: TSelecaoVariavel): string => {
        if (selecaoVariavel === "temperature") {
            return "Temperatura"
        } else if (selecaoVariavel === "humidity") {
            return "Umidade"
        } else if (selecaoVariavel === "pressure") {
            return "Pressão"
        } else if (selecaoVariavel === "dioxide_carbon_ppm") {
            return "Dióxido de Carbono"
        } else if (selecaoVariavel === "rain_presence") {
            return "Presença de Chuva"
        } else {
            return ""
        }
    }

    const getGraficoSuffix = (selecaoVariavel: TSelecaoVariavel): string => {
        if (selecaoVariavel === "temperature") {
            return " °C"
        } else if (selecaoVariavel === "humidity") {
            return " %"
        } else if (selecaoVariavel === "pressure") {
            return " hPa"
        } else if (selecaoVariavel === "dioxide_carbon_ppm") {
            return " ppm"
        } else if (selecaoVariavel === "rain_presence") {
            return ""
        } else {
            return ""
        }
    }

    return (
        <Box sx={{
            flex:"5",
            backgroundColor: "#FAF1F1",
            padding: "40px",
            borderRadius: "32px 0px 0px 32px",
        }}>
            {estacaoDataStatus === "loading" ? (
                <LinearProgress />
            ) : estacaoDataStatus === "error" ? (
                <Alert severity="error">
                    <AlertTitle>Erro</AlertTitle>
                    Ocorreu um erro no carregamento de informações do banco de dados
                </Alert>
            ) : (
                <Container>
                    <TitleContainer>
                        <PageTitle>Salvador, Brasil - {Math.abs(estacaoDataData.estacao_info.latitude).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}°{estacaoDataData.estacao_info.latitude > 0 ? "N" : "S"} {Math.abs(estacaoDataData.estacao_info.longitude).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}°{estacaoDataData.estacao_info.longitude > 0 ? "L" : "O"}</PageTitle>
                    </TitleContainer>
                    <CardsContainer>
                        <SectionTitle>Condições Atuais</SectionTitle>
                        <CardPlacer>
                            <Card selecionado={selecaoVariavel === "temperature"} onClick={(e) => {
                                            setSelecaoVariavel("temperature")
                            }}>
                                <CardIcon><DeviceThermostatIcon fontSize='inherit'/></CardIcon>
                                <CardInfo>
                                    <DataValueDiv><DataValue>{estacaoDataData.condicoes_historicas[0].temperature.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1})} °C</DataValue></DataValueDiv>
                                    <DataNameDiv><DataName className='descricao'>Temperatura</DataName></DataNameDiv>
                                </CardInfo>
                            </Card>
                            <Card selecionado={selecaoVariavel === "humidity"} onClick={(e) => {
                                            setSelecaoVariavel("humidity")
                            }}>
                                <CardIcon><OpacityOutlinedIcon fontSize='inherit'/></CardIcon>
                                <CardInfo>
                                    <DataValueDiv><DataValue>{(estacaoDataData.condicoes_historicas[0].humidity).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %</DataValue></DataValueDiv>
                                    <DataNameDiv><DataName className='descricao'>Umidade</DataName></DataNameDiv>
                                </CardInfo>
                            </Card>
                            <Card selecionado={selecaoVariavel === "pressure"} onClick={(e) => {
                                            setSelecaoVariavel("pressure")
                            }}>
                                <CardIcon><SpeedOutlinedIcon fontSize='inherit'/></CardIcon>
                                <CardInfo>
                                    <DataValueDiv><DataValue>{estacaoDataData.condicoes_historicas[0].pressure.toLocaleString('pt-BR', { minimumFractionDigits: 1,maximumFractionDigits: 1 })} hPa</DataValue></DataValueDiv>
                                    <DataNameDiv><DataName className='descricao'>Pressão</DataName></DataNameDiv>
                                </CardInfo>
                            </Card>
                            <Card selecionado={selecaoVariavel === "dioxide_carbon_ppm"} onClick={(e) => {
                                            setSelecaoVariavel("dioxide_carbon_ppm")
                            }}>
                                <CardIcon><Co2Icon fontSize='inherit'/></CardIcon>
                                <CardInfo>
                                    <DataValueDiv><DataValue>{estacaoDataData.condicoes_historicas[0].dioxide_carbon_ppm} ppm</DataValue></DataValueDiv>
                                    <DataNameDiv><DataName className='descricao'>Dióxido de Carbono</DataName></DataNameDiv>
                                </CardInfo>
                            </Card>
                            <Card selecionado={selecaoVariavel === "rain_presence"} onClick={(e) => {
                                            setSelecaoVariavel("rain_presence")
                            }}>
                                <CardIcon><WaterIcon fontSize='inherit'/></CardIcon>
                                <CardInfo>
                                    <DataValueDiv><DataValue>{estacaoDataData.condicoes_historicas[0].rain_presence ? "Sim" : "Não"}</DataValue></DataValueDiv>
                                    <DataNameDiv><DataName className='descricao'>Precipitação</DataName></DataNameDiv>
                                </CardInfo>
                            </Card>
                        </CardPlacer>
                    </CardsContainer>
                    <StatsContainer>
                        <SectionNavbar>
                            <SectionTitle>Condições Históricas</SectionTitle>
                            <SectionDataPicker>
                                                    
                                <DatePicker
                                    disableFuture
                                    inputFormat="DD/MM/YYYY"
                                    label="Filtra por Data"
                                    value={filtroData}
                                    onChange={(newValue) => {
                                        setFiltroData(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />

                            </SectionDataPicker>
                        </SectionNavbar>
                        <GraphSection>
                            <Chart>
                            <ChartCard>
                                <ChartName>
                                <ChartTitle>{getGraficoTitle(selecaoVariavel)}</ChartTitle>
                                <ChartLabelArea>
                                    <ChartLabelNumber>
                                        {getDisplayGraficoData(selecaoVariavel, estacaoDataData) + getGraficoSuffix(selecaoVariavel)}
                                    </ChartLabelNumber>
                                </ChartLabelArea>
                                </ChartName>
                                <ChartArea>
                                <ResponsiveContainer width={"100%"} height="100%">
                                    <LineChart data={getFormattedGrafico(selecaoVariavel, estacaoDataData)} margin={{ top: 25, right: 5, bottom: 5, left: 5 }}>
                                        <Line type="monotone" dataKey="Valor" stroke="#F40006" />
                                        <XAxis hide={true} dataKey="Data" />
                                        <TooltipRecharts />
                                    </LineChart>
                                </ResponsiveContainer>
                                </ChartArea>
                            </ChartCard>
                            <ChartStats>
                                <ChartStatsTitle>Estatísticas do Período</ChartStatsTitle>
                                <ChartStatsDesc>
                                    {getStatistics(selecaoVariavel, estacaoDataData).map((estatistica, index) => {

                                        return <Desc key={index}>
                                            <DescNumberObs>
                                                <Number>{estatistica.valor}</Number>
                                                <Obs>{estatistica.descricao}</Obs>
                                            </DescNumberObs>
                                            <DescDateTime>
                                                <DescDate>{estatistica.data !== "Todo o Período" ? estatistica.data.substring(0, 10) : estatistica.data}</DescDate>
                                                <DescTime>{estatistica.data !== "Todo o Período" ? estatistica.data.substring(10, estatistica.data.length) : ""}</DescTime>
                                            </DescDateTime>
                                        </Desc>
                                    })}
                                </ChartStatsDesc>
                            </ChartStats>
                            </Chart>
                        </GraphSection>
                    </StatsContainer>
                </Container>
            )}
            <Snackbar open={estacaoDataIsFetching} autoHideDuration={36000} anchorOrigin={
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

export default Estacao