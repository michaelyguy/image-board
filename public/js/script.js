/// NOT ALLOWED TO USE =>function OR ANY ES6 ///
(function () {
    new Vue({
        el: "#main",
        data: {
            seen: false,
            images: [],
        },

        mounted: function () {
            var self = this;
            axios.get("/images").then(function (response) {
                console.log("this: ", self);
                console.log("response from cities:", response);
                self.images = response.data;
            });
        },

        methods: {
            myFunction: function () {
                console.log("my function is running!!!");
            },
        },
    });
})();
