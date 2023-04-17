import "./style.css"
export default function handleToast(divElemId, {
    title = "",
    message= "",
    type= "success",
    duration = 6000
}) {
    const icons = {
        success: "fa-sharp fa-solid fa-circle-check",
        info: "fa-solid fa-circle-info",
        warning: "fa-solid fa-triangle-exclamation",
        error: "fa-solid fa-circle-exclamation"
    }

    const icon = icons[type]
    const main = document.getElementById(divElemId)

    if (main) {
        const toast = document.createElement("div")
        toast.classList.add("toast")
        toast.classList.add(`toast--${type}`)
        toast.innerHTML = `
            <div class="toast__icon">
                <i class=${icon}></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fa-sharp fa-regular fa-circle-xmark"></i>
            </div>
        `
        const delay = (duration/1000).toFixed(2)
        toast.style.animation = `slideInLeft ease .5s, fadeOut linear 1s ${delay}s forwards`
        main.appendChild(toast)
        
        const autoRemoveId = setTimeout(()=> {
            main.removeChild(toast)
        }, duration + 1000) // 1000 là thời gian thực thi của hàm fadeOut

       toast.onclick = (e) => {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast)
                clearTimeout(autoRemoveId)
            }
       }
    }
}
