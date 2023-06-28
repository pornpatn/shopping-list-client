import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Chip from '@mui/material/Chip';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
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
    fetchProductList,
} from '../../../../store/productSlice';
import { selectCategories } from '../../../../store/categorySlice';
import { selectTags, fetchTagList } from '../../../../store/tagSlice';
import useSessionHook from '../../../../hooks/useSessionHook';

const DEFAULT_UNITS = ['case', 'each', 'pack', 'bag'];

function ProductSettings() {
    const dispatch = useDispatch();
    const entities = useSelector(selectItems);
    const categories = useSelector(selectCategories);
    const tags = useSelector(selectTags);
    const [selectedItem, setSelectedItem] = useState({});
    const [itemCategoryId, setItemCategoryId] = useState(null);
    const [itemTags, setItemTags] = useState([]);
    const [itemUnits, setItemUnits] = useState([]);

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
            options: categories.map(category => ({ id: category._id, label: category.name })),
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
            && ((checkedCategories.length === 0) || checkedCategories.includes(product.category?._id))
            && ((checkedTags.length === 0) || product.tags.find(tag => checkedTags.includes(tag)));

        return entities.filter(product => isMatched(product));
    }, [entities, search, checkedCategories, checkedTags]);

    const refreshData = () => {
        dispatch(fetchTagList());
        dispatch(fetchProductList());
    };

    const handleCreateClick = () => {
        setSelectedItem({ ...NEW_ITEM_TEMPLETE });
        setItemCategoryId(null);
        setItemTags([]);
        setItemUnits([]);
        setCreateDialogOpen(true);
    };

    const handleCreateDialogClose = () => {
        setCreateDialogOpen(false);
    };

    const handleCreateSave = (e) => {
        e.preventDefault();
        const newItem = {
            ...selectedItem,
            category: {
                _id: itemCategoryId,
            },
            tags: itemTags,
            units: itemUnits,
            // TODO: market codes
        };
        dispatch(createItem({ data: newItem })).unwrap();
        setCreateDialogOpen(false);
        refreshData();
    };

    const handleItemClick = (id) => {
        const foundItem = entities.find(item => item._id === id);
        if (foundItem) {
            setSelectedItem(foundItem);
            setItemCategoryId(foundItem.category?._id);
            setItemTags(foundItem.tags);
            setItemUnits(foundItem.units);
            // TODO: market codes
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
            category: {
                _id: itemCategoryId,
            },
            tags: itemTags,
            units: itemUnits,
            // TODO: market codes
        };
        dispatch(updateItem({ data: updatedItem })).then(() => {
            setEditDialogOpen(false);
            refreshData();
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

    const handleOrderMinusClick = (item) => (e) => {
        e.preventDefault();
        const order = (item.order ?? 0) - 1;
        const updatedItem = {
            ...item,
            order,
        };
        dispatch(updateItem({ data: updatedItem })).then(() => {
            refreshData();
        });
    };

    const handleOrderPlusClick = (item) => (e) => {
        e.preventDefault();
        const order = (item.order ?? 0) + 1;
        const updatedItem = {
            ...item,
            order,
        };
        dispatch(updateItem({ data: updatedItem })).then(() => {
            refreshData();
        });
    };

    const renderItems = (items) => {
        if (items.length === 0) {
            return null;
        }

        return items.map(item => (
            <ListItem
                key={item._id}
                divider
                disablePadding
                secondaryAction={
                    <div>
                        <IconButton onClick={handleOrderMinusClick(item)}>
                            <RemoveIcon />
                        </IconButton>
                        <Chip label={item.order ?? '-'} variant="outlined" color="default" />
                        <IconButton onClick={handleOrderPlusClick(item)}>
                            <AddIcon />
                        </IconButton>
                    </div>
                }
            >
                <ListItemButton
                    onClick={() => handleItemClick(item._id)}
                >
                    <ListItemText
                        primary={item.name}
                        secondary={(
                            <React.Fragment>
                                {(item.units.length > 0) && (
                                    <span><span>units: </span>{item.units.join(', ')}</span>
                                )}
                                {(item.tags.length > 0) && (
                                    <span><span>tags: </span>{item.tags.join(', ')}</span>
                                )}
                            </React.Fragment>
                        )}
                    />
                </ListItemButton>
            </ListItem>
        ));
    };

    const renderItemsByCategories = () => {
        return categories.map((category) => {
            const itemsToRender = products.filter(item => item.category?._id === category._id);
            if (itemsToRender.length === 0) {
                return null;
            }

            return (
                <List key={category._id} subheader={<ListSubheader color="primary" disableGutters>{category.name}</ListSubheader>}>
                    {renderItems(itemsToRender)}
                </List>
            )
        });
    };

    const renderItemsWithoutCategories = () => {
        const categoryIds = categories.map(category => category._id);
        const itemsToRender = products.filter(item => !categoryIds.includes(item.category?._id));
        if (itemsToRender.length === 0) {
            return null;
        }

        return (
            <List key={'no-category'} subheader={<ListSubheader disableGutters>No Category</ListSubheader>}>
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
                onFocus={(e) => { e.target.select(); }}
                onChange={(e) => { setSelectedItem({ ...selectedItem, name: e.target.value }) }}
                margin="normal"
            />
            <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    id="category"
                    labelId="category-lebel"
                    value={itemCategoryId}
                    label="Category"
                    onChange={(event) => {
                        setItemCategoryId(event.target.value);
                    }}
                >
                    {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
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
            <Autocomplete
                id="units"
                label="Units"
                multiple
                fullWidth
                disablePortal
                freeSolo
                value={itemUnits}
                onChange={(_event, newValue) => {
                    setItemUnits(newValue);
                }}
                options={DEFAULT_UNITS}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => (
                    <TextField {...params} label="Units" margin="normal" />
                )}
            />
            {/* TODO: Market Codes */}
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
