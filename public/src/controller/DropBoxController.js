class DropBoxController {
  constructor() {
    this.btnSendFileEl = document.querySelector('#btn-send-file');
    this.inputFileEl = document.querySelector('#files');

    this.initEvents();
  }
  initEvents() {
    this.btnSendFileEl.addEventListener('click', (e) => {
      this.inputFileEl.click();
    });
  }
}
