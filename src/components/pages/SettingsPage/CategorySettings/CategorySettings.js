import React, { useState, useEffect, useContext } from 'react';
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
    createCategory as createItem,
    updateCategory as updateItem,
    deleteCategory as deleteItem,
    selectCategories as selectItems,
    NEW_CATEGORY_TEMPLATE as NEW_ITEM_TEMPLATE,
} from '../../../../store/categorySlice';
import { userContext } from '../../../../hooks/userContext';

function CategorySettings() {
    const dispatch = useDispatch();
    const entities = useSelector(selectItems);
    const [selectedItem, setSelectedItem] = useState({});

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const confirm = useConfirm();

    const navigate = useNavigate();
    const { profile } = useContext(userContext);
    useEffect(() => {
        if (!profile) {
            navigate("/login", { state: { to: "/settings/categories" }});
        }
    }, [profile, navigate]);

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
        const selectedCategory = entities.find(item => item._id === id);
        if (selectedCategory) {
            setSelectedItem(selectedCategory);
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
                onFocus={(e) => { e.target.select(); }}
                onChange={(e) => { setSelectedItem({ ...selectedItem, name: e.target.value }) }}
                margin="normal"
            />
            <TextField
                id="order"
                label="Order"
                fullWidth
                value={selectedItem.order}
                onFocus={(e) => { e.target.select(); }}
                onChange={(e) => { setSelectedItem({ ...selectedItem, order: e.target.value }) }}
                margin="normal"
                type="number"
                inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }}
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
                <PageHeader title="Categorys">
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
                title={'Create Category'}
            >
                <Box component={'form'} onSubmit={handleCreateSave}>
                    {renderFormContent()}
                </Box>
            </FormDialog>

            <FormDialog
                open={editDialogOpen}
                onClose={handleEditDialogClose}
                onSave={handleEditSave}
                title={'Edit Category'}
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

export default CategorySettings;
