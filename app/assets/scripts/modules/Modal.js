import $ from 'jquery';

class Modal {
  // This constructor function saves any elements that the Modal class will
  // need to interact with.
  constructor() {
    // Get in touch button - added class="open-modal" to target the button.
    this.openModalButton = $(".open-modal");
    // Main modal that we will want to reveal.
    this.modal = $(".modal");
    // The modals close button.
    this.closeModalButton = $(".modal__close");
    // Start listening for events as soon as the page loads.
    this.events();
  }

  events() {
    // Clicking the open modal button.
    // Bind the openModal function to the this object so the methods here are
    // accessible to it when it runs. Otherwise the "this" will point to the
    // object that called the function. In this case it would be document.
    this.openModalButton.click(this.openModal.bind(this));

    // Clicking the X close modal button.
    this.closeModalButton.click(this.closeModal.bind(this));

    // Pushes any key.
    $(document).keyup(this.keyPressHandler.bind(this));
  }

  keyPressHandler(e) {
    // Listen for any key press. Check if it is the escape key (code 27).
    if (e.keyCode === 27) {
      this.closeModal();
    }
  }

  openModal() {
    this.modal.addClass("modal--is-visible");
    // Since the get in touch button has href="#", the default behavior when
    // clicking it is to scroll to the top of the page. return false prevents
    // that default behavior from happening.
    return false;
  }

  closeModal() {
    this.modal.removeClass("modal--is-visible");
  }
}

export default Modal;
