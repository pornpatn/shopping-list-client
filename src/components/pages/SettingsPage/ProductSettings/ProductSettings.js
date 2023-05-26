import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Chip from '@mui/material/Chip';
import { useConfirm } from "material-ui-confirm";
import PageHeader from '../../../molecules/PageHeader';
import Search from '../../../molecules/Search';
import FormDialog from '../../../molecules/FormDialog';
import ProductFilter from '../../../molecules/ProductFilter';
import {
    createProduct as createItem,
    updateProduct as updateItem,
    deleteProduct as deleteItem,
    selectProducts as selectItems,
    NEW_PRODUCT_TEMPLATE as NEW_ITEM_TEMPLETE,
} from '../../../../store/productSlice';
import { selectCategories, fetchCategoryList } from '../../../../store/categorySlice';
import { selectTags, fetchTagList } from '../../../../store/tagSlice';
import useSessionHook from '../../../../hooks/useSessionHook';

function ProductSettings() {
    const dispatch = useDispatch();
    const entities = useSelector(selectItems);
    const categories = useSelector(selectCategories);
    const tags = useSelector(selectTags);
    const [selectedItem, setSelectedItem] = useState({});

    const [itemCategory, setItemCategory] = useState(null);

    const [itemTags, setItemTags] = useState([]);

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

    const [search, setSearch] = useState("");

    const [checkedCategories, setCheckedCategories] = useState([]);
    const [checkedTags, setCheckedTags] = useState([]);

    const filters = [
        {
            name: 'category',
            label: 'Filter by Categories',
            options: categories.map(category => ({ id: category, label: category })),
            selected: checkedCategories,
        },
        {
            name: 'tag',
            label: 'Filter by Tags',
            options: tags.map(tag => ({ id: tag, label: tag })),
            selected: checkedTags,
        }
    ];

    const handleFiltersChange = (event) => {
        const { name, selected } = event.target;
        if (name === 'category') {
            setCheckedCategories(selected);
        } else if (name === 'tag') {
            setCheckedTags(selected);
        }
    };

    // const sorters = [
    //     {
    //         name: 'category',
    //         label: 'Category',
    //         iteratees: group => group.category,
    //     },
    //     {
    //         name: 'name',
    //         label: 'Name',
    //         iteratees: group => group.name,
    //     },
    //     {
    //         name: 'created',
    //         label: 'Created',
    //         iteratees: group => group.created,
    //     },
    //     {
    //         name: 'modified',
    //         label: 'Modified',
    //         iteratees: group => group.modified,
    //     }
    // ];
    // const [sortBy, setSortBy] = useState({
    //     name: '',
    //     direction: 'asc',
    //     sorter: null,
    // });
    
    // const handleSortersChange = (event) => {
    //     setSortBy(event.target);
    // };

    const products = useMemo(() => {
        const searchTerm = search.toLowerCase();

        const isMatched = (product) => product.name.toLowerCase().includes(searchTerm)
            && ((checkedCategories.length === 0) || checkedCategories.includes(product.category))
            && ((checkedTags.length === 0) || product.tags.find(tag => checkedTags.includes(tag)));

        return entities.filter(product => isMatched(product));
    }, [entities, search, checkedCategories, checkedTags]);

    const refreshCategoriesAndTags = () => {
        dispatch(fetchCategoryList());
        dispatch(fetchTagList());
    };

    const handleCreateClick = () => {
        setSelectedItem({ ...NEW_ITEM_TEMPLETE });
        setItemCategory(null);
        setItemTags([]);
        setCreateDialogOpen(true);
    };

    const handleCreateDialogClose = () => {
        setCreateDialogOpen(false);
    };

    const handleCreateSave = (e) => {
        e.preventDefault();
        const newItem = {
            ...selectedItem,
            category: itemCategory,
            tags: itemTags,
        };
        dispatch(createItem({ data: newItem })).unwrap();
        setCreateDialogOpen(false);
        refreshCategoriesAndTags();
    };

    const handleItemClick = (id) => {
        const foundItem = entities.find(item => item._id === id);
        if (foundItem) {
            setSelectedItem(foundItem);
            setItemCategory(foundItem.category);
            setItemTags(foundItem.tags);
            setEditDialogOpen(true);
        }
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        const updatedItem = {
            ...selectedItem,
            category: itemCategory,
            tags: itemTags,
        };
        dispatch(updateItem({ data: updatedItem })).then(() => {
            setEditDialogOpen(false);
            refreshCategoriesAndTags();
        });
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

    const renderItems = (items) => {
        if (items.length === 0) {
            return null;
        }

        return items.map(item => (
            <ListItemButton
                key={item._id}
                onClick={() => handleItemClick(item._id)}
                divider
            >
                <ListItemText
                    primary={item.name}
                    secondary={item.tags.join(', ')}
                />
            </ListItemButton>
        ));
    };

    const renderItemsByCategories = () => {
        return categories.map((category) => {
            const itemsToRender = products.filter(item => item.category === category);
            if (itemsToRender.length === 0) {
                return null;
            }

            return (
                <List key={category} subheader={<ListSubheader>{category}</ListSubheader>}>
                    {renderItems(itemsToRender)}
                </List>
            )
        });
    };

    const renderItemsWithoutCategories = () => {
        const itemsToRender = products.filter(item => !categories.includes(item.category));
        if (itemsToRender.length === 0) {
            return null;
        }

        return (
            <List key={'no-category'} subheader={<ListSubheader>No Category</ListSubheader>}>
                {renderItems(itemsToRender)}
            </List>
        );
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
            <Autocomplete
                id="category"
                label="Category"
                fullWidth
                disablePortal
                freeSolo
                value={itemCategory}
                onChange={(_event, newValue) => {
                    setItemCategory(newValue);
                }}
                onInputChange={(_event, newInputValue) => {
                    setItemCategory(newInputValue);
                }}
                options={categories}
                renderInput={(params) => (
                    <TextField {...params} label="Category" margin="normal" />
                )}
            />
            <Autocomplete
                id="tags"
                label="Tags"
                multiple
                fullWidth
                disablePortal
                freeSolo
                value={itemTags}
                onChange={(_event, newValue) => {
                    setItemTags(newValue);
                }}
                options={tags}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => (
                    <TextField {...params} label="Tags" margin="normal" />
                )}
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
                <PageHeader title="Products">
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={handleCreateClick}
                    >
                        Add
                    </Button>
                </PageHeader>

                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1 }} />
                    <Search value={search} onChange={(e) => setSearch(e.target.value)} />
                    <ProductFilter
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        // sortBy={sortBy}
                        // sorters={sorters}
                        // onSortersChange={handleSortersChange}
                    />
                </Toolbar>

                {(entities.length === 0) && (
                    <p>
                        <i>No Data</i>
                    </p>
                )}
                {(entities.length > 0) && (
                    <React.Fragment>
                        {renderItemsByCategories()}
                        {renderItemsWithoutCategories()}
                    </React.Fragment>
                )}
            </Container>

            <FormDialog
                open={createDialogOpen}
                onClose={handleCreateDialogClose}
                onSave={handleCreateSave}
                title={'Create Product'}
            >
                <Box component={'form'} onSubmit={handleCreateSave}>
                    {renderFormContent()}
                </Box>
            </FormDialog>

            <FormDialog
                open={editDialogOpen}
                onClose={handleEditDialogClose}
                onSave={handleEditSave}
                title={'Edit Product'}
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

export default ProductSettings;
