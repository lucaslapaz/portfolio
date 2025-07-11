console.clear();

let toastContainer;

const createToast = function(type, message){
    const toast = document.createElement('div');
    let className = '';
    switch(type){
        case "success":
            className = "toast toast-success";
            break;
        case "error":
            className = "toast toast-error";
            break;
        case "warning":
            className = "toast toast-warning";
            break;
        default:
            className = "toast toast-success";
            break;
    }
    toast.className = className;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => { toast.remove()}, 500);
    }, 5000);
}

function showToast(type, message){
    const errorEvent = new CustomEvent("show-toast", {
        detail: {
            type: type,
            message: message
        }
    })
    document.dispatchEvent(errorEvent);
}


document.addEventListener("DOMContentLoaded", () => {
    toastContainer = document.querySelector("toast-container");

    if(!toastContainer){
        toastContainer = document.createElement('div');
        toastContainer.className = "toast-container";
        document.body.appendChild(toastContainer);
    }

    document.addEventListener("show-toast", (event) => {
        const {type, message} = event.detail;
        createToast(type, message);
    })
})