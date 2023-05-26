import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function PageHeader({ title, children = null }) {
    const navigate = useNavigate();

    return (
        <Box sx={{
            display: 'flex',
            padding: 1,
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            backgroundColor: 'background.paper'
        }}>
            <IconButton
                size="sm"
                onClick={() => navigate(-1)}
            >
                <ArrowBackIcon />
            </IconButton>
            <Typography
                component="h1"
                variant="h5"
                color="text.primary"
                gutterBottom
            >
                {title}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {children}
        </Box>
    );
}

export default PageHeader;
