import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Dialog, DialogContent, DialogActions, DialogTitle, TextField } from '@mui/material';
import {
    createChecklist,
    selectChecklists, 
    NEW_CHECKLIST_TEMPLATE,
} from '../../../store/checklistSlice';
import useSessionHook from '../../../hooks/useSessionHook';

function ChecklistPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLogin } = useSessionHook();
    useEffect(() => {
        if (!isLogin) {
            navigate("/login");
        }
    }, [isLogin, navigate]);

    const unSortedChecklists = useSelector(selectChecklists);
    const checklists = _.orderBy(unSortedChecklists, (item) => (item.updatedAt || item.createdAt), ['desc']);
    const currentChecklist = checklists?.[0];
    const otherInProgressChecklists = checklists.slice(1);

    const [newChecklistDialogOpen, setNewChecklistDialogOpen] = useState(false);
    const [name, setName] = useState('');

    const handleNewChecklistClick = () => {
        if (!name) {
            const date = new Date();
            setName(`Checklist ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`);
        }
        setNewChecklistDialogOpen(true);
    };

    const handleNewChecklistDialogClose = () => {
        setNewChecklistDialogOpen(false);
    };

    const handleNewChecklistCreate = (e) => {
        e.preventDefault();

        setNewChecklistDialogOpen(false);
        const newItem = {
            ...NEW_CHECKLIST_TEMPLATE,
            name,
        };
        dispatch(createChecklist({ data: newItem })).then(({ payload }) => {
            if (payload) {
                navigate(payload._id);
            }
        });
    };

    const formatItems = (items) => {
        if (!items || items.length === 0) {
            return 'no items';
        }

        const text = items.filter(item => item.qty).slice(0, 3).map(item => `${item.qty} ${item.product.name}`).join(', ');

        return items.length > 3 ? text + '...' : text;
    }

    const formatDate = (date) => moment(date).format('ll');

    return (
        <Container maxWidth="xl">
            <Typography
                component="h1"
                variant="h5"
                color="text.primary"
                gutterBottom
            >
                Checklist
            </Typography>

            {/* New Checklist or Current Checklist */}
            <Box sx={{ paddingBottom: 2 }}>
                <Grid container spacing={4}>
                    {currentChecklist && (
                        <Grid item xs={12} sm={6} md={8}>
                            <Card
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <CardActionArea to={currentChecklist._id} component={Link}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Continue Checklist
                                        </Typography>
                                        <Typography variant="body1" component="h3">
                                            {currentChecklist.name}
                                        </Typography>
                                        <Typography variant="body2" component="span" sx={{ paddingRight: 1 }}>{formatDate(currentChecklist.modified)}:</Typography>
                                        <Typography variant="body2" component="span">{formatItems(currentChecklist.items)}</Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button variant='contained' to={currentChecklist._id} component={Link}>Continue</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <CardActionArea onClick={handleNewChecklistClick}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        New Checklist
                                    </Typography>
                                    <Typography>
                                        Start a new checklist
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button variant='contained' onClick={handleNewChecklistClick}>New</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* List of other in-progress checklists */}
            <Typography
                variant="subtitle1"
                color="text.primary"
            >
                Other In-progress Checklist
            </Typography>
            {(otherInProgressChecklists.length > 0) ? (
                <List disablePadding>
                    {otherInProgressChecklists.map(checklist => (
                        <ListItem
                            key={checklist._id}
                            divider
                            dense
                            disableGutters
                            secondaryAction={
                                <IconButton
                                    edge="end" size="large" aria-label="continue"
                                    to={checklist._id} component={Link}
                                >
                                    <ArrowRightIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            <ListItemButton to={checklist._id} component={Link}>
                                <ListItemText
                                    primary={checklist.name}
                                    primaryTypographyProps={{ variant: "subtitle2", component: "span" }}
                                    secondary={(
                                        <React.Fragment>
                                            <Typography variant="body2" component="span" sx={{ paddingRight: 1 }}>{formatDate(checklist.modified)}:</Typography>
                                            <Typography variant="body2" component="span">{formatItems(checklist.items)}</Typography>
                                        </React.Fragment>
                                    )}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <div>-</div>
            )}
            {/* <Link to="all">View all checklists</Link> */}
            {/* Link to view all checklists */}

            {/* New checklist dialog */}
            <Dialog
                fullWidth
                open={newChecklistDialogOpen}
                onClose={handleNewChecklistDialogClose}
            >
                <DialogTitle>New Checklist</DialogTitle>
                <DialogContent>
                    <Box component={'form'} onSubmit={handleNewChecklistCreate}>
                        <TextField
                            id="name"
                            label="Name"
                            fullWidth
                            required
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                            margin="normal"
                        />
                        {/* <Typography variant="subtitle2">
                            Copy from previous checklist:
                        </Typography>
                        <List
                            disablePadding
                            sx={{
                                maxHeight: 200,
                                position: 'relative',
                                overflow: 'auto',
                            }}
                        >
                            {previousChecklists.map(checklist => (
                                <ListItem
                                    key={checklist.id}
                                    // onClick={() => handleItemClick(item.id)}
                                    divider
                                    dense
                                    disablePadding
                                    disableGutters
                                >
                                    <ListItemButton to={checklist.id} component={Link}>
                                        <ListItemText
                                            primary={checklist.name}
                                            primaryTypographyProps={{ variant: "subtitle2" }}
                                            secondary={(
                                                <React.Fragment>
                                                    <Typography variant="body2" component="span" sx={{ paddingRight: 1 }}>{formatDate(checklist.modified)}:</Typography>
                                                    <Typography variant="body2" component="span">{formatItems(checklist.items)}</Typography>
                                                </React.Fragment>
                                            )}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List> */}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleNewChecklistDialogClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleNewChecklistCreate}>Create</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ChecklistPage;
