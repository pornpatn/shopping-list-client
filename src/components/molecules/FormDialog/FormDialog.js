import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const DEFAULT_DIALOG_PROPS = {
    fullScreen: true,
    scroll: 'paper',
};

function FormDialog({ open, onClose, onSave, title, dialogProps = DEFAULT_DIALOG_PROPS, children }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            {...dialogProps}
        >
            <AppBar sx={{ position: 'relative' }} color="inherit">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {title}
                    </Typography>
                    <Button variant="contained" onClick={onSave}>
                        Save
                    </Button>
                </Toolbar>
            </AppBar>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="inherit" onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={onSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormDialog;
