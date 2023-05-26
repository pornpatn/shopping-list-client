import React from "react";
import { Box, IconButton, Popover, Divider, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckboxList from "../CheckboxList";

export default function ProductFilter({ filters, onFiltersChange, sortBy, sorters, onSortersChange }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleFilterChange = (filter) => (event) => {
        if (!onFiltersChange) {
            return;
        }

        const id = event.target.name;
        const evt = {
            target: {
                name: filter.name,
                selected: event.target.checked ? [...filter.selected, id] : filter.selected.filter(val => val !== id),
            },
        };
        onFiltersChange(evt);
    };

    const handleSorterChange = (sorter) => () => {
        if (!onSortersChange) {
            return;
        }

        const evt = {
            target: {
                name: sorter.name,
                direction: ((sortBy.name === sorter.name) && (sortBy.direction === 'asc')) ? 'desc' : 'asc',
                sorter,
            },
        };
        onSortersChange(evt);
    };

    return (
        <Box>
            <IconButton
                size="small"
                aria-label="Filters"
                color="inherit"
                onClick={handleFilterClick}
            >
                <FilterListIcon />
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {filters.map(filter => (
                    <React.Fragment key={filter.name}>
                        <CheckboxList
                            label={filter.label}
                            options={filter.options}
                            checked={filter.selected}
                            onChange={handleFilterChange(filter)}
                        />
                        <Divider />
                    </React.Fragment>
                ))}
                {sorters && (
                    <React.Fragment>
                        <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
                            <FormLabel component="legend">Sorted by</FormLabel>
                        </FormControl>
                        <List>
                            {sorters.map(sorter => (
                                <ListItemButton
                                    key={sorter.name}
                                    dense
                                    selected={sortBy.name === sorter.name}
                                    onClick={handleSorterChange(sorter)}
                                >
                                    <ListItemText primary={sorter.label} />
                                    {(sortBy.name === sorter.name) && (
                                        <ListItemIcon size="xs">
                                            {sortBy.direction === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                        </ListItemIcon>
                                    )}
                                </ListItemButton>
                            ))}
                        </List>
                    </React.Fragment>
                )}
                <Box sx={{ padding: 0.5, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleFilterClose}>Apply</Button>
                </Box>
            </Popover>
        </Box>
    );
}
