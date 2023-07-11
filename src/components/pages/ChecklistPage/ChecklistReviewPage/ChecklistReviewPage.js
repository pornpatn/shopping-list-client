import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { List, ListItem, ListItemButton, ListItemIcon, Checkbox, ListItemText, Toolbar } from '@mui/material';
import { useConfirm } from "material-ui-confirm";
import { selectCategories } from '../../../../store/categorySlice';
import { selectProducts } from '../../../../store/productSlice';
import { selectMarkets } from '../../../../store/marketSlice';
import {
    selectChecklists,
    updateChecklist,
} from '../../../../store/checklistSlice';
import {
    createOrder,
    NEW_ORDER_TEMPLATE,
} from '../../../../store/orderSlice';
import { userContext } from '../../../../hooks/userContext';

function ChecklistReviewPage() {
    const navigate = useNavigate();
    const { id: checklistId } = useParams();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const categories = useSelector(selectCategories);
    const products = useSelector(selectProducts);
    const markets = useSelector(selectMarkets);
    const checklists = useSelector(selectChecklists);
    const currentChecklist = checklists.find(c => c._id === checklistId);
    const [checklist, setChecklist] = useState(null);
    const [checkedIds, setCheckedIds] = useState([]);

    const [marketId, setMarketId] = useState('');
    const [scheduleDeliveryDate, setScheduleDeliveryDate] = useState(moment().add(1, 'day'));
    const [content, setContent] = useState('');

    const today = moment();

    const { profile } = useContext(userContext);
    useEffect(() => {
        if (!profile) {
            navigate("/login", { state: { to: "/checklists" } });
        }
    }, [profile, navigate]);

    useEffect(() => {
        setChecklist(currentChecklist);
    }, [currentChecklist]);

    const handleToggleAll = (e) => {
        if (e.target.checked) {
            setCheckedIds(checklist.items.map(item => item.product._id));
        } else {
            setCheckedIds([]);
        }
    };

    const handleToggle = (id) => {
        if (checkedIds.includes(id)) {
            setCheckedIds(checkedIds.filter(checkedId => checkedId !== id));
        } else {
            setCheckedIds([...checkedIds, id]);
        }
    };

    const renderItemRow = (item) => {
        return (
            <ListItem key={item.product._id} disablePadding disableGutters divider>
                <ListItemButton dense>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            tabIndex={-1}
                            disableRipple
                            checked={checkedIds.includes(item.product._id)}
                            onChange={() => handleToggle(item.product._id)}
                        />
                    </ListItemIcon>
                    <ListItemText primary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline', width: 40, paddingRight: 1 }}
                                component="span"
                                variant="body1"
                            >
                                {item.qty}
                            </Typography>
                            {item.unit && (
                                <Typography
                                    sx={{ display: 'inline', width: 40, paddingRight: 1 }}
                                    component="span"
                                    variant="body2"
                                >
                                    ({item.unit})
                                </Typography>
                            )}
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                            >
                                {item.product.name}
                            </Typography>
                        </React.Fragment>
                    } />
                </ListItemButton>
            </ListItem>
        );
    };

    const renderByCategory = (category) => {
        const productsToRender = products.filter(product => product.category?._id === category._id);
        if (productsToRender.length === 0) {
            return null;
        }

        const productIds = productsToRender.map(product => product._id);
        const itemsToRender = checklist.items.filter(item => (item.qty > 0) && productIds.includes(item.product._id));
        if (itemsToRender.length === 0) {
            return null;
        }

        return (
            <List key={category._id} dense disablePadding subheader={category.name}>
                {itemsToRender.map(item => renderItemRow(item))}
            </List>
        );
    };

    const changeChecklistStatus = (status) => {
        dispatch(updateChecklist({
            data: {
                _id: checklistId,
                status,
            }
        })).then(() => {
            navigate("/checklists");
        });
    };

    const handleDoneClick = () => {
        confirm({ description: "This action will mark checklist done." })
            .then(() => {
                changeChecklistStatus('done');
            })
            .catch(() => {
                // Done cancelled
            });
    };

    const isItemInOrder = (item) => ((item.qty > 0) && checkedIds.includes(item.product._id));

    const handleOrderClick = (e) => {
        e.preventDefault();

        const itemsToOrder = checklist.items.filter(item => isItemInOrder(item)).map(item => ({
            product: item.product,
            qty: item.qty,
            unit: item.unit,
        }));

        const newOrder = {
            ...NEW_ORDER_TEMPLATE,
            name: checklist.name,
            items: itemsToOrder,
            checklist: checklistId,
            market: marketId,
            scheduleDeliveryDate: scheduleDeliveryDate.format(),
            content,
        };

        dispatch(createOrder({ data: newOrder })).then(({ payload }) => 
        {
            if (payload) {
                changeChecklistStatus('ordered');
            }
        });
    };

    if (!checklist) {
        return (
            <div>
                Checklist not found!
            </div>
        )
    };

    return (
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
                <Typography
                    component="h1"
                    variant="h5"
                    color="text.primary"
                    gutterBottom
                >
                    {checklist.name}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
            </Box>

            <div>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Market / Supplier</InputLabel>
                    <Select
                        id="market"
                        required
                        labelId="market-lebel"
                        value={marketId}
                        label="Market / Supplier"
                        onChange={(event) => {
                            setMarketId(event.target.value);
                        }}
                    >
                        {markets.map((market) => (
                            <MenuItem key={market._id} value={market._id}>{market.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl margin="normal">
                    <DatePicker
                        label="Delivery Date"
                        inputFormat="MM/DD/YYYY"
                        minDate={today}
                        value={scheduleDeliveryDate}
                        onChange={setScheduleDeliveryDate}
                        slotProps={{ textField: { margin: 'normal' } }}
                        // renderInput={(params) => <TextField margin="normal" {...params} />}
                    />
                </FormControl>
            </div>

            <Toolbar disableGutters>
                <Checkbox
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    onChange={(e) => handleToggleAll(e)}
                    checked={checkedIds.length === checklist.items.length}
                    indeterminate={(checkedIds.length > 0) && (checkedIds.length !== checklist.items.length)}
                />
                <Typography variant="body2">Select All Items</Typography>
            </Toolbar>

            {categories.map(category => renderByCategory(category))}

            <div>
                <FormControl fullWidth margin="normal">
                    <TextField
                        id="content"
                        label="Content"
                        fullWidth
                        multiline
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        margin="normal"
                    />
                </FormControl>
            </div>

            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleDoneClick}
                >
                    Close
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOrderClick}
                >
                    Order
                </Button>

            </Box>

            {/* <Box sx={{ paddingTop: 2 }}>
                <Typography
                    variant="subtitle1"
                    color="text.primary"
                >
                    Orders
                </Typography>
                <List disablePadding>
                    <ListItem
                        // key={item.id}
                        // onClick={() => handleItemClick(item.id)}
                        divider
                        dense
                        disableGutters
                        secondaryAction={
                            <IconButton edge="end" size="large" aria-label="continue">
                                <ArrowRightIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        <ListItemButton>
                            <ListItemText
                                primary={'Thai Market'}
                                primaryTypographyProps={{ variant: "subtitle2" }}
                                secondary={(
                                    <React.Fragment>
                                        <Typography variant="body2" component="div">Apr 22, 2023</Typography>
                                        <Typography variant="body2" component="div">5 Tomato, 2 Chicken, 1 Coconut Large, ...</Typography>
                                    </React.Fragment>
                                )}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem
                        // key={item.id}
                        // onClick={() => handleItemClick(item.id)}
                        divider
                        dense
                        disableGutters
                        secondaryAction={
                            <IconButton edge="end" size="large" aria-label="continue">
                                <ArrowRightIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        <ListItemButton>
                            <ListItemText
                                primary={'Wonder Market'}
                                primaryTypographyProps={{ variant: "subtitle2" }}
                                secondary={(
                                    <React.Fragment>
                                        <Typography variant="body2" component="div">Apr 22, 2023</Typography>
                                        <Typography variant="body2" component="div">5 Tomato, 2 Chicken, 1 Coconut Large, ...</Typography>
                                    </React.Fragment>
                                )}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box> */}

        </Container>
    );
}

export default ChecklistReviewPage;
