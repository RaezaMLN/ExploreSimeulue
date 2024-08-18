import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export const showAlert = (title: string, text: string, icon: any) => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: "OK",
    buttonsStyling: false, // Disable default button styles
    customClass: {
      confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700', // Custom style for confirm button
    },
  });
};

export const showConfirmAlert = (
  title: string,
  text: string,
  icon: any,
  confirmButtonText: string,
  cancelButtonText: string
) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    buttonsStyling: false, // Disable default button styles
    customClass: {
      confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700', // Custom style for confirm button
      cancelButton: 'bg-gray-400 text-gray-800 px-4 py-2 rounded ml-2 hover:bg-gray-500!important', // Custom style for cancel button
    },
  });
};
