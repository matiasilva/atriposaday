window.Dropzone.options.questionCreate = {
    maxFilesize: 4,
    acceptedFiles: "image/*",
    maxFiles: 1,
    autoProcessQueue: false,
    init: function () {
        document.getElementById("question-create-submit").addEventListener("click", (evt) => {
            this.processQueue();
        })
    }
};
