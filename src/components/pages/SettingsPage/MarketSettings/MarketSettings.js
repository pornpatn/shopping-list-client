import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useConfirm } from "material-ui-confirm";
import PageHeader from '../../../molecules/PageHeader';
import FormDialog from '../../../molecules/FormDialog';
import {
    createMarket as createItem,
    updateMarket as updateItem,
    deleteMarket as deleteItem,
    selectMarkets as selectItems,
    NEW_MARKET_TEMPLATE as NEW_ITEM_TEMPLATE,
} from '../../../../store/marketSlice';
import useSessionHook from '../../../../hooks/useSessionHook';

function MarketSettings() {
    const dispatch = useDispatch();
    const entities = useSelector(selectItems);
    const [selectedItem, setSelectedItem] = useState({});

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const confirm = useConfirm();

    const navigate = useNavigate();
    const { isLogin } = useSessionHook();
    useEffect(() => {
        if (!isLogin) {
            navigate("/login");
        }
    }, [isLogin, navigate]);

    const handleCreateClick = () => {
        setSelectedItem(NEW_ITEM_TEMPLATE);
        setCreateDialogOpen(true);
    };

    const handleCreateDialogClose = () => {
        setCreateDialogOpen(false);
    };

    const handleCreateSave = (e) => {
        e.preventDefault();
        dispatch(createItem({ data: selectedItem })).unwrap();
        setCreateDialogOpen(false);
    };

    const handleItemClick = (id) => {
        const selectedMarket = entities.find(item => item._id === id);
        if (selectedMarket) {
            setSelectedItem(selectedMarket);
            setEditDialogOpen(true);
        }
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        dispatch(updateItem({ data: selectedItem })).unwrap();
        setEditDialogOpen(false);
    };

    const handleDeleteClick = () => {
        confirm({ description: "This action is permanent!" })
            .then(() => {
                dispatch(deleteItem({ id: selectedItem._id })).unwrap();
                setEditDialogOpen(false);
            })
            .catch(() => {
                // Deletion cancelled
            });
    };

    const renderFormContent = () => (
        <React.Fragment>
            <TextField
                id="name"
                label="Name"
                fullWidth
                required
                value={selectedItem.name}
                onChange={(e) => { setSelectedItem({ ...selectedItem, name: e.target.value }) }}
                margin="normal"
            />
            <TextField
                id="content"
                label="Content"
                fullWidth
                multiline
                rows={4}
                value={selectedItem.content}
                onChange={(e) => { setSelectedItem({ ...selectedItem, content: e.target.value }) }}
                margin="normal"
            />
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <Container maxWidth="xl" disableGutters>
                <PageHeader title="Markets">
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={handleCreateClick}
                    >
                        Add
                    </Button>
                </PageHeader>

                {(entities.length === 0) && (
                    <p>
                        <i>No Data</i>
                    </p>
                )}
                {(entities.length > 0) && (
                    <List>
                        {entities.map((item) => (
                            <ListItemButton
                                key={item._id}
                                onClick={() => handleItemClick(item._id)}
                                divider
                            >
                                <ListItemText
                                    primary={item.name}
                                    secondary={item.content}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </Container>

            <FormDialog
                open={createDialogOpen}
                onClose={handleCreateDialogClose}
                onSave={handleCreateSave}
                title={'Create Market'}
            >
                <Box component={'form'} onSubmit={handleCreateSave}>
                    {renderFormContent()}
                </Box>
            </FormDialog>

            <FormDialog
                open={editDialogOpen}
                onClose={handleEditDialogClose}
                onSave={handleEditSave}
                title={'Edit Market'}
            >
                <Box component={'form'} onSubmit={handleEditSave}>
                    {renderFormContent()}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </Button>
                </Box>
            </FormDialog>
        </React.Fragment>
    );
}

export default MarketSettings;
