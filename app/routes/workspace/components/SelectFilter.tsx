import styled from "@emotion/styled";
import {Button, Checkbox, Divider, ListItemText, MenuItem, MenuList, Paper, Popover} from "@mui/material";
import React from "react";
import {FilterWithAllOption, allFilter} from "~/types/FilterWithAllOption";

type Option<T> = {
  value: T;
  label: string;
}

export type Props<T extends string = string> = {
  label: string;
  value: Array<FilterWithAllOption<T>>;
  onChange: (value: Array<FilterWithAllOption<T>>) => void;
  options: Array<Option<FilterWithAllOption<T>>>;
  disabled?: boolean;
  fullWidth?: boolean;
};

export const SelectFilter = <T extends string = string>(props: Props<T>) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `filter-popover` : undefined;

  return (
    <>
      <Button
        fullWidth={props.fullWidth}
        aria-describedby={id}
        variant="outlined"
        disabled={props.disabled}
        onClick={handleClick}
        sx={{height: `100%`}}
      >
        {props.label}
        {props.value.includes(allFilter) ? `` : ` (${props.value.length})`}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        disableEnforceFocus={true}
        onClose={handleClose}
        anchorOrigin={{
          vertical: `bottom`,
          horizontal: `left`,
        }}
        transformOrigin={{
          vertical: `top`,
          horizontal: `left`,
        }}
      >
        <Paper sx={{width: 420, maxWidth: `100%`, maxHeight: `100%`}}>
          <MenuList>
            <MenuItem onClick={() => props.onChange([allFilter])}>
              <Checkbox
                checked={props.value.includes(allFilter)}
                size="small"
                style={checkboxStyle}/>
              <ListItemText>All</ListItemText>
            </MenuItem>
            <Divider/>
            {props.options.map((option, index) => {
              return (
                <MenuItem key={option.value} onClick={() => {
                  let newValues: Array<FilterWithAllOption<T>> = [];
                  if (props.value.includes(option.value)) {
                    newValues = props.value.filter(value => value !== option.value);
                  } else {
                    newValues = [...props.value.filter(value => value !== allFilter), option.value];
                  }
                  if (newValues.length === 0) {
                    newValues = [allFilter];
                  }
                  props.onChange(newValues);
                }}>
                  <Checkbox
                    checked={props.value.includes(option.value)}
                    size="small"
                    style={checkboxStyle}
                  />
                  <ListItemText primary={option.label}/>
                </MenuItem>
              );
            })}
          </MenuList>
        </Paper>
      </Popover>
    </>
  );
};

const checkboxStyle = {
  padding: 0,
  marginRight: `1em`,
};