import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useSessionHook from '../../../hooks/useSessionHook';

const cards = [
    {
        path: 'products',
        title: 'Products',
        description: 'Manage products',
    },
    {
        path: 'markets',
        title: 'Markets',
        description: 'Manage markets',
    },
];

function SettingsCard({ card }) {
    return (
        <Grid item xs={12} sm={6}>
            <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <CardActionArea to={card.path} component={Link}>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {card.title}
                        </Typography>
                        <Typography>
                            {card.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant='contained'>Edit</Button>
                    </CardActions>
                </CardActionArea>
            </Card>
        </Grid>
    );
}

function SettingsPage() {
    const navigate = useNavigate();
    const { isLogin } = useSessionHook();
    useEffect(() => {
        if (!isLogin) {
            navigate("/login");
        }
    }, [isLogin, navigate]);

    return (
        <Container maxWidth="xl">
            <Typography
                component="h1"
                variant="h5"
                color="text.primary"
                gutterBottom
            >
                Settings
            </Typography>
            <Grid container spacing={4}>
                {cards.map(card => <SettingsCard key={card.path} card={card} />)}
            </Grid>
        </Container>
    );
}

export default SettingsPage;
