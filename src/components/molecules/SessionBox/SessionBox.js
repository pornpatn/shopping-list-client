import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Avatar, IconButton, Typography, Button } from '@mui/material';
import Popover from '@mui/material/Popover';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../../hooks/userContext';

const popupBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: 1,
    rowGap: 0.5,
};

function SessionBox() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setAnchorEl(null);
    };

    const profileOpen = Boolean(anchorEl);

    return (
        <userContext.Consumer>
            {({ profile, logoutUser }) => {
                if (!profile) {
                    return (
                        <div>
                            <Link to="/login">
                                Login
                            </Link>
                        </div>
                    );
                }

                return (
                    <Box>
                        <IconButton
                            onClick={handleProfileClick}
                        >
                            <Avatar alt={profile.name} src={profile.picture} imgProps={{
                                referrerPolicy: "no-referrer"
                            }} />
                        </IconButton>
                        <Popover
                            open={profileOpen}
                            anchorEl={anchorEl}
                            onClose={handleProfileClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <Box
                                sx={popupBoxStyle}
                            >
                                <Typography variant="body1">
                                    {profile.name}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        logoutUser();
                                        handleProfileClose();
                                        navigate("/");
                                    }}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </Popover>
                    </Box>
                );
            }}
        </userContext.Consumer>
    );
}

export default SessionBox;
