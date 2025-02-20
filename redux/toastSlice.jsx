import { createSlice } from "@reduxjs/toolkit";

const toastSlince = createSlice({
  name: "toast",
  initialState: {
    messages: [],
  },
  reducers: {
    pushMessage(state, action) {
      const { text, status } = action.payload;
      const id = new Date().getTime();
      state.messages.push({
        id,
        text,
        status,
      });
    },
    removeMessage(state, action) {
      const messageId = action.payload;
      const index = state.messages.findIndex((message) => message.id === messageId);
      if (index !== -1) {
        state.messages.splice(index, 1);
      }
    },
  },
});

export const { pushMessage, removeMessage } = toastSlince.actions;

export default toastSlince.reducer;
