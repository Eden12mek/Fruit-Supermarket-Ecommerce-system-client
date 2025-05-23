const initialState = {
  messages: [],
  loading: false,
  error: null,
  success: false
};

export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "MessageCreateRequest":
    case "GetAllMessagesRequest":
    case "DeleteMessageRequest":
      return {
        ...state,
        loading: true,
      };
    case "MessageCreateSuccess":
      return {
        ...state,
        loading: false,
        success: true,
      };
    case "GetAllMessagesSuccess":
      return {
        ...state,
        loading: false,
        messages: action.payload,
      };
    case "DeleteMessageSuccess":
      return {
        ...state,
        loading: false,
        messages: state.messages.filter((msg) => msg._id !== action.payload),
      };
    case "MessageCreateFail":
    case "GetAllMessagesFail":
    case "DeleteMessageFail":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "ClearErrors":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};