import emotionStyled from '@emotion/styled';
import {Box, IconButton, TextField} from '@mui/material';
import React from 'react';
import {CancelIcon} from '~/assets/icons/CancelIcon';
import {EditIcon} from '~/assets/icons/EditIcon';
import {SaveIcon} from '~/assets/icons/SaveIcon';

type Props = {
  className?: string;
  text?: string | null;
  Component: React.FC<React.PropsWithChildren>;
  onSave: (text: string) => void;
  multilineTextInput?: boolean;
  fontSize?: string;
  inputMarginTop?: string;
  /** Extra components to be displayed next to the text element */
  textAdornment?: JSX.Element | null;
}

export const EditableText: React.FC<Props> = (props) => {
  const baseText = props.text ?? ``
  const [isEditing, setIsEditing] = React.useState(false)
  const [currentText, setCurrentText] = React.useState(baseText)
  const cancelEdit = () => {
    setIsEditing(false)
    setCurrentText(baseText)
  }
  const saveText = () => {
    setIsEditing(false)
    if (currentText === props.text) return
    props.onSave(currentText)
  }
  return (
    <Root className={props.className}>
      {!isEditing ?
        <props.Component>
          {props.text}
          {props.textAdornment}
        </props.Component>
        :
        <TextField
          fullWidth
          autoFocus
          variant='standard'
          multiline={props.multilineTextInput}
          value={currentText}
          onChange={(evt) => setCurrentText(evt.target.value)}
          sx={{marginTop: props.inputMarginTop}}
          InputProps={{
            sx: {fontSize: props.fontSize},
            endAdornment: (
              <Box display={`flex`} alignItems={`center`}>
                <IconButton onClick={cancelEdit}>
                  <CancelIcon/>
                </IconButton>
                <IconButton onClick={saveText}>
                  <SaveIcon/>
                </IconButton>
              </Box>
            )
          }}
        />
      }
      {!isEditing &&
        <IconButton onClick={() => setIsEditing(true)}>
          <EditIcon/>
        </IconButton>
      }
    </Root>
  )
}

const Root = emotionStyled.div({
  display: `flex`,
  justifyContent: `space-between`,
  alignItems: `center`,
})