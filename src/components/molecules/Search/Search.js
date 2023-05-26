import React, { useRef } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const SearchContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function Search(props) {
    const inputRef = useRef(null);
    return (
        <SearchContainer>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                inputRef={inputRef}
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                {...props}
                endAdornment={props.value ? (
                    <IconButton
                        aria-label="clear"
                        onClick={() => {
                            if (inputRef.current) {
                                inputRef.current.value = '';

                                if (props.onChange) {
                                    const evt = { target: inputRef.current };
                                    props.onChange(evt);
                                }

                                inputRef.current.focus();
                            }
                        }}
                        edge="end"
                        sx={{ marginRight: 1 }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : (null)}
            />
        </SearchContainer>
    );
}

export default Search;
