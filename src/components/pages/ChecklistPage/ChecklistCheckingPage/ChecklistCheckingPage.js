import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import { Accordion, AccordionSummary, AccordionDetails, ButtonBase } from '@mui/material';
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
import useSessionHook from '../../../../hooks/useSessionHook';
import FormDialog from '../../../molecules/FormDialog';

const EMPTY_ITEM = {
    qty: 0,
    checked: false,
};

function ChecklistCheckingPage() {
    const navigate = useNavigate();
    const { id: checkListId } = useParams();
    const dispatch = useDispatch();
    
    const { isLogin } = useSessionHook();
    useEffect(() => {
        if (!isLogin) {
            navigate("/login");
        }
    }, [isLogin, navigate]);

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

    const products = useMemo(() => {
        const searchTerm = search.toLowerCase();

        const isMatched = (product) => product.name.toLowerCase().includes(searchTerm)
            && ((checkedCategories.length === 0) || checkedCategories.includes(product.category))
            && ((checkedTags.length === 0) || product.tags.find(tag => checkedTags.includes(tag)));

        return allProducts.filter(product => isMatched(product));
    }, [allProducts, search, checkedCategories, checkedTags]);

    useEffect(() => {
        setChecklist(currentChecklist);
    }, [currentChecklist]);

    const toggleNameMode = () => setNameEditMode(!nameEditMode);

    const findItemByProduct = (product) => checklist.items.find(item => item.product._id === product._id);

    const handleQtyClick = (product) => {
        const item = findItemByProduct(product);
        if (item) {
            setChecklist({
                ...checklist,
                items: checklist.items.map(item => item.product._id === product._id ? {
                    ...item,
                    qty: Number(item.qty) + 1,
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
    };

    const handleItemClick = (product) => {
        setSelectedProduct(product);
        setSelectedItem(findItemByProduct(product) || EMPTY_ITEM)
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
            setAddItemDialogOpen(false);
        };

        createProductAndItem();
    };

    const renderProductRow = (product) => {
        const item = findItemByProduct(product) || EMPTY_ITEM;

        return (
            <div key={product._id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid lightgray' }}>
                <div style={{ width: 40, textAlign: 'center' }}>
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
                <ButtonBase
                    style={{ flexGrow: 1, justifyContent: 'flex-start' }}
                    onClick={() => handleItemClick(product)}
                >
                    <Typography variant="body1">{product.name}</Typography>
                </ButtonBase>
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
        const productsToRender = products.filter(product => product.category === category);

        if (productsToRender.length === 0) {
            return null;
        }

        return (
            <Accordion key={category} disableGutters defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    {category}
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
                        onClick={() => {
                            dispatch(updateChecklist({ data: checklist }));
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        // to={'review'}
                        // component={Link}
                        onClick={() => {
                            dispatch(updateChecklist({ data: checklist })).then(() => {
                                navigate('review');
                            });
                        }}
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
                    {/* Tags */}
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
