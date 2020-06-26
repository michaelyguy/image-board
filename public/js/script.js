/// NOT ALLOWED TO USE =>function OR ANY ES6 ///
(function () {
    new Vue({
        el: "#main",
        data: {
            seen: false,
            images: [],
            // ADDING DATA PROPERTIES THAT WILL STORE FOR THE IMPUT FIELD
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
                self.images = response.data;
            });
        },

        methods: {
            /// "THIS" IS YOUT FRIEND ////
            handleClick: function (event) {
                event.preventDefault();
                console.log("this:", this);

                //// WE USE FORMDATA ONLY COS WE ARE WORKING WITH A FILE!! ///
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("desctiption", this.description);
                formData.append("user", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function (response) {
                        console.log("this is the response: ", response);
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
