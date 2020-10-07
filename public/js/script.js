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
            // var prevScrollpos = window.pageYOffset;
            // window.onscroll = function () {
            //     var currentScrollPos = window.pageYOffset;
            //     if (prevScrollpos > currentScrollPos) {
            //         document.getElementById("scroll").style.top = "0";
            //     } else {
            //         document.getElementById("scroll").style.top = "-50px";
            //     }
            //     prevScrollpos = currentScrollPos;
            // };

            var self = this;
            axios
                .get("/image/" + this.id)
                .then(function (response) {
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
                    self.comment = response.data.comment;
                    self.comment_username = response.data.comment_username;
                    self.comments = response.data;
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
                var self = this;

                axios
                    .post("/comment/" + self.id, {
                        comment: self.comment,
                        comment_username: self.comment_username,
                    })
                    .then(function (response) {
                        self.comments.unshift(response.data);
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
            button: "scroll down",
        },

        mounted: function () {
            var self = this;
            axios.get("/images").then(function (response) {
                self.images = response.data;
                self.lowestIdOnScreen = self.images[self.images.length - 1].id;
            });
            document.addEventListener("scroll", this.onScroll);
        },

        methods: {
            handleClick: function (e) {
                e.preventDefault();
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
                        self.images.unshift(response.data);
                    })
                    .catch(function (err) {
                        console.log("error ins POST /upload: ", err);
                    });
            },
            handleChange: function (e) {
                this.file = event.target.files[0];
            },
            showid: function (id) {
                this.id = id;
            },
            closeMe: function () {
                this.id = null;
            },

            scrollImages: function () {
                let self = this;

                axios
                    .get("/showMore/" + self.lowestIdOnScreen)
                    .then(function (response) {
                        for (var i = 0; i < response.data.length; i++) {
                            self.images.push(response.data[i]);
                            if (
                                response.data[i].id == response.data[i].lowestId
                            ) {
                                let moreBtn = document.getElementById("more");
                                moreBtn.classList.add("hide-button");
                            }
                        }

                        self.lowestIdOnScreen =
                            self.images[self.images.length - 1].id;
                    });
            },
            onScroll() {
                if (window.scrollY <= 100) {
                    this.button = "scroll down";
                } else if (window.scrollY <= 500) {
                    this.button = "";
                } else {
                    this.button = "more";
                }
            },
        },
    });
})();
