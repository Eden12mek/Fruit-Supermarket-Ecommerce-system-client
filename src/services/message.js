import axios from 'axios';
import SummaryApi from '../common';

// Create message
export const createMessage = (messageData) => async (dispatch) => {
  try {
    dispatch({
      type: "MessageCreateRequest",
    });

    const { data } = await axios.post(SummaryApi.messageCreate.url, messageData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    dispatch({
      type: "MessageCreateSuccess",
      payload: data.message,
    });
    
    return data.success;
  } catch (error) {
    dispatch({
      type: "MessageCreateFail",
      payload: error.response?.data?.message || error.message,
    });
    return false;
  }
};

// Get all messages
export const getAllMessages = () => async (dispatch) => {
  try {
    dispatch({
      type: "GetAllMessagesRequest",
    });

    const { data } = await axios.get(SummaryApi.getAllmessage.url, {
      withCredentials: true,
    });
    
    dispatch({
      type: "GetAllMessagesSuccess",
      payload: data.messages,
    });
  } catch (error) {
    dispatch({
      type: "GetAllMessagesFail",
      payload: error.response.data.message,
    });
  }
};

// Delete message
export const deleteMessage = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "DeleteMessageRequest",
    });

    const { data } = await axios.delete(`${SummaryApi.messageDelete.url}/${id}`, {
      withCredentials: true,
    });
    
    dispatch({
      type: "DeleteMessageSuccess",
      payload: id,
    });
    
    return data.success;
  } catch (error) {
    dispatch({
      type: "DeleteMessageFail",
      payload: error.response?.data?.message || error.message,
    });
    return false;
  }
};