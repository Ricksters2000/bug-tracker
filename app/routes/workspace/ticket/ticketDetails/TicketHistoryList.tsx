import emotionStyled from '@emotion/styled';
import React from 'react';
import {TicketHistory} from '~/server/db/ticketDb';
import {BodyText, InformationalText} from '~/typography';
import {useAppContext} from '../../AppContext';
import {getUserFullNameFromUser} from '~/utils/getUserFullNameFromUser';

type Props = {
  className?: string;
  history: Array<TicketHistory>;
}

const notFoundUserPlaceholder = `Missing User`
export const TicketHistoryList: React.FC<Props> = (props) => {
  const {allUsers} = useAppContext()
  return (
    <div className={props.className}>
      {props.history.map((history, i) => {
        let field: string = history.action.type
        let data = history.action.data
        let displayChangedText = true
        let displayNewData = true
        const user = allUsers.find(userPublic => userPublic.id === history.userId)
        const username = user ? getUserFullNameFromUser(user) : notFoundUserPlaceholder
        switch (history.action.type) {
          case `content`:
            field = `description`
            break
          case `assignUser`:
            field = `Assigned User`
            const assignedUser = allUsers.find(userPublic => userPublic.id === data)
            data = assignedUser ? getUserFullNameFromUser(assignedUser) : notFoundUserPlaceholder
            displayChangedText = false
            break
          case `removeUser`:
            field = `Removed User`
            const removedUser = allUsers.find(userPublic => userPublic.id === data)
            data = removedUser ? getUserFullNameFromUser(removedUser) : notFoundUserPlaceholder
            displayChangedText = false
            break
          case `isClosed`:
            field = `${data ? `Closed` : `Opened`} Ticket`
            displayChangedText = false
            displayNewData = false
            break
        }
        return (
          <HistoryItem key={`${i}-${history.date}`}>
            <HistoryItemInnerContainer>
              <HistoryDate>{history.date.toDateString()}</HistoryDate>
              <BodyText>
                {`${username} ${displayChangedText ? `changed` : ``}`}
                <HistoryTypeText> {field} </HistoryTypeText>
                {history.previousValue && (
                  <>
                    from '<HistoryPreviousValue>{history.previousValue}</HistoryPreviousValue>{`' to `}
                  </>
                )}
                {displayNewData && `'${data}'`}
              </BodyText>
            </HistoryItemInnerContainer>
          </HistoryItem>
        )
      })}
    </div>
  )
}

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
  textTransform: `capitalize`,
})