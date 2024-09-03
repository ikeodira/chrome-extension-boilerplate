import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Card, CardContent, Switch, Button, Typography, Box, TextField, Grid } from '@mui/material';
import "./options.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { getStoredOptions, LocalStorageOptions, setStoredOptions } from '../utils/storage';

type FormState = 'ready' | 'saving'

const App = () => {
    const [options, setOptions] = useState<LocalStorageOptions | null>(null);
    const [formState, setFormState] = useState<FormState>('ready');

    useEffect(() => {
        getStoredOptions().then((options) => setOptions(options))
    }, [])

    const handleHomeCityChange = (homeCity: string) => {
        // console.log(homeCity);
        setOptions({
            ...options,
            homeCity,
        })
    }

    const handleAutoOverlayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOptions({
            ...options,
            hasAutoOverlay: event.target.checked,
        })
    }

    const handleSaveButtonClick = () => {
        setFormState('saving')
        setStoredOptions(options).then(() => {
            setTimeout(() => {
                setFormState('ready')
            }, 1000)
        });
    }

    if (!options) {
        return null;
    }

    const isFieldsDisabled = formState === 'saving'

    return (
        <Box mx="10%" my="2%">
            <Card>
                <CardContent>
                    <Grid container direction="column" spacing={4}>
                        <Grid item>
                            <Typography variant='h4'>Weather Extension Options</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant='body1'>Home City Name</Typography>
                            <TextField variant="standard" fullWidth placeholder='Enter a home city name' value={options.homeCity} onChange={event => handleHomeCityChange(event.target.value)} disabled={isFieldsDisabled} />
                        </Grid>

                        <Grid item>
                            <Typography variant='body1'>Auto toggle overlay on webpage load</Typography>
                            <Switch
                                color='primary'
                                checked={options.hasAutoOverlay}
                                onChange={handleAutoOverlayChange}
                                disabled={isFieldsDisabled}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </Grid>
                        <Grid item>
                            <Button variant='contained' color="primary" onClick={handleSaveButtonClick} disabled={isFieldsDisabled}>
                                {formState === "ready" ? "Save" : "Saving..."}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

const root = createRoot(rootElement);
root.render(<App />);

