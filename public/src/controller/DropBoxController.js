class DropBoxController {
	constructor() {
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
			this.modalShow(true);
			//reset input file
			this.inputFileEl.value = '';
		});
	}

	modalShow(show = true) {
		this.snackModalEl.style.display = show ? 'block' : 'none';
	}

	upLoadTask(files) {
		let promises = [];

		[...files].forEach((file) => {
			promises.push(
				new Promise((resolve, reject) => {
					let ajax = new XMLHttpRequest();

					ajax.open('POST', '/upload');

					ajax.onload = (event) => {
						this.modalShow(false);
						try {
							resolve(JSON.parse(ajax.responseText));
						} catch (event) {
							reject(event);
						}
					};

					ajax.onerror = (event) => {
						this.modalShow(false);
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
		// Count time spent for upload file
		let timeSpent = Date.now() - this.startUploadTime;
		let loaded = event.loaded;
		let total = event.total;
		let porcent = parseInt((loaded / total) * 100);
		let timeLeft = ((100 - porcent) * timeSpent) / porcent;
		this.progressBarEl.style.width = `${porcent}%`;
		this.filenameEl.innerHTML = file.name;
		this.timeleftEl.innerHTML = this.FormatTime(timeLeft);
	}

	FormatTime(duration) {
		let seconds = parseInt((duration / 1000) % 60);
		let minutes = parseInt((duration / (1000 * 60)) % 60);
		let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

		if (duration === Infinity) {
			return `Calculando tempo estimado`;
		}
		if (hours > 0) {
			return `${hours} horas, ${minutes} minutos e ${seconds} segundos restantes`;
		}
		if (minutes > 0) {
			return `${minutes} minutos e ${seconds} segundos restantes`;
		}
		if (seconds > 0) {
			return `${seconds} segundos restantes`;
		}
		return `Concluido`;
	}
}
