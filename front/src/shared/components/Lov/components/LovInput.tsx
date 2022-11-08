import { AutocompleteRenderInputParams, Box, CircularProgress, TextField, useTheme } from "@mui/material";
import React from "react";
import { FiPlus } from "react-icons/fi";

interface ILovInput {
  onAddOpen?: () => void;
  placeholder?: string;
  params: AutocompleteRenderInputParams;
  error?: boolean;
  loading?: boolean;
}

export const useStyles = () => ({} as any); // gambi

const LovInput: React.FC<ILovInput> = ({ onAddOpen, placeholder, params, error = false, loading = false }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Box display="flex" flex="direction">
      {onAddOpen && (
        <div
          style={{ backgroundColor: theme.palette.primary.main }}
          className="addContainer hover:darken transition-filter"
          onMouseDown={onAddOpen}
        >
          <FiPlus size={20} color="#fff" />
        </div>
      )}
      <TextField
        {...params}
        placeholder={placeholder}
        className="lovTextField"
        variant="outlined"
        classes={{ root: error ? classes.borderErrorColor : undefined }}
        InputProps={{
          ...params.InputProps,
          className: `${params.InputProps.className}`,
          endAdornment: (
            <>
              {loading ? <CircularProgress color="inherit" size={20} /> : null}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    </Box>
  );
};

export default LovInput;
