import React from "react";
import emotionStyled from "@emotion/styled";
import {Box, IconButton, Stack, TextField} from "@mui/material";
import {ActionFunction, LoaderFunction, json} from "@remix-run/node";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {ExternalLabelCard} from "~/components/cards/ExternalLabelCard";
import {TicketInfo, findTicketById, serializedTicketToTicketInfo, updateAndGetTicket} from "~/server/db/ticketDb";
import {BodyText, H1, InformationalText} from "~/typography";
import {CardSubInfo} from "../../components/CardSubInfo";
import {EditableText} from "../../components/EditableText";
import {PriorityTag} from "../../components/PriorityTag";
import {UpdateTicketAction, FullUpdateTicketAction, TicketPreviousValue} from "./updateTicketAction";
import {SendIcon} from "~/assets/icons/SendIcon";
import {Comment} from "./Comment";
import {useAppContext} from "../../AppContext";
import {StatusTag} from "../../components/StatusTag";
import {UserSelect} from "../../components/UserSelect";
import {UserList} from "../../components/UserList";
import {TicketHistoryList} from "./TicketHistoryList";

export const action: ActionFunction = async ({request}) => {
  const data = await request.json() as FullUpdateTicketAction
  const newTicket = await updateAndGetTicket(data)
  return json(newTicket)
}

export const loader: LoaderFunction = async ({params}) => {
  const {ticketId} = params
  if (!ticketId) {
    return json(`Error`)
  }
  const ticket = await findTicketById(ticketId)
  if (!ticket) {
    return json(`Error`)
  }
  return json(ticket)
}

export default function Ticket() {
  const initialTicket = useLoaderData<TicketInfo>()
  const fetcher = useFetcher<TicketInfo>()
  const {currentUser} = useAppContext()
  const [currentComment, setCurrentComment] = React.useState(``)

  const updateTicket = (updateTicketAction: UpdateTicketAction, previousValue: TicketPreviousValue) => {
    const actionWithId: FullUpdateTicketAction = {
      userId: currentUser.id,
      ticketId: ticket.id,
      action: updateTicketAction,
      previousValue
    }
    fetcher.submit(actionWithId, {
      method: `post`,
      encType: `application/json`,
    })
  }

  const addComment = () => {
    if (!currentComment) return
    updateTicket({
      type: `addComment`,
      data: {
        userId: currentUser.id,
        message: currentComment
      }
    }, null)
    setCurrentComment(``)
  }

  let ticket: TicketInfo
  if (fetcher.data) {
    ticket = serializedTicketToTicketInfo(fetcher.data)
  } else {
    ticket = serializedTicketToTicketInfo(initialTicket)
  }
  return (
    <div>
      <EditableText
        text={ticket.title}
        Component={H1}
        fontSize="2.5rem"
        inputMarginTop="1.5rem"
        onSave={(text) => updateTicket({type: `title`, data: text}, ticket.title)}
      />
      <Breadcrumbs paths={[`e`, `E`]}/>
      <Container>
        <ExternalLabelCard label="Details">
          <Box display={`flex`} gap={`4px`}>
            <EditableDescription
              multilineTextInput
              text={ticket.content}
              Component={BodyText}
              onSave={(text) => updateTicket({type: `content`, data: text}, ticket.content)}
            />
            <Stack flex={1}>
              <UserSelect
                label="Assign Users"
                selectedUserIds={ticket.assignedUsers.map(user => user.id)}
                onChange={(userId) => {
                  if (ticket.assignedUsers.findIndex(user => user.id === userId) > -1) {
                    updateTicket({type: `removeUser`, data: userId}, null)
                  } else {
                    updateTicket({type: `assignUser`, data: userId}, null)
                  }
                }}
              />
              <UserList
                users={ticket.assignedUsers}
                onDelete={(userId) => updateTicket({type: `removeUser`, data: userId}, null)}
              />
            </Stack>
            <TicketMetadataInfoContainer flex={1}>
              <CardSubInfo
                label="Priority"
                details={
                  <PriorityTag
                    priority={ticket.priority}
                    editable
                    onChange={(priority) => updateTicket({type: `priority`, data: priority}, ticket.priority)}
                  />
                }
              />
              <CardSubInfo
                label="Status"
                details={
                  <StatusTag
                    status={ticket.status}
                    editable
                    onChange={(status) => updateTicket({type: `status`, data: status}, ticket.status)}
                  />
                }
              />
              <CardSubInfo label="Created Date" details={<InformationalText>{ticket.createdDate.toDateString()}</InformationalText>}/>
              {ticket.dueDate && <CardSubInfo label="Due Date" details={<InformationalText>{ticket.dueDate?.toDateString()}</InformationalText>}/>}
            </TicketMetadataInfoContainer>
          </Box>
        </ExternalLabelCard>
        <Box display={`flex`} gap={`40px`}>
          <CommentsCard label="Comments">
            <Stack spacing={`20px`} height={`100%`}>
              <ScrollContainer>
                {ticket.comments.map(comment => {
                  return (
                    <Comment key={comment.id} comment={comment}/>
                  )
                })}
              </ScrollContainer>
              <TextField
                variant="filled"
                placeholder="Comment here..."
                multiline
                rows={5}
                value={currentComment}
                onChange={(evt) => setCurrentComment(evt.target.value)}
                InputProps={{
                  onKeyDown: (event) => {
                    if (event.key === `Enter`) {
                      event.preventDefault();
                      addComment();
                    }
                  },
                  endAdornment: (
                    <IconButton sx={{alignSelf: `flex-end`}} onClick={addComment}>
                      <SendIcon/>
                    </IconButton>
                  )
                }}
              />
            </Stack>
          </CommentsCard>
          <HistoryCard label="History">
            <HistoryScrollableList history={ticket.history}/>
          </HistoryCard>
        </Box>
      </Container>
    </div>
  )
}

const EditableDescription = emotionStyled(EditableText)(props => ({
  flex: 2,
  alignItems: `flex-start`,
  paddingRight: 8,
  borderRight: `1px solid ${props.theme.color.content.divider}`,
}))

const TicketMetadataInfoContainer = emotionStyled(Stack)(props => ({
  paddingLeft: 8,
  borderLeft: `1px solid ${props.theme.color.content.divider}`,
}))

const Container = emotionStyled.div({
  display: `flex`,
  gap: `40px`,
  flexDirection: `column`,
})

const LargeLabelCard = emotionStyled(ExternalLabelCard)({
  maxHeight: 600,
})

const CommentsCard = emotionStyled(LargeLabelCard)({
  flex: 3,
})

const HistoryCard = emotionStyled(LargeLabelCard)({
  flex: 1,
  padding: `1.5rem 0`,
})

const ScrollContainer = emotionStyled.div({
  minHeight: `100px`,
  height: `100%`,
  overflowY: `auto`,
})

const HistoryScrollableList = emotionStyled(ScrollContainer)({
}).withComponent(TicketHistoryList)