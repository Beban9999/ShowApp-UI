import Swal from 'sweetalert2';

export const useAlert = () => {
  const showConfirmationPopup = async (message: string, confirmButtonText: string = 'Yes', cancelButtonText: string = 'No') => {
    return Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    });
  };

  return { showConfirmationPopup };
};
