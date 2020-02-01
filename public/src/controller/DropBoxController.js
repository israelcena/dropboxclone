class DropBoxController {
  constructor() {
    this.btnSendFileEl = document.querySelector('#btn-send-file');
    this.inputFileEl = document.querySelector('#files');

    //SnackProgress
    this.snackModalEl = document.querySelector('#react-snackbar-root');
    this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
    this.timeleftEl = this.snackModalEl.querySelector('.timeleft');
    this.filenameEl = this.snackModalEl.querySelector('.filename');

    this.initEvents();
  }

  initEvents() {
    this.btnSendFileEl.addEventListener('click', (e) => {
      this.inputFileEl.click();
    });

    this.inputFileEl.addEventListener('change', (e) => {
      this.upLoadTask(e.target.files);

      this.snackModalEl.style.display = 'block';
    });
  }

  upLoadTask(files) {
    let promises = [];

    [...files].forEach((file) => {
      promises.push(
        new Promise((resolve, reject) => {
          let ajax = new XMLHttpRequest();

          ajax.open('POST', '/upload');

          ajax.onload = (e) => {
            try {
              resolve(JSON.parse(ajax.responseText));
            } catch (e) {
              reject(e);
            }
          };

          ajax.onerror = (e) => {
            reject(e);
          };

          ajax.upload.onprogress = (e) => {
            this.uploadProgress(e, file);
          };

          let formData = new FormData();
          formData.append('input-file', file);
          ajax.send(formData);
        })
      );
    });
    return Promise.all(promises);
  }

  uploadProgress(e, file) {
    let loaded = e.loaded;
    let total = e.total;
    let porcent = parseInt((loaded / total) * 100);

    this.progressBarEl.style.width = `${porcent}%`;
  }
}
