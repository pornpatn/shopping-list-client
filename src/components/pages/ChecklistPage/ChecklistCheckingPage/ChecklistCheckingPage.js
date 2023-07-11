import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Accordion, AccordionSummary, AccordionDetails, ButtonBase } from '@mui/material';
import { useConfirm } from "material-ui-confirm";
import Search from '../../../molecules/Search';
import ProductFilter from '../../../molecules/ProductFilter';
import { selectCategories } from '../../../../store/categorySlice';
import { selectTags } from '../../../../store/tagSlice';
import {
    NEW_PRODUCT_TEMPLATE,
    createProduct,
    selectProducts,
} from '../../../../store/productSlice';
import { selectChecklists, updateChecklist } from '../../../../store/checklistSlice';
import { userContext } from '../../../../hooks/userContext';
import FormDialog from '../../../molecules/FormDialog';

const EMPTY_ITEM = {
    qty: 0,
    unit: '',
    checked: false,
};

function ChecklistCheckingPage() {
    const navigate = useNavigate();
    const { id: checkListId } = useParams();
    const dispatch = useDispatch();
    const confirm = useConfirm();

    const { profile } = useContext(userContext);
    useEffect(() => {
        if (!profile) {
            navigate("/login", { state: { to: "/checklists" }});
        }
    }, [profile, navigate]);

    const categories = useSelector(selectCategories);
    const tags = useSelector(selectTags);
    const allProducts = useSelector(selectProducts);
    const checklists = useSelector(selectChecklists);
    const currentChecklist = checklists.find(c => c._id === checkListId);

    const [checklist, setChecklist] = useState(null);
    const [nameEditMode, setNameEditMode] = useState(false);

    const [itemDialogOpen, setItemDialogOpen] = useState(false);
    const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [selectedProduct, setSelectedProduct] = useState({});
    const [selectedCategory, setSelectedCategory] = useState({});

    const [search, setSearch] = useState("");

    const [hiddenFilters, setHiddenFilters] = useState([]);
    const [checkedCategories, setCheckedCategories] = useState([]);
    const [checkedTags, setCheckedTags] = useState([]);

    const [hasChange, setHasChange] = useState(false);
    const hasItems = checklist?.items.length > 0;
    const hasQty = checklist?.items.some(item => item.qty);

    const filters = [
        {
            name: 'hidden',
            label: 'Show / Hide',
            options: [{ id: 'checked', label: 'Hide Checked' }],
            selected: hiddenFilters,
        },
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
        } else if (name === 'hidden') {
            setHiddenFilters(selected);
        }
    };

    const products = useMemo(() => {
        const searchTerm = search.toLowerCase();

        const isMatched = (product) => product.name.toLowerCase().includes(searchTerm)
            && ((checkedCategories.length === 0) || checkedCategories.includes(product.category?._id))
            && ((checkedTags.length === 0) || product.tags.find(tag => checkedTags.includes(tag)));

        return allProducts.filter(product => isMatched(product));
    }, [allProducts, search, checkedCategories, checkedTags]);

    useEffect(() => {
        setChecklist(currentChecklist);
    }, [currentChecklist]);

    const toggleNameMode = () => setNameEditMode(!nameEditMode);

    const findItemByProduct = (product) => checklist.items.find(item => ((item.product === product._id) || (item.product._id === product._id)));

    const handleChecklistResetClick = () => {
        confirm({ description: "Clear checklist?" })
        .then(() => {
            dispatch(updateChecklist({ data: {
                ...checklist,
                items: []
            }})).then(() => {
                setHasChange(false);
            });
        })
        .catch(() => {
            // Reset cancelled
        });
    };

    const handleChecklistSaveClick = () => {
        dispatch(updateChecklist({ data: checklist })).then(() => {
            setHasChange(false);
        });
    };

    const handleChecklistReviewClick = () => {
        dispatch(updateChecklist({ data: checklist })).then(() => {
            navigate('review');
        });
    };

    const handleQtyClick = (product) => {
        const item = findItemByProduct(product);
        if (item) {
            setChecklist({
                ...checklist,
                items: checklist.items.map(item => item.product._id === product._id ? {
                    ...item,
                    qty: Number(item.qty) + 1,
                    unit: product.units?.[0],
                } : item),
            })

        } else {
            setChecklist({
                ...checklist,
                items: [...checklist.items, {
                    ...EMPTY_ITEM,
                    product: product,
                    qty: 1,
                }],
            })
        }
        setHasChange(true);
    };

    const handleCancelClick = (product) => {
        setChecklist({
            ...checklist,
            items: checklist.items.filter(item => item.product._id !== product._id),
        });
    };

    const handleUnitClick = (product, unit) => {
        const item = findItemByProduct(product);
        let newUnit = unit;
        if (product.units?.length > 1) {
            const unitIndex = product.units?.findIndex(u => u === unit);
            newUnit = product.units?.[unitIndex + 1] || product.units?.[0];
        }
        if (item) {
            setChecklist({
                ...checklist,
                items: checklist.items.map(item => item.product._id === product._id ? {
                    ...item,
                    unit: newUnit,
                } : item),
            })

        } else {
            setChecklist({
                ...checklist,
                items: [...checklist.items, {
                    ...EMPTY_ITEM,
                    product: product,
                    unit: newUnit,
                }],
            })
        }
        setHasChange(true);
    };

    const handleCheckClick = (product) => {
        const item = findItemByProduct(product);
        if (item) {
            setChecklist({
                ...checklist,
                items: checklist.items.map(item => item.product._id === product._id ? {
                    ...item,
                    checked: !item.checked,
                } : item),
            })

        } else {
            setChecklist({
                ...checklist,
                items: [...checklist.items, {
                    ...EMPTY_ITEM,
                    product: product,
                    checked: true,
                }],
            })
        }
        setHasChange(true);
    };

    const handleItemClick = (product) => {
        setSelectedProduct(product);
        const item = findItemByProduct(product);
        setSelectedItem({
            ...EMPTY_ITEM,
            unit: product.units?.[0],
            ...item,
        });
        setItemDialogOpen(true);
    };

    const handleItemDialogClose = () => {
        setItemDialogOpen(false);
    };

    const handleItemSave = (e) => {
        e.preventDefault();

        const item = findItemByProduct(selectedProduct);
        if (item) {
            setChecklist({
                ...checklist,
                items: checklist.items.map(item => item.product._id === selectedProduct._id ? {
                    ...item,
                    ...selectedItem,
                } : item),
            })

        } else {
            setChecklist({
                ...checklist,
                items: [...checklist.items, {
                    ...EMPTY_ITEM,
                    product: selectedProduct,
                    ...selectedItem,
                }],
            })
        }
        setHasChange(true);
        setItemDialogOpen(false);
    };

    const handleAddItemClick = (category) => {
        setSelectedItem(EMPTY_ITEM);
        setSelectedProduct({
            ...NEW_PRODUCT_TEMPLATE,
            category,
        });
        setSelectedCategory(category);
        setAddItemDialogOpen(true);
    };

    const handleAddItemDialogClose = () => {
        setAddItemDialogOpen(false);
    };

    const handleAddItemDialogSave = () => {
        const createProductAndItem = async () => {
            const newItem = selectedItem;
            const product = await dispatch(createProduct({ data: selectedProduct })).unwrap();

            setChecklist({
                ...checklist,
                items: [...checklist.items, {
                    ...newItem,
                    product,
                }],
            })
            setHasChange(true);
            setAddItemDialogOpen(false);
        };

        createProductAndItem();
    };

    const renderProductRow = (product) => {
        const item = findItemByProduct(product) || EMPTY_ITEM;
        const unit = item.unit || product.units?.[0];

        if (hiddenFilters.some(filter => item[filter])) {
            return null;
        }

        return (
            <div key={product._id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid lightgray', gap: 8, height: 40 }}>
                <div style={{ width: 32, textAlign: 'center' }}>
                    {(item.qty || item.checked) ? (
                        <ButtonBase
                            style={{ width: 40 }}
                            onClick={() => handleQtyClick(product)}
                        >
                            <div>{item.qty || '-'}</div>
                        </ButtonBase>
                    ) : (
                        <IconButton
                            color="default"
                            size="small"
                            onClick={() => handleQtyClick(product)}
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    )}
                </div>
                {(item.qty) > 0 && (
                    <IconButton onClick={() => handleCancelClick(product)}>
                        <CancelOutlinedIcon />
                    </IconButton>
                )}
                <ButtonBase
                    style={{ flexGrow: 1, justifyContent: 'flex-start' }}
                    onClick={() => handleItemClick(product)}
                >
                    <Typography variant="body1">{product.name}</Typography>
                </ButtonBase>
                {(product.units?.length === 1) && (
                    <Typography variant="body2">{unit}</Typography>
                )}
                {(product.units?.length > 1) && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleUnitClick(product, unit)}
                    >
                        {unit}
                    </Button>
                )}
                {item.checked ? (
                    <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleCheckClick(product)}
                    >
                        <CheckCircleIcon />
                    </IconButton>
                ) : (
                    <IconButton
                        size="small"
                        color="default"
                        onClick={() => handleCheckClick(product)}
                    >
                        <CheckCircleOutlineRoundedIcon />
                    </IconButton>
                )}
            </div>
        );
    };

    const renderByCategory = (category) => {
        const productsToRender = products.filter(product => product.category?._id === category._id);

        if (productsToRender.length === 0) {
            return null;
        }

        return (
            <Accordion key={category._id} disableGutters defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    {category.name}
                </AccordionSummary>
                <AccordionDetails>
                    <div>
                        {productsToRender.map(product => renderProductRow(product))}
                        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 40 }}>
                            <Button
                                onClick={() => handleAddItemClick(category)}
                            >
                                Add New Item
                            </Button>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>
        );
    };

    if (!checklist) {
        return (
            <div>
                Checklist not found!
            </div>
        )
    };

    return (
        <React.Fragment>
            <Container maxWidth="xl" disableGutters>
                <Box sx={{
                    display: 'flex',
                    padding: 1,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1100,
                    backgroundColor: 'background.paper',
                    alignItems: 'center'
                }}>
                    <IconButton
                        size="sm"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    {nameEditMode ? (
                        <TextField
                            id="name"
                            label="Name"
                            fullWidth
                            required
                            value={checklist.name}
                            onChange={(e) => { setChecklist({ ...checklist, name: e.target.value }) }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    toggleNameMode();
                                }
                            }}
                            margin="normal"
                        />
                    ) : (
                        <Typography
                            component="h1"
                            variant="h5"
                            color="text.primary"
                        >
                            {checklist.name}
                        </Typography>
                    )}
                    <IconButton
                        size="sm"
                        onClick={() => toggleNameMode()}
                    >
                        <EditIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                </Box>

                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1 }} />
                    <Search value={search} onChange={(e) => setSearch(e.target.value)} />
                    <ProductFilter
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                    />
                </Toolbar>

                {(products.length === 0) && (
                    <div>No product!</div>
                )}
                {categories.map(category => renderByCategory(category))}

                <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={handleChecklistResetClick}
                        disabled={!hasItems}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleChecklistSaveClick}
                        disabled={!hasChange}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleChecklistReviewClick}
                        disabled={!hasQty}
                    >
                        Review
                    </Button>
                </Box>

            </Container>
            <FormDialog
                open={itemDialogOpen}
                onClose={handleItemDialogClose}
                onSave={handleItemSave}
                title={selectedProduct?.name}
            >
                <Box component={'form'} onSubmit={handleItemSave}>
                    <TextField
                        id="qty"
                        label="Qty"
                        fullWidth
                        required
                        value={selectedItem.qty}
                        onChange={(e) => { setSelectedItem({ ...selectedItem, qty: e.target.value }) }}
                        onFocus={(e) => { e.target.select(); }}
                        margin="normal"
                        type="number"
                        inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    {(selectedProduct.units?.length > 0) && (
                        <FormControl fullWidth>
                            <InputLabel id="unit-label">Unit</InputLabel>
                            <Select
                                id="unit"
                                labelId="unit-lebel"
                                value={selectedItem.unit}
                                label="Unit"
                                onChange={(e) => {
                                    setSelectedItem({ ...selectedItem, unit: e.target.value });
                                }}
                            >
                                {selectedProduct.units.map((unit) => (
                                    <MenuItem value={unit}>{unit}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    {(selectedProduct.tags?.length > 0) && (
                        <div>
                            <span>Tag: </span>
                            {selectedProduct.tags.map(tag => <Chip label={tag} size="small" sx={{ margin: 0.5 }} />)}
                        </div>
                    )}
                    <Typography variant="body1">
                        {selectedProduct.content}
                    </Typography>
                </Box>
            </FormDialog>
            <FormDialog
                open={addItemDialogOpen}
                onClose={handleAddItemDialogClose}
                onSave={handleAddItemDialogSave}
                title={'Add New Item'}
            >
                <Box component={'form'} onSubmit={handleAddItemDialogSave}>
                    <TextField
                        id="name"
                        label="Name"
                        fullWidth
                        required
                        value={selectedProduct.name}
                        onChange={(e) => { setSelectedProduct({ ...selectedProduct, name: e.target.value }) }}
                        onFocus={(e) => { e.target.select(); }}
                        margin="normal"
                    />
                    <TextField
                        id="category"
                        label="Category"
                        fullWidth
                        required
                        value={selectedCategory.name}
                        InputProps={{
                            readOnly: true,
                        }}
                        margin="normal"
                    />
                    <TextField
                        id="qty"
                        label="Qty"
                        fullWidth
                        required
                        value={selectedItem.qty}
                        onChange={(e) => { setSelectedItem({ ...selectedItem, qty: e.target.value }) }}
                        onFocus={(e) => { e.target.select(); }}
                        margin="normal"
                        type="number"
                        inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                </Box>
            </FormDialog>
        </React.Fragment>
    );
}

export default ChecklistCheckingPage;
