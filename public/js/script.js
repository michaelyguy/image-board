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
            };
        },

        // mounted: function () {
        //     console.log("------PROPS-------");
        //     console.log(this.id);
        // },
        mounted: function () {
            var self = this;
            axios.get("/image/" + this.id).then(function (response) {
                console.log("-----SELF------");
                console.log(self.id);
                console.log("-----RESPONSE------");
                console.log(response);
                self.title = response.data.title;
                self.description = response.data.description;
                self.username = response.data.username;
                self.image = response.data.url;
                console.log("-----response.data.url-------");
                console.log(response.data.url);
            });
        },

        methods: {
            closeModal: function () {
                console.log("about to emit from the component!!!!");
                this.$emit("close");
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
            // showImageView: null,
            id: null,
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
                console.log(
                    "closeMe in the instance / parent is running! This was emitted from the component"
                );
                this.id == null;
            },
        },
    });
})();
