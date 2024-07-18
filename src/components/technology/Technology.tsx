import React, { useEffect, useState } from 'react';
import { TextField, Chip, Autocomplete, Button, Box } from '@mui/material';
import { getAllTechnology } from '../../api/technology/TechnologyAPI';
import { TechnologyDTO } from '../../model/TechnologyDTO';
interface TechnologyProps {
    handleIdsTechnology: (ids: number[]) => void;
}
export const Technology: React.FC<TechnologyProps> = ({ handleIdsTechnology }) => {
    const [technologyOptions, setTechnologyOptions] = useState<TechnologyDTO[]>([]);
    const [selectedTechnologies, setSelectedTechnologies] = useState<TechnologyDTO[]>([]);
    useEffect(() => {
        getAllTechnology().then((response) => {
            setTechnologyOptions(response.data);
        })
    }, []);
    const handleSelectedTechnologies = (select: TechnologyDTO[]) => {
        setSelectedTechnologies(select);
        const idSelected = technologyOptions.filter((item) => select.includes(item)).map((item) => item.id);
        handleIdsTechnology(idSelected);
    }
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Autocomplete
                multiple
                options={technologyOptions}
                getOptionLabel={(option) => option.name}
                value={selectedTechnologies}
                onChange={(event, newValue) => handleSelectedTechnologies(newValue)}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip label={option.name} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => <TextField {...params} label="Công nghệ sử dụng" />}
            />
        </Box>
    );
};
