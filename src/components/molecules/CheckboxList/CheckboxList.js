import React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function CheckboxList({ label, options = [], checked = [], onChange }) {
    return (
        <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
                <FormLabel component="legend">{label}</FormLabel>
                <FormGroup>
                    {options.map(option => (
                        <FormControlLabel
                            key={option.id}
                            control={
                                <Checkbox
                                    checked={checked.includes(option.id)}
                                    onChange={onChange}
                                    name={option.id} />
                            }
                            label={option.label}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </Box>
    );
}
