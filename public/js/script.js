/// NOT ALLOWED TO USE =>function OR ANY ES6 ///
(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },

        mounted: function () {
            var self = this;
            axios.get("/images").then(function (response) {
                console.log("this: ", self);
                console.log("response from images:", response);
                self.images = response.data.reverse();
            });
        },

        methods: {
            /// "THIS" IS YOUT FRIEND ////
            handleClick: function (e) {
                e.preventDefault();
                console.log("this:", this);
                var self = this;

                //// WE USE FORMDATA ONLY COS WE ARE WORKING WITH A FILE!! ///
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("user", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function (response) {
                        console.log("this is the response: ", response);
                        self.images.unshift(response.data);
                    })
                    .catch(function (err) {
                        console.log("error ins POST /upload: ", err);
                    });
            },
            handleChange: function (event) {
                console.log("handleChange is running!");
                console.log("file: ", event.target.files[0]);

                this.file = event.target.files[0];
                console.log("this after adding file to data:", this);
            },
        },
    });
})();
