class DropBoxController {
  constructor () {
    this.btnSendFileEl = document.querySelector('#btn-send-file');
    this.inputFileEl = document.querySelector('#files');
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

          ajax.onload = (event) => {
            try {
              resolve(JSON.parse(ajax.responseText));
            } catch (event) {
              reject(event);
            }
          };

          ajax.onerror = (event) => {
            reject(event);
          };

          ajax.upload.onprogress = (event) => {
            this.uploadProgress(event, file);
          };

          let formData = new FormData();
          formData.append('input-file', file);
          // Count time on init upload file
          this.startUploadTime = Date.now();

          ajax.send(formData);
        })
      );
    });
    return Promise.all(promises);
  }

  uploadProgress(event, file) {
    // Count time on init upload file
    let timeSpent = Date.now() - this.startUploadTime;

    let loaded = event.loaded;
    let total = event.total;
    let porcent = parseInt((loaded / total) * 100);
    let timeLeft = ((100 - porcent) * timeSpent) / porcent
    this.progressBarEl.style.width = `${porcent}%`;

    this.filenameEl.innerHTML = file.name;
    this.timeleftEl.innerHTML = '';

    console.log(timeSpent, timeLeft, porcent);
  }
}
