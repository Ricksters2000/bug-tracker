import emotionStyled from "@emotion/styled";
import {Box, Chip, Stack, TextField} from "@mui/material";
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
  return ticket
}

export default function Ticket() {
  const initialTicket = useLoaderData<TicketInfo>()
  const fetcher = useFetcher<TicketInfo>()

  const updateTicket = (updateTicketAction: UpdateTicketAction, previousValue: TicketPreviousValue) => {
    const actionWithId: FullUpdateTicketAction = {
      userId: 1,
      ticketId: ticket.id,
      action: updateTicketAction,
      previousValue
    }
    fetcher.submit(actionWithId, {
      method: `post`,
      encType: `application/json`,
    })
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
          <Box display={`flex`} gap={1}>
            <EditableDescription
              multilineTextInput
              text={ticket.content}
              Component={BodyText}
              onSave={(text) => updateTicket({type: `content`, data: text}, ticket.content)}
            />
            <Stack flex={1}>
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
              <CardSubInfo label="Created Date" details={<InformationalText>{ticket.createdDate.toDateString()}</InformationalText>}/>
              {ticket.dueDate && <CardSubInfo label="Due Date" details={<InformationalText>{ticket.dueDate?.toDateString()}</InformationalText>}/>}
            </Stack>
          </Box>
        </ExternalLabelCard>
        <Box display={`flex`} gap={`40px`}>
          <CommentsCard label="Comments">
            <Stack spacing={`20px`} height={`100%`}>
              <ScrollContainer></ScrollContainer>
              <TextField
                variant="filled"
                placeholder="Comment here..."
                multiline
                rows={5}
              />
            </Stack>
          </CommentsCard>
          <HistoryCard label="History">
            <ScrollContainer>
              {ticket.history.map((history, i) => {
                return (
                  <HistoryItem key={`${i}-${history.date}`}>
                    <HistoryItemInnerContainer>
                      <HistoryDate>{history.date.toDateString()}</HistoryDate>
                      <BodyText>
                        {history.userId} changed<HistoryTypeText> {history.action.type} </HistoryTypeText> from '<HistoryPreviousValue>{history.previousValue}</HistoryPreviousValue>' to '{history.action.data}'
                      </BodyText>
                    </HistoryItemInnerContainer>
                  </HistoryItem>
                )
              })}
            </ScrollContainer>
          </HistoryCard>
        </Box>
      </Container>
    </div>
  )
}

const EditableDescription = emotionStyled(EditableText)({
  flex: 3,
  alignItems: `flex-start`,
})

const Container = emotionStyled.div({
  display: `flex`,
  gap: `40px`,
  flexDirection: `column`,
})

const CommentsCard = emotionStyled(ExternalLabelCard)({
  flex: 3,
})

const HistoryCard = emotionStyled(ExternalLabelCard)({
  flex: 1,
  padding: `1.5rem 0`,
})

const ScrollContainer = emotionStyled.div({
  minHeight: `100px`,
  height: `100%`,
  maxHeight: `450px`,
  overflowY: `auto`,
})

const HistoryItem = emotionStyled.div(props => ({
  padding: `.8rem 0`,
  borderBottom: `1px solid ${props.theme.color.content.divider}`
}))

const HistoryItemInnerContainer = emotionStyled.div({
  padding: `0 1.5rem`,
})

const HistoryDate = emotionStyled(InformationalText)({
})

const HistoryPreviousValue = emotionStyled.span({
  textDecoration: `line-through`,
})

const HistoryTypeText = emotionStyled.span({
  fontWeight: 700,
})