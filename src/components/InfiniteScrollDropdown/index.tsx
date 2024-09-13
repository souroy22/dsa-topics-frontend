import { FC, useEffect } from "react";
import { TextField, Autocomplete, CircularProgress, Box } from "@mui/material";
import { OPTION_TOPIC_TYPE } from "../QuestionForm";

export interface DROPDOWN_OPTION_TYPE {
  title: string;
  slug: string | number;
}

interface InfiniteScrollDropdownProps {
  label: string;
  required?: boolean;
  handleSelect: (value: OPTION_TOPIC_TYPE | null) => void;
  handleChange: (value: string) => void;
  error?: boolean;
  loading: boolean;
  disabled?: boolean;
  hasMore: boolean;
  helperText?: string;
  options: OPTION_TOPIC_TYPE[];
  selectedOption?: OPTION_TOPIC_TYPE;
  loadMore: () => void;
  handleClose?: () => void;
}

const InfiniteScrollDropdown: FC<InfiniteScrollDropdownProps> = ({
  label,
  required = false,
  handleSelect,
  handleChange,
  error,
  helperText,
  loading,
  hasMore,
  options,
  loadMore,
  handleClose,
  selectedOption = null,
  disabled = false,
}) => {
  const handleScroll = (event: React.ChangeEvent<{}>) => {
    const bottom =
      (event.target as HTMLElement).scrollHeight -
        (event.target as HTMLElement).scrollTop ===
      (event.target as HTMLElement).clientHeight;
    if (bottom && !loading && hasMore) {
      loadMore();
    }
  };

  useEffect(() => {}, [selectedOption]);

  return (
    <Autocomplete
      disablePortal
      options={options}
      value={selectedOption}
      getOptionLabel={(option) => option.title}
      onChange={(_, newValue) => handleSelect(newValue)}
      loading={loading}
      disabled={disabled}
      onClose={() => {
        handleClose && handleClose();
      }}
      onInputChange={(_, __, reason) => {
        if (reason === "clear") {
          handleSelect(null);
        }
      }}
      ListboxProps={{
        onScroll: handleScroll,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          onChange={(event) => handleChange(event.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            backgroundColor:
              selectedOption?.slug === option.slug
                ? "rgba(0, 123, 255, 0.1)"
                : "inherit",
            fontWeight:
              selectedOption?.slug === option.slug ? "bold" : "normal",
          }}
        >
          {option.title}
        </Box>
      )}
    />
  );
};

export default InfiniteScrollDropdown;
