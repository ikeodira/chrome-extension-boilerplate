import React, { useEffect, useState } from "react";
import { getWeatherIconSrc, fetchOpenWeatherData, OpenWeatherData, OpenWeatherTempScale } from "../../utils/api";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import "./WeatherCard.css";


const WeatherCardContainer: React.FC<{
  children: React.ReactNode
  onDelete?: () => void
}> = ({ children, onDelete }) => {
  return (
    <Box mx={"4px"} my={'16px'}>
      <Card>
        <CardContent>{children}</CardContent>
        <CardActions>
          {onDelete && <Button color="error" onClick={onDelete}>
            <Typography className="weatherCard-body">Delete</Typography>
          </Button>}
        </CardActions>
      </Card>
    </Box>
  )

}


type WeatherCardState = "loading" | "error" | "ready";

const WeatherCard: React.FC<{ city: string, tempScale: OpenWeatherTempScale, onDelete?: () => void, }> = ({ city, onDelete, tempScale }) => {

  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [cardState, setCardState] = useState<WeatherCardState>("loading")

  useEffect(() => {
    fetchOpenWeatherData(city, tempScale).then((data) => {
      setWeatherData(data)
      setCardState("ready")
    }).catch((error) => setCardState("error"));
  }, [city, tempScale])

  if (cardState === "loading" || cardState === "error") {
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography className="weatherCard-title">{city}</Typography>
        <Typography className="weatherCard-body">
          {cardState === "loading" ? "Loading" : "Error: could not retrieve weather data for this city"}
        </Typography>
      </WeatherCardContainer>
    )
  }
  return (
    <WeatherCardContainer onDelete={onDelete}>
      <Grid container sx={{
        justifyContent: "space-around",
      }}>
        <Grid item>
          <Typography className="weatherCard-title"> {weatherData.name}</Typography>
          <Typography className="weatherCard-temp">{Math.round(weatherData.main.temp)}</Typography>
          <Typography className="weatherCard-body">Feels like: {Math.round(weatherData.main.feels_like)}</Typography>
        </Grid>
        <Grid item>
          {weatherData.weather.length > 0 && <>
            <img src={getWeatherIconSrc(weatherData.weather[0].icon)} />
            <Typography className="weatherCard-body">{weatherData.weather[0].main}</Typography>

          </>
          }
        </Grid>


      </Grid>
    </WeatherCardContainer>
  );
};

export default WeatherCard;
