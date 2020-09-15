/// NOT ALLOWED TO USE =>function OR ANY ES6 ///
(function () {
    Vue.component("image-view", {
        template: "#template",
        props: ["id"],
        data: function () {
            return {
                image: "",
                title: "",
                description: "",
                username: "",
                comment: "",
                comment_username: "",
                comments: [],
                created_at: "",
            };
        },

        mounted: function () {
            var self = this;
            axios
                .get("/image/" + this.id)
                .then(function (response) {
                    // console.log("-----SELF------");
                    // console.log(self.id);
                    // console.log("-----RESPONSE------");
                    // console.log(response);
                    self.title = response.data.title;
                    self.description = response.data.description;
                    self.username = response.data.username;
                    self.image = response.data.url;
                })
                .catch(function (err) {
                    console.log("ERROR IN GET /IMAGE/ + THIS.ID", err);
                });
            axios
                .get("/comments/" + this.id)
                .then(function (response) {
                    // console.log("-----RESPONSE IN GET COMMENTs----");
                    // console.log(response);
                    // console.log("-----SELF IN GET COMMENTs----");
                    // console.log(self);
                    self.comment = response.data.comment;
                    self.comment_username = response.data.comment_username;
                    self.comments = response.data;
                    // console.log("this", self);
                })
                .catch(function (err) {
                    console.log("ERROR IN GET /COMENTS", err);
                });
        },

        methods: {
            closeModal: function () {
                this.$emit("close");
            },
            handleClick: function (e) {
                e.preventDefault();
                // console.log("this:", this);
                var self = this;
                // console.log("-----SELF-------");
                // console.log(self);
                axios
                    .post("/comment/" + self.id, {
                        comment: self.comment,
                        comment_username: self.comment_username,
                    })
                    .then(function (response) {
                        // console.log("----response.data----");

                        // console.log(response.data);
                        self.comments.unshift(response.data);
                        // console.log("---------RESPONSE IN POST CLICK-------");
                        // console.log("this is the response: ", response);
                        // self.images.unshift(response.data);
                    })
                    .catch(function (err) {
                        console.log("error ins POST /upload: ", err);
                    });
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            id: null,
            lowestIdOnScreen: null,
            pageOffset: window.scrollX == 0,
        },

        mounted: function () {
            var self = this;
            axios.get("/images").then(function (response) {
                // console.log("this: ", self);
                // console.log("response from images:", response);
                self.images = response.data;
                // console.log("---SELF.IMAGES--");
                // console.log(self.images);

                //// SHOW THE MEXT GROUP OF PHOTOS -9 I ALREADY SHOWING ////
                self.lowestIdOnScreen = self.images[self.images.length - 1].id;
                // console.log("-------self.lowestIdOnScreen-----");

                // console.log(self.lowestIdOnScreen);
            });
        },

        methods: {
            handleClick: function (e) {
                e.preventDefault();
                // console.log("this:", this);
                var self = this;

                //// WE USE FORMDATA ONLY COS WE ARE WORKING WITH A FILE!! ///
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("user", this.username);
                formData.append("file", this.file);
                ///////////////////////////////////////////////////////////////

                axios
                    .post("/upload", formData)
                    .then(function (response) {
                        // console.log("this is the response: ", response);
                        self.images.unshift(response.data);
                    })
                    .catch(function (err) {
                        console.log("error ins POST /upload: ", err);
                    });
            },
            handleChange: function (e) {
                // console.log("handleChange is running!");
                // console.log("file: ", e.target.files[0]);

                this.file = event.target.files[0];
                // console.log("this after adding file to data:", this);
            },
            showid: function (id) {
                // console.log("-----IMG.ID----");
                // console.log(id);
                this.id = id;
            },
            closeMe: function () {
                this.id = null;
            },

            scrollImages: function () {
                let self = this;
                // console.log("----self.lowestIdOnScreen-----");
                // console.log(self.lowestIdOnScreen);

                axios
                    .get("/showMore/" + self.lowestIdOnScreen)
                    .then(function (response) {
                        // console.log("-----RESPONSE IN GET SHOWMORE------");
                        // console.log(response);
                        for (var i = 0; i < response.data.length; i++) {
                            self.images.push(response.data[i]);
                            if (
                                response.data[i].id == response.data[i].lowestId
                            ) {
                                // console.log("hide btn");
                                let moreBtn = document.getElementById("more");
                                // console.log(
                                //     "moreBtn is heerererererer",
                                //     moreBtn
                                // );
                                moreBtn.classList.add("hide-button");
                            }
                        }

                        self.lowestIdOnScreen =
                            self.images[self.images.length - 1].id;
                    });
            },
        },
    });
})();
