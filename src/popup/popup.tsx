import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Add as AddIcon, PictureInPicture as PictureInPictureIcon } from '@mui/icons-material';
import { Box, Paper, InputBase, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
// import Grid from '@mui/material/Grid2';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "./popup.css";
import WeatherCard from '../components/WeatherCard';
import { setStoredCities, setStoredOptions, getStoredOptions, getStoredCities, LocalStorageOptions } from '../utils/storage';
import { Messages } from "../utils/messages";



const App: React.FC<{}> = () => {
    const [cities, setCities] = useState<string[]>([])
    const [cityInput, setCityInput] = useState<string>("");
    const [options, setOptions] = useState<LocalStorageOptions | null>()

    useEffect(() => {
        getStoredCities().then(cities => setCities(cities))
        getStoredOptions().then((options) => setOptions(options))
    }, [])

    const handleCityButtonClick = () => {
        if (cityInput === "") {
            return;
        }
        const updatedCities = [...cities, cityInput]
        setStoredCities(updatedCities)
            .then(() => {
                setCities(updatedCities)
                setCityInput('')
            },)
    }

    const handleCityDeleteButtonClick = (index: number) => {
        cities.splice(index, 1)
        const updatedCities = [...cities]
        setStoredCities(updatedCities).then(() => {
            setCities(updatedCities);
        })
    }

    const handleTempScaleButtonClick = () => {
        const updatedOptions: LocalStorageOptions = {
            ...options,
            tempScale: options.tempScale === 'metric' ? 'imperial' : "metric",
        }

        setStoredOptions(updatedOptions).then(() => {
            setOptions(updatedOptions)
        })
    }

    const handleOverlayButtonClick = () => {
        chrome.tabs.query({
            active: true,
        }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY)
            }
        })
    }

    if (!options) {
        return null;
    }

    return (
        <Box mx="8px" my="16px">
            <Grid container justifyContent="space-evenly">
                <Grid item>
                    <Paper>
                        <Box px="15px" py="5px">
                            <InputBase placeholder='Add a city name' value={cityInput} onChange={(e) => setCityInput(e.target.value)} />
                            <IconButton onClick={handleCityButtonClick}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper>
                        <Box py="4px">
                            <IconButton onClick={handleTempScaleButtonClick}>
                                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
                            </IconButton>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item>
                    <Paper>
                        <Box py="4px">
                            <IconButton onClick={handleOverlayButtonClick}>
                                <PictureInPictureIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                </Grid>

            </Grid>

            {
                options.homeCity !== "" && <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
            }

            {cities.map((city, index: number) => (
                <WeatherCard city={city}
                    key={index}
                    onDelete={() => handleCityDeleteButtonClick(index)}
                    tempScale={options.tempScale}
                />
            ))}
            <Box height="16px" />
        </Box>
    )
}

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

const root = createRoot(rootElement);
root.render(<App />);



