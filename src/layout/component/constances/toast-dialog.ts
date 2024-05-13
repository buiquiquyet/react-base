export  enum ToastStatus {
    success="success",
    warning="warning",
    error="error",
    info="info"
}
import { toast } from "react-toastify";
export class ToastMessage {
    public static show(type: string, message: string, onClose?: () => void)  {
        return toast[type as keyof typeof ToastStatus](message, {autoClose: 1800, onClose})
    }
}