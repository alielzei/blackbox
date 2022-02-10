import { useContext } from 'react';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';

import Avatar from '@mui/material/Avatar';


import { Grid } from '@mui/material'

import AppContext from './appcontext';

const axios = require('axios')

export default function AppBar() {
    const { user, getUser } = useContext(AppContext);

    const logout = async () => {
        try {
            await axios.delete('api/user', { withCredentials: true })
        } catch (err) {
            console.log(err)
            return
        }

        getUser()
    }

    return <MuiAppBar position="static">
        <Toolbar disableGutters>
            {/* <img src="logo.jpg" alt="Logo" height="100" width="100" /> */}

            <Box
                flexGrow={1}
            >
                <Grid
                    container
                    direction='column'
                    sx={{ mx: 2 }}
                    flexGrow={1}
                >
                    <Typography
                        variant="h4"
                    >
                        Blackbox     
                    </Typography>
                </Grid>
            </Box>
            <Typography>{user.username}</Typography>
            <Avatar sx={{mx: 2}} onClick={logout} />
        </Toolbar>
    </MuiAppBar>
}