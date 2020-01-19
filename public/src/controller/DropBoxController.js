class DropBoxController {
  constructor() {
    this.btnSendFileEl = document.querySelector('#btn-send-file');
    this.inputFileEl = document.querySelector('#files');
    this.snackModalEl = document.querySelector('#react-snackbar-root');

    this.initEvents();
  }
  initEvents() {
    this.btnSendFileEl.addEventListener('click', (e) => {
      this.inputFileEl.click();
    });

    this.inputFileEl.addEventListener('change', (e) => {
      console.log(e.target.files);
      this.snackModalEl.style.display = 'block';
    });
  }
}
