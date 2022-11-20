import styled from '@emotion/styled'
import logo from '../../images/Logo.svg'
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link, useLocation } from 'react-router-dom';


const Logo = styled.img`
    width: 15vw;
    height: 20%;
    margin-top: 30px;
    margin-left: 10px;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 40px;
`

const NavButton = styled("div")<{selected?: boolean}>`
  display: flex;
  color: ${props => props.selected ? "#F40006" : "white"};
  background-color: ${props => props.selected ? "white" : "none"};
  align-items: center;
  padding: 1rem 0px 1rem 2rem;
  margin: 0px 15px 0px 30px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background-color: white;
    color: #F40006;
  }
`

const Button = styled.a`
  font-size: 20px;
  margin-left: 10px;
`


const Navbar = () => {
  let location = useLocation();

  return (
        <Box 
          sx={{
            flex:"1",
            backgroundColor: "#F40006",
            height: "100vh",
          }}
        >
          <Logo src={logo} alt="Logo"/>
          <ButtonContainer>
            <Link to="/" style={{textDecoration: "none"}}>
              <NavButton selected={location.pathname === "/"}>
                <HomeIcon fontSize='large'/>
                <Button>Visão Geral</Button>
              </NavButton>
            </Link>
            <Link to="/estacoes" style={{textDecoration: "none"}}>
              <NavButton selected={location.pathname === "/estacoes"}>
                <LocationOnIcon fontSize='large'/>
                <Button>Estações</Button>
              </NavButton>
            </Link>
            <Link to="/admin" style={{textDecoration: "none"}}>
              <NavButton selected={location.pathname === "/admin"}>
                  <SettingsIcon fontSize='large'/>
                  <Button>Admin</Button>
              </NavButton>
            </Link>
          </ButtonContainer>
      </Box>
  )
}

export default Navbar