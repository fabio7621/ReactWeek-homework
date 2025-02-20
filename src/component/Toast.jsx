import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Toast as BsToast } from "bootstrap/dist/js/bootstrap.esm";
import { useDispatch } from "react-redux";
import { removeMessage } from "../../redux/toastSlice";

export default function ToastMessage() {
  const messages = useSelector((state) => state.toast.messages);
  const toastRef = useRef({});
  const dispatch = useDispatch();
  useEffect(() => {
    messages.forEach((message) => {
      const toastElement = toastRef.current[message.id];
      if (toastElement) {
        const toastInstance = new BsToast(toastElement);
        toastInstance.show();
        setTimeout(() => {
          dispatch(removeMessage(message.id));
        }, 2000);
      }
    });
  }, [messages]);

  const handleClose = (messagesId) => {
    dispatch(removeMessage(messagesId));
  };

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1000 }}>
      {messages.map((message) => (
        <div key={message.id} ref={(el) => (toastRef.current[message.id] = el)} className="toast " role="alert" aria-live="assertive" aria-atomic="true">
          <div className={`toast-header text-white bg-${message.status === "success" ? "success" : "danger"}`}>
            <strong className="me-auto">{message.status === "success" ? "成功" : "失敗"}</strong>
            <button onClick={() => handleClose(message.id)} type="button" className="btn-close"></button>
          </div>
          <div className="toast-body">{message.text}</div>
        </div>
      ))}
    </div>
  );
}
