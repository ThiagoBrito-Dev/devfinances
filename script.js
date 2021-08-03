const Modal = {
  open() {
    const overlay = document.querySelector(".modal-overlay");
    overlay.classList.add("active");
  },
  close() {
    const overlay = document.querySelector(".modal-overlay");
    overlay.classList.remove("active");
  },
};
